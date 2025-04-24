import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
import FirebaseMessaging
import RNBootSplash 
import Firebase
import GoogleMaps
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
    var window: UIWindow?
    var reactNativeDelegate: ReactNativeDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()
        
        GMSServices.provideAPIKey("AIzaSyDgqOpCGS62WWYFk-pBEcBo6Rw8hlRaufg")
        
        setupPushNotifications(application)
        
        let delegate = ReactNativeDelegate()
        let factory = RCTReactNativeFactory(delegate: delegate)
        delegate.dependencyProvider = RCTAppDependencyProvider()
        reactNativeDelegate = delegate
        reactNativeFactory = factory
        
        window = UIWindow(frame: UIScreen.main.bounds)
        factory.startReactNative(
            withModuleName: "dabbler",
            in: window,
            launchOptions: launchOptions
        )
        
        return true
    }
    
    private func setupPushNotifications(_ application: UIApplication) {
        // Set notification delegates
        UNUserNotificationCenter.current().delegate = self
        Messaging.messaging().delegate = self
        
        let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
        UNUserNotificationCenter.current().requestAuthorization(options: authOptions) { granted, error in
            if let error = error {
                print("Authorization error: \(error.localizedDescription)")
                return
            }
            
            guard granted else { return }
            
            Messaging.messaging().token { token, error in
                if let error = error {
                    print("Error fetching FCM token: \(error.localizedDescription)")
                } else if let token = token {
                    print("FCM Token: \(token)")
                }
            }
        }
        
        application.registerForRemoteNotifications()
    }

    func application(_ application: UIApplication, 
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
        print("APNs Token: \(deviceToken.map { String(format: "%02.2hhx", $0) }.joined())")
    }
    
    func application(_ application: UIApplication, 
                     didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed to register for remote notifications: \(error.localizedDescription)")
    }

    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("Firebase registration token: \(String(describing: fcmToken))")
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        let userInfo = notification.request.content.userInfo
        print("Foreground notification received: \(userInfo)")
        completionHandler([[.banner, .sound, .badge]])
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        print("Notification interaction received: \(userInfo)")
        completionHandler()
    }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
    override func sourceURL(for bridge: RCTBridge) -> URL? {
        return self.bundleURL() 
    }
    
    override func customize(_ rootView: RCTRootView!) {
        super.customize(rootView)
        RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
    }

    override func bundleURL() -> URL? {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(
            forBundleRoot: "index",
            fallbackExtension: nil
        )
        #else
        return Bundle.main.url(
            forResource: "main",
            withExtension: "jsbundle"
        )
        #endif
    }
}