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
import NavigationBar from '../common/NavigationBar';
import {DeviceEventEmitter} from 'react-native';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import TrendingItem from '../common/TrendingItem';
import EventTypes from '../util/EventTypes';




class FavoritePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      const {theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };

    let navigationBar = (
      <NavigationBar
        title={'Favorite'}
        statusBar={statusBar}
        style={theme.styles.navBar}
      />
    );
    const TabNavigator = createAppContainer(
      createMaterialTopTabNavigator(
        {
          Popular: {
            screen: (props) => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme}/>
            ),
            navigationOptions: {
              title: 'Hot',
            },
          },
          Trending: {
            screen: (props) => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme}/>
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
              backgroundColor: theme.themeColor,
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
const mapFavoriteStateToProps = state => ({
    theme: state.theme.theme,
});
export default connect(mapFavoriteStateToProps)(FavoritePage);

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
          DeviceEventEmitter.emit(EventTypes.favorite_change_popular)
      } else {
          DeviceEventEmitter.emit(EventTypes.favorite_change_trending)
      }
  }

  renderItem(data) {
      const {theme} = this.props;
    const item = data.item;
    const Item =
      this.storeName == FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
          theme={theme}
        projectModel={item}
        onSelect={(callback) => {
          NavigationUtil.goPage(
            {
                theme,
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
      const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={(item) => '' + (item.item.id || item.item.name)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={theme.themeColor}
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

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
