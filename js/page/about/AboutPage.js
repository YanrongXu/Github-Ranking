import React, {Component} from 'react';
import {View, Linking} from 'react-native'
import {MORE_MENU} from '../../common/MORE_MENU';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtil from '../../navigator/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import config from '../../res/data/github_app_config';
const THEME_COLOR = '#678';

export default class AboutPage extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about,
        }, data => this.setState({...data})
        )
        this.state = {
            data: config
        }
    }
    onClick(menu) {
        let RouteName, params = {}
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName='WebViewPage'
                params.title='Tutorial'
                params.url='https://github.com/YanrongXu/Github-Ranking'
                break
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage'
                break
            case MORE_MENU.Feedback:
                const url = 'mailto://8xuyanrong@gmail.com'
                Linking.canOpenURL(url)
                    .then(support => {
                        if (!support) {
                            console.log('Can\'t handle url: ' + url)
                        } else {
                            Linking.openURL(url)
                        }
                    }).catch(e => {
                        console.error('An error occurred', e)
                })
                break
        }
        if (RouteName) {
            NavigationUtil.goPage(params, RouteName)
        }
    }
    getItem(menu) {
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR)
    }
    render () {
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line} />
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line} />
            {this.getItem(MORE_MENU.Feedback)}
        </View>
        return this.aboutCommon.render(content, this.state.data.app)
    }
}


