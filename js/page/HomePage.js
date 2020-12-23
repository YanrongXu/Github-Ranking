import React, {Component} from 'react';
import {BackHandler, View} from 'react-native'

import BackPressComponent from '../common/BackPressComponent';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import CustomTheme from "./CustomTheme";
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import actions from '../action'

class HomePage extends Component{
    constructor(props){
        super(props)
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
     }

     componentDidMount() {
         this.backPress.componentDidMount()
     }
     componentWillUnmount(){
         this.backPress.componentWillUnmount()
     }

     onBackPress = () => {
         if (this.props.navigation.state.routeName == 'HomePage'){
             BackHandler.exitApp()
             return true
         }
         return false
     }
     renderCustomThemeView(){
        const {customThemeViewVisible, onShowCustomThemeView} = this.props
        return (
            <CustomTheme
                visible={customThemeViewVisible}
                {...this.props}
                onClose={() => onShowCustomThemeView(false)}
            />
        )
     }

    render() {
        const {theme} = this.props
        NavigationUtil.navigation = this.props.navigation;
        return <SafeAreaViewPlus
            topColor={theme.themeColor}
        >
            <DynamicTabNavigator />
            {this.renderCustomThemeView()}
        </SafeAreaViewPlus>
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible,
    theme: state.theme.theme
})
const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
