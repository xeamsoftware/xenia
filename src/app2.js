import React, { Component, useMemo } from 'react';
import {Text, TextInput, Alert} from 'react-native';
import DatePicker from 'react-native-datepicker'
import {Provider} from 'react-redux';
import {createStore} from 'redux';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification from "react-native-push-notification";
import reducers from './reducers';
import RouterComponent from './Router';

  class App extends Component {

  render() {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    if(TextInput.defaultProps == null ) TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false; 
    if(DatePicker.defaultProps == null ) DatePicker.defaultProps = {};
    DatePicker.defaultProps.allowFontScaling = false;  
      // PushNotification.configure({
      //     onRegister: function(token) {
      //         //process token
      //         console.log("@@@ ### PUSH NOTIFICATION TOKEN: ", token)
      //     },
      //     onNotification: function(notification) {
      //         // process the notification
      //         // required on iOS only
      //         notification.finish(PushNotificationIOS.FetchResult.NoData);
      //     },
      //     permissions: {
      //         alert: true,
      //         badge: true,
      //         sound: true
      //     },
      //     popInitialNotification: true,
      //     requestPermissions: true,
      // })
      return (
          <Provider store={createStore(reducers)}>
              <RouterComponent />        
          </Provider>
      )}
  }

  

  export default App;