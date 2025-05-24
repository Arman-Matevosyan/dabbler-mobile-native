package com.dabbler

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.dabbler.R // <-- Ensure this is correct and `AppTheme` is defined

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "dabbler"

  override fun onCreate(savedInstanceState: Bundle?) {
    setTheme(R.style.AppTheme) // <-- Make sure `AppTheme` exists in res/values/styles.xml
    super.onCreate(null)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    setIntent(intent)
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
