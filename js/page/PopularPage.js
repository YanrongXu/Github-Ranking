import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, FlatList, RefreshControl, ActivityIndicator} from 'react-native'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-toast-message'


const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'

 
export default class PopularPage extends Component{
    constructor(props){
        super(props);
        this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'PHP']
    }
    _genTabs () {
        const tabs={};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`]={
                screen: props => <PopularTabPage {...props} tabLabel={item} />,
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
                        marginTop: 33
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
const pageSize = 10
class PopularTab extends Component {
    constructor(props){
        super(props)
        const {tabLabel} = this.props
        this.storeName = tabLabel
    }
    componentDidMount() {
        this.loadData()
    }
    loadData(loadMore) {
        const {onLoadPopularData, onLoadMorePopular} = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                Toast.show({
                    type: 'info',
                    position: 'bottom',
                    text1: 'Sorry, there is no more page',
                    visibilityTime: 8000,
                    bottomOffset: 40,
                  });
            })
        } else {
            onLoadPopularData(this.storeName, url)
        }
    }
    
    _store() {
        const {popular} = this.props
        let store = popular[this.storeName]
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
        return URL + key + QUERY_STR
    }
    renderItem(data) {
        const item = data.item
        return <PopularItem
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
                    keyExtractor={item => "" + item.id}
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
    popular: state.popular
})

const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack))
})

const PopularTabPage = connect(mapStateToProps,mapDispatchToProps)(PopularTab)

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