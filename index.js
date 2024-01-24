/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// XMLHttpRequest = GLOBAL.XMLHttpRequest
// // To see all the requests in the chrome Dev tools in the network tab.
// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//   GLOBAL.originalXMLHttpRequest :
//   GLOBAL.XMLHttpRequest;


AppRegistry.registerComponent(appName, () => App);
