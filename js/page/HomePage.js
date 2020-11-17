import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native'
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation'
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'


export default class HomePage extends Component{
    _tabNavigator () {
        return createAppContainer(
            createBottomTabNavigator({
                PopularPage: {
                    screen: PopularPage,
                    navigationOptions: {
                        tabBarLabel: 'Hot',
                        tabBarIcon: ({tintColor, focused}) => (
                            <MaterialIcons
                                name={'whatshot'}
                                size={27}
                                style={{color: tintColor}}
                            />
                        )
                    }
                },
                TrendingPage: {
                    screen: TrendingPage,
                    navigationOptions: {
                        tabBarLabel: 'Trending',
                        tabBarIcon: ({tintColor, focused}) => (
                            <Ionicons
                                name={'md-trending-up'}
                                size={26}
                                style={{color: tintColor}}
                            />
                        )
                    }
                },
                FavoritePage: {
                    screen: FavoritePage,
                    navigationOptions: {
                        tabBarLabel: 'Favorite',
                        tabBarIcon: ({tintColor, focused}) => (
                            <MaterialIcons
                                name={'favorite'}
                                size={26}
                                style={{color: tintColor}}
                            />
                        )
                    }
                },
                MyPage: {
                    screen: MyPage,
                    navigationOptions: {
                        tabBarLabel: 'My',
                        tabBarIcon: ({tintColor, focused}) => (
                            <Entypo
                                name={'user'}
                                size={26}
                                style={{color: tintColor}}
                            />
                        )
                    }
                },
            })
        )
    }
    render() {
        const Tab = this._tabNavigator();
        return <Tab />
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