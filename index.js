import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './native';

AppRegistry.registerComponent(appName, () => App);
