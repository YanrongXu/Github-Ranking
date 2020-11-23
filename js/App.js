import React, {Component} from 'react'
import {StyleSheet, SafeAreaView} from 'react-native'
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
            <SafeAreaView style={styles.container}>
                <AppNavigator />
            </SafeAreaView>
            <Toast ref={(ref) => Toast.setRef(ref)} />

        </Provider>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray'
    }
})