import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

export default class PopularPage extends Component{
    constructor(props){
        super(props);
        this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'PHP']
    }
    _genTabs () {
        const tabs={};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`]={
                screen: props => <PopularTab {...props} tabLabel={item} />,
                navigationOptions: {
                    title: item,

                }
            }
        })
        return tabs;
    }
    render() {
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(),
            {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    style: {
                        backgroundColor: '#a67',
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        ))

        return(
            <View style={styles.container}>
                <TabNavigator />
            </View>
        )
    }
}
class PopularTab extends Component {
    render() {
        return (
            <View style={styles.container}>
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
        marginTop: 30
    },
    welcome: {
        fontSize: 20, 
        textAlign: 'center',
        margin: 10,
    },
    tabStyle: {
        minWidth: 50
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        marginTop:6,
        marginBottom: 6
    }
})