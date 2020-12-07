import React from 'react';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import {connect} from 'react-redux';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import {DeviceEventEmitter} from 'react-native'

const TABS = {
  // In here we setting out the page router
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: 'Hot',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons name={'whatshot'} size={26} style={{color: tintColor}} />
      ),
    },
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
      ),
    },
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: 'Favorite',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons name={'favorite'} size={26} style={{color: tintColor}} />
      ),
    },
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: 'My',
      tabBarIcon: ({tintColor, focused}) => (
        <Entypo name={'user'} size={26} style={{color: tintColor}} />
      ),
    },
  },
};

class DynamicTabNavigator extends Component {
  constructor(props) {
    super(props);
  }
  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs;
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};
    PopularPage.navigationOptions.tabBarLabel = 'Hot';
    return (this.Tabs = createAppContainer(
      createBottomTabNavigator(tabs, {
        tabBarComponent: (props) => {
          return <TabBarComponent theme={this.props.theme} {...props} />;
        },
      }),
    ));
  }
  render() {
    const Tab = this._tabNavigator();
    return (
      <Tab
        onNavigationStateChange={(prevState, newState, action) => {
          DeviceEventEmitter.emit(EventTypes.bottom_tab_select, {
            from: prevState.index,
            to: newState.index,
          });
        }}
      />
    );
  }
}

class TabBarComponent extends React.Component {
  render() {
    return <BottomTabBar {...this.props} activeTintColor={this.props.theme} />;
  }
}

const mapStateToProps = (state) => ({
  theme: state.theme.theme,
});
export default connect(mapStateToProps)(DynamicTabNavigator);
