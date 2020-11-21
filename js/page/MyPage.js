import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native'
import {connect} from 'react-redux'
import actions from '../action'


class MyPage extends Component{
    render() {
        const {navigation} = this.props
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>MyPage</Text>
                <Button
                    title={'change theme'}
                    onPress={() => this.props.onThemeChange('#8a3')}
                />
                <Text>PopularTab</Text>
                <Text onPress={() => {
                    NavigationUtil.goPage({}, 'DetailPage')
                }}>Go to detail page</Text>
                <Button title = {'use fetch'}onPress={() => {
                    NavigationUtil.goPage({}, 'FetchDemoPage')
                }} />
                <Button title = {'use AsyncStorage'}onPress={() => {
                    NavigationUtil.goPage({}, 'AsyncStorageDemoPage')
                }} />
                <Button title = {'use dataStore'}onPress={() => {
                    NavigationUtil.goPage({}, 'DataStoreDemoPage')
                }} />
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

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})
export default connect(null, mapDispatchToProps)(MyPage)