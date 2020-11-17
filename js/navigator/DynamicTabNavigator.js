import React from 'react'
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Component } from 'react'
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs'


const TABS = { // In here we setting out the page router
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: 'Hot',
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
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
};

export default class DynamicTabNavigator extends Component {
    constructor(props) {
        super(props);
    }
    _tabNavigator() {
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};
        PopularPage.navigationOptions.tabBarLabel = 'Hot';
        return createAppContainer(createBottomTabNavigator(
            tabs, {
                tabBarComponent: tabBarComponent,
            }
        ))
    }
    render() {
        const Tab = this._tabNavigator();
        return <Tab />
    }
}

class tabBarComponent extends React.Component{
    constructor(props) {
        super(props);
        this.theme={
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime(),
        }
    }
    render() {
        const  {routes, index} = this.props.navigation.state;
        if (routes[index].params) {
            const {theme}=routes[index].params;
            if (theme&&theme.updateTime > this.theme.updateTime) {
                this.theme = theme
            }
        }
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.theme.tintColor || this.props.activeTintColor}
        />
    }
}