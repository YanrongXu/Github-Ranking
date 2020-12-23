import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import SplashScreen from 'react-native-splash-screen'

export default class WelcomePage extends Component{
    componentDidMount() {
        this.timer = setTimeout(() => {
            SplashScreen.hide()
            NavigationUtil.resetToHomePage({
                navigation: this.props.navigation
            })
        }, 400);
    }
    componentWillMount() {
        // when page jump, clear the timer
        this.timer&&clearTimeout(this.timer);
    }

    render() {
        return null
    }
}

