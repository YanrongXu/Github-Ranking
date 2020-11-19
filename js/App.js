import React, {Component} from 'react'
import {Provider} from 'react-redux'
import AppNavigator from './navigator/AppNavigators'
import store from './store'

export default class App extends Component{
    render() {
        /**
         * let the store dispatch to App class
         */
        return <Provider store={store}>
            <AppNavigator />
        </Provider>
    }
}