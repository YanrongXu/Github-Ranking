import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceEventEmitter} from 'react-native'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import Toast from 'react-native-toast-message'
import NavigationBar from '../common/NavigationBar'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'
const URL = 'https://friendly-engelbart-07ecc5.netlify.app/?language='
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import FavoriteDao from "../expand/dao/FavoriteDao";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";
const SINCE = '&since=daliy'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)


class TrendingPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            timeSpan: TimeSpans[0]
        }
        const {onLoadLanguage} = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_language)
        this.preKeys = []
    }
    _genTabs () {
        const tabs={};
        const {keys, theme} = this.props
        this.preKeys = keys
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`]={
                    screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.path}  theme={theme}/>,
                    navigationOptions: {
                        title: item.name,
                    }
                }
            }
        })
        return tabs;
    }
    renderTitleView() {
        return <View>
            <TouchableOpacity
                ref='button'
                underlayColor='transparent'
                onPress={() => this.dialog.show()}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color:'#FFFFFF',
                        fontWeight: '400'
                    }}>
                        Trending {this.state.timeSpan.showText}
                    </Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{color: 'white'}}
                    />
                </View>
            </TouchableOpacity>
            </View>
    }
    onSelectTimeSpan(tab){
        this.dialog.dismiss()
        this.setState({
            timeSpan: tab
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
    }
    renderTrendingDialog() {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect = {tab => this.onSelectTimeSpan(tab)}
        />
    }
    _tabNav() {
        const {theme} = this.props
        if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {
            this.theme = theme
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(
                this._genTabs(),
                {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false,
                        scrollEnabled: true,
                        style: {
                            backgroundColor: theme.themeColor,
                        },
                        indicatorStyle: styles.indicatorStyle,
                        labelStyle: styles.labelStyle
                    },
                    lazy: true
                }
            ))
        }
        return this.tabNav
    }

    render() {
        const {keys, theme} = this.props
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar= {statusBar}
            style={theme.styles.navBar}
        />
        const TabNavigator = keys.length ? this._tabNav() : null;
        return(
            <View style={styles.container}>
                {navigationBar}
                {TabNavigator && <TabNavigator/>}
                {this.renderTrendingDialog()}
            </View>
        )
    }
}

const mapTrendingStateToProps = state => ({
    keys: state.language.languages,
    theme: state.theme.theme
})
const mapTrendingDispatchToProps = dispatch =>({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage((flag)))
})
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage)

const pageSize = 10
class TrendingTab extends Component {
    constructor(props){
        super(props)
        const {tabLabel, timeSpan} = this.props
        this.storeName = tabLabel
        this.timeSpan = timeSpan
        this.isFavoriteChanged = false
    }
    componentDidMount() {
        this.loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan
            this.loadData()
        })
        DeviceEventEmitter.addListener(
          EventTypes.favorite_change_trending,
          (this.favoriteChangeListener = () => {
              this.isFavoriteChanged = true;
          }),
        );
        DeviceEventEmitter.addListener(
          EventTypes.bottom_tab_select,
          (this.bottomTabSelectListener = (data) => {
              if (data.to === 1 && this.isFavoriteChanged) {
                  this.loadData(null, true);
              }
          }),
        );
    }

    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
        DeviceEventEmitter.removeListener(this.favoriteChangeListener);
        DeviceEventEmitter.removeListener(this.bottomTabSelectListener);
    }

    loadData(loadMore, refreshFavorite) {
        const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao ,callBack => {
                Toast.show({
                    // https://github.com/calintamas/react-native-toast-message
                    type: 'info',
                    position: 'bottom',
                    text1: "Sorry, You Can't Scoll Down Anymore",
                    visibilityTime: 20000,
                    bottomOffset: 500,
                    autoHide: true,
                  });
            })
        } else if (refreshFavorite){
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
        }
    }

    _store() {
        const {trending} = this.props
        let store = trending[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true,
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + this.timeSpan.searchText
    }
    renderItem(data) {
        const item = data.item
        const {theme} = this.props
        return <TrendingItem
            projectModel={item}
            theme={theme}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModel: item,
                    flag: FLAG_STORAGE.flag_trending,
                    callback
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
        />
    }
    genIndicator() {
        return this._store().hideLoadingMore?null:
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>Loading More</Text>
            </View>
    }

    render() {
        let store = this._store()
        const {theme} = this.props
        if (!store) {
            store = {
                items: [],
                isLoading: false,
            }
        }
        return (
            <View style={styles.container}>
                <FlatList

                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.name}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
                        />
                    }
                    ListFooterComponent = {() => this.genIndicator()}
                    onEndReached={() => {
                        console.log('-----OnEndReached------')
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this.loadData(true)
                                this.canLoadMore=false
                            }
                        }, 100)
                    }}
                    onEndReachedThreshold = {0.5}
                    onMomentumScrollBegin = {() => {
                        this.canLoadMore = true;
                    }}
                />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    trending: state.trending
})

const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
})

const TrendingTabPage = connect(mapStateToProps,mapDispatchToProps)(TrendingTab)

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
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
})
