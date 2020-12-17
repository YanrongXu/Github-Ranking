import React, {Component} from 'react';
import {View, Linking, Clipboard} from 'react-native'
import {MORE_MENU} from '../../common/MORE_MENU';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtil from '../../navigator/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../res/data/github_app_config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
const THEME_COLOR = '#678';

export default class AboutMePage extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about_me,
        }, data => this.setState({...data})
        )
        this.state = {
            data: config,
            showTutorial: true,
            showBlog: false,
            showContact: false
        }
    }
    onClick(tab) {
        if (!tab) return;
        const {theme} = this.params
        if (tab.url) {
            NavigationUtil.goPage({
                theme,
                title: tab.title,
                url: tab.url
            }, 'WebViewPage')
            return;
        }
        if (tab.account && tab.account.indexOf('@') > -1) {
            let url = 'mailto://' + tab.account;
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\' handle url: ' + url)
                } else {
                    return Linking.openURL(url)
                }
            }).catch(err => console.error('An error occurred', err))
        }
        if (tab.account) {
            Clipboard.setString(tab.account)
            Toast.show({
                type: 'info',
                position: 'center',
                text1: `${tab.title + tab.account + 'is copy to clipboard'}`,
                autoHide: true
            })
        }
    }
    getItem(menu) {
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR)
    }
    _item(data, isShow, key) {
        const {theme}=this.params;
        return ViewUtil.getSettingItem(() => {
            this.setState({
                [key]: !this.state[key]
            })
        }, data.name, theme.themeColor, Ionicons, data.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down')
    }
    renderItems(dic, isShowAccount) {
        if (!dic) return null
        const {theme} = this.params;
        let views = []
        for (let i in dic) {
            let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title
            views.push(
                <View key={i}>
                    {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title,theme.themeColor)}
                    <View style={GlobalStyles.line} />
                </View>
            )
        }
        return views
    }
    render () {
        const content = <View>
            {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
            <View style={GlobalStyles.line} />
            {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

            {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
            <View style={GlobalStyles.line} />
            {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

            {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
            <View style={GlobalStyles.line} />
            {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items) : null}

        </View>
        return <View style={{flex: 1}}>
            {this.aboutCommon.render(content, this.state.data.author)}
        </View>
    }
}


