import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  DeviceEventEmitter,
    Platform,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-toast-message';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import GlobalStyles from '../res/styles/GlobalStyles'
import ViewUtil from "../util/ViewUtil";
import Utils from "../util/Utils";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

const pageSize = 10
class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.isKeyChange = false
  }
  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  loadData(loadMore) {
    const {onLoadMoreSearch, onSearch, search, keys} = this.props;
    if (loadMore) {
      onLoadMoreSearch(++search.pageIndex, pageSize, search.items, this.favoriteDao, callback => {
          Toast.show({
            // https://github.com/calintamas/react-native-toast-message
            type: 'info',
            position: 'bottom',
            text1: "Sorry, You Can't Scoll Down Anymore",
            visibilityTime: 20000,
            bottomOffset: 500,
            autoHide: true,
          });
        },
      );
    }  else {
      onSearch(this.inputKey, pageSize, this.searchToken = new Date().getTime(), this.favoriteDao, keys, message => {
        console.log('Search')
        Toast.show({
          // https://github.com/calintamas/react-native-toast-message
          type: 'info',
          position: 'bottom',
          text1: `${message}`,
          visibilityTime: 20000,
          bottomOffset: 500,
          autoHide: true,
        });
      });
    }
  }

  onBackPress() {
    const {onSearchCancel, onLoadLanguage} = this.props
    onSearchCancel()
    this.refs.input.blur()
    NavigationUtil.goBack(this.props.navigation)
    if (this.isKeyChange) {
      onLoadLanguage(FLAG_LANGUAGE.flag_key)
    }
    return true
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.params
    return (
      <PopularItem
        projectModel={item}
        theme={theme}
        onSelect={(callback) => {
          NavigationUtil.goPage(
            {
              theme,
              projectModel: item,
              flag: FLAG_STORAGE.flag_popular,
              callback,
            },
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          )
        }
      />
    );
  }
  genIndicator() {
    const {search} = this.props
    return search.hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>Loading More</Text>
      </View>
  }
  saveKey() {
    const {keys} = this.props
    let key = this.inputKey
    if (Utils.checkKeyIsExist(keys, key)) {
      Toast.show({
        // https://github.com/calintamas/react-native-toast-message
        type: 'info',
        position: 'bottom',
        text1: `${key} is already exist `,
        visibilityTime: 20000,
        bottomOffset: 500,
        autoHide: true,
      });
    } else {
      key = {
        'path': key,
        'name': key,
        'checked': true
      }
      keys.unshift(key)
      this.languageDao.save(keys)
      Toast.show({
        // https://github.com/calintamas/react-native-toast-message
        type: 'info',
        position: 'bottom',
        text1: `${key.name} is save`,
        visibilityTime: 20000,
        bottomOffset: 500,
        autoHide: true,
      });
      this.isKeyChange = true
    }
  }
  onRightButtonClick() {
    const {onSearchCancel, search} = this.props;
    if (search.showText === 'Search') {
      this.loadData();
    } else {
      onSearchCancel(this.searchToken);
    }
  }
  renderNavBar() {
    const {theme} = this.params
    const {showText, inputKey} = this.props.search
    const placeholder = inputKey || 'What do want to search'
    let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress())
    let inputView = <TextInput
      ref='input'
      placeholder={placeholder}
      onChangeText={text => this.inputKey = text}
      style={styles.textInput}
    ></TextInput>
    let rightButton =
        <TouchableOpacity
          onPress={() => {
            this.refs.input.blur()
            this.onRightButtonClick()
          }}
        >
          <View style={{marginRight: 10}}>
            <Text style={styles.title}>{showText}</Text>
          </View>
        </TouchableOpacity>
    return <View style={{
      backgroundColor: theme.themeColor,
      flexDirection: 'row',
      alignItems: 'center',
      height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
    }}>
      {backButton}
      {inputView}
      {rightButton}
    </View>
  }
  render() {
    const {isLoading, projectModels, showBottomButton, hideLoadingMore} = this.props.search
    const {theme} = this.params
    let statusBar = null
    if (Platform.OS === 'ios') {
      statusBar = <View style={[styles.statusBar, {backgroundColor: theme.themeColor}]}/>
    }
    let listView = !isLoading ? <FlatList
        data={projectModels}
        renderItem={data => this.renderItem(data)}
        keyExtractor={item => "" + item.item.id}
        contentInset={
          {
            bottom: 45
          }
        }
        refreshControl={
          <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
          />
        }
        ListFooterComponent={() => this.genIndicator()}
        onEndReached={() => {
          console.log('---onEndReached----');
          setTimeout(() => {
            if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
              this.loadData(true);
              this.canLoadMore = false;
            }
          }, 300);
        }}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
          console.log('---onMomentumScrollBegin-----')
        }}
    /> : null;
    let bottomButton = showBottomButton ?
        <TouchableOpacity
          style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
          onPress={() => {
            this.saveKey()
          }}
        >
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.title}>Got it, Captain</Text>
          </View>
        </TouchableOpacity> : null
    let indicatorView = isLoading ?
        <ActivityIndicator
            style={styles.centering}
            size='large'
            animating={isLoading}
        /> : null;
    let resultView = <View style={{flex: 1}}>
      {indicatorView}
      {listView}
    </View>;
    return (
      <View style={styles.container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  search: state.search,
  keys: state.language.keys,
});

const mapDispatchToProps = (dispatch) => ({
  onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack)),
  onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
  onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callBack)),
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);

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
  statusBar: {
    height: 20
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 130,
    right: 10,
    borderRadius: 3
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  textInput: {
    flex: 1,
    height: (Platform.OS === 'ios') ? 26 : 36,
    borderWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderColor: "white",
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white'
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500'
  }
});
