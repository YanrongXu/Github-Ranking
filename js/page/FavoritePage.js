import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-toast-message';
import NavigationBar from '../common/NavigationBar';
import {DeviceEventEmitter} from 'react-native';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import TrendingItem from '../common/TrendingItem';
import EventTypes from '../util/EventTypes';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);


export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Hot', 'Trending'];
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };

    let navigationBar = (
      <NavigationBar
        title={'Hot'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    const TabNavigator = createAppContainer(
      createMaterialTopTabNavigator(
        {
          Popular: {
            screen: (props) => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />
            ),
            navigationOptions: {
              title: 'Hot',
            },
          },
          Trending: {
            screen: (props) => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />
            ),
            navigationOptions: {
              title: 'Trending',
            },
          },
        },
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            style: {
              backgroundColor: '#a67',
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
        },
      ),
    );

    return (
      <View style={styles.container}>
        {navigationBar}
        <TabNavigator />
      </View>
    );
  }
}

const pageSize = 10;
class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }
  componentDidMount() {
      this.loadData(true);
      DeviceEventEmitter.addListener(EventTypes.bottom_tab_select, this.listener = data => {
          if (data.to === 2) {
              this.loadData(false);
          }
      });
  }

  componentWillUnmount() {
      DeviceEventEmitter.removeListener(this.listener);
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
      };
    }
    return store;
  }

  onFavorite(item, isFavorite) {
      FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag)
      if (this.storeName === FLAG_STORAGE.flag_popular) {
          console.log('run1')
          DeviceEventEmitter.emit(EventTypes.favorite_change_popular)
      } else {
          DeviceEventEmitter.emit(EventTypes.favorite_change_trending)
      }
  }

  renderItem(data) {
    const item = data.item;
    const Item =
      this.storeName == FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
        projectModel={item}
        onSelect={(callback) => {
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: this.storeName,
              callback,
            },
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    );
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={(item) => '' + (item.item.id || item.item.name)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={THEME_COLOR}
            />
          }
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  favorite: state.favorite,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadFavoriteData: (storeName, isShowLoading) =>
    dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

const FavoriteTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    // minWidth: 50
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
