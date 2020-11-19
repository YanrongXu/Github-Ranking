/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './js/App';
import WelcomePage from './js/page/WelcomePage';
import {name as appName} from './app.json';
import AppNavigators from './js/navigator/AppNavigators'

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
