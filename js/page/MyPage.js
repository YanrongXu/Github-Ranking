import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import actions from '../action'
import NavigationBar from '../common/NavigationBar'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

const THEME_COLOR = '#678'

class MyPage extends Component{
    getRightButton () {
        return <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
                onPress={() => {

                }}
            >
                <View style={{padding: 5, marginRight: 8}}>
                    <Feather
                        name={'search'}
                        size={24}
                        style={{color:' white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    getLeftButton(callBack) {
        return <TouchableOpacity
            onPress={callBack}
            style={{padding: 8, paddingLeft: 12}}
        >
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}
            />
        </TouchableOpacity>
    }

    render () {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }

        let navigationBar =
            <NavigationBar
                title={'我的'}
                statusBar={statusBar}
                rightButton={this.getRightButton()}
                leftButton={this.getLeftButton()}
                style={{backgroundColor: THEME_COLOR}}
            />

        return (
            <View style={styles.container}>
                {navigationBar}
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