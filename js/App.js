import React, {Component} from 'react'
import {Provider} from 'react-redux'
import AppNavigator from './navigator/AppNavigators'
import store from './store'
import Toast from 'react-native-toast-message';


export default class App extends Component{
    render() {
        /**
         * let the store dispatch to App class
         */
        return <Provider store={store}>
            <AppNavigator />
            <Toast ref={(ref) => Toast.setRef(ref)} />

        </Provider>
    }
}