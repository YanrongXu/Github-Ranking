import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

export default class WelcomePage extends Component{
    componentDidMount() {
        this.timer = setTimeout(() => {
            // jump to homepage
            NavigationUtil.resetToHomePage(this.props)
        }, 2000);
    }
    componentWillMount() {
        // when page jump, clear the timer
        this.timer&&clearTimeout(this.timer);
    }

    render() {
        return null
    }
}

