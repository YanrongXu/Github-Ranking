import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {WebView} from 'react-native-webview'
import NavigationUtil from '../navigator/NavigationUtil';
const THEME_COLOR = '#678'

export default class DetailPage extends Component{
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params
        console.log('params',this.params)
        const {projectModes} = this.params
        console.log('sss',projectModes)
        this.url = projectModes.html_url || projectModes.url
        console.log('url',this.url)
        const title = projectModes.full_name || projectModes.name
        this.state= {
            title: title,
            url: this.url,
            canGoBack: false
        }
    }
    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    renderRightButton() {
        return(
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => {

                    }}
                >
                    <FontAwesome 
                        name={'star-o'}
                        size={20}
                        style={{color: 'white', marginRight: 10}}
                    />
                </TouchableOpacity>
                {ViewUtil.getShareButton(() => {

                })}
            </View>
        )
    }
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }
    render() {
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            titleLayoutStyle={titleLayoutStyle}
            title = {this.state.title}
            style={{backgroundColor: THEME_COLOR}}
            rightButton={this.renderRightButton()}
        />
        return(
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})