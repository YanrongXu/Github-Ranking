import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, FlatList, RefreshControl, ActivityIndicator} from 'react-native'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import Toast from 'react-native-toast-message'
import NavigationBar from '../common/NavigationBar'

const URL = 'https://friendly-engelbart-07ecc5.netlify.app/?language='
const SINCE = '&since=daliy'
const THEME_COLOR = '#678'

 
export default class TrendingPage extends Component{
    constructor(props){
        super(props);
        this.tabNames = {'All': '', 'Java': 'Java', 'JavaScript': 'JavaScript', 'Python': 'Python', 'HTML': 'HTML', 'C': 'C', 'C#': "C%23", "C++": 'C%2B%2B', 'Go': 'Go'}
    }
    _genTabs () {
        const tabs={};
        console.log('tabname',this.tabNames)
        Object.keys(this.tabNames).forEach((item) => {
            console.log('item', item)
            tabs[`tab${item}`]={
                screen: props => <TrendingTabPage {...props} tabLabel={this.tabNames[item]} />,
                navigationOptions: {
                    title: item,

                }
            }
        })
        return tabs;
    }
    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content',
        }

        let navigationBar = <NavigationBar 
            title = {'Trending'}
            statusBar= {statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />
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
                {navigationBar}
                <TabNavigator />
            </View>
        )
    }
}


const pageSize = 10
class TrendingTab extends Component {
    constructor(props){
        super(props)
        const {tabLabel} = this.props
        this.storeName = tabLabel
    }
    componentDidMount() {
        this.loadData()
    }
    loadData(loadMore) {
        const {onRefreshTrending, onLoadMoreTrending} = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callBack => {
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
        } else {
            onRefreshTrending(this.storeName, url)
        }
    }
    
    _store() {
        const {trending} = this.props
        let store = trending[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [],
                hideLoadingMore: true,
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + SINCE
    }
    renderItem(data) {
        const item = data.item
        return <TrendingItem
            item={item}
            onSelect={() => {

            }}
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
        if (!store) {
            store = {
                items: [],
                isLoading: false,
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + (item.id || item.name)}
                    refreshControl={
                        <RefreshControl 
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
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
    onRefreshTrending: (storeName, url) => dispatch(actions.onRefreshTrending(storeName, url)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callBack))
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