import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native'
import NavigationBar from '../common/NavigationBar'

export default class DetailPage extends Component{
    render() {
        let navigationBar = <NavigationBar
            leftButton={}
            title = {'Hot'}
            statusBar= {statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
        return(
            <View style={styles.container}>
                {navigationBar}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20, 
        textAlign: 'center',
        margin: 10,
    }
})