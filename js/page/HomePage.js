import React, {Component} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native'
import { NavigationActions } from 'react-navigation';
import BackPressComponent from '../common/BackPressComponent';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import CustomTheme from "./CustomTheme";
import {onShowCustomThemeView} from "../action/theme";
import actions from '../action'

class HomePage extends Component{
    constructor(props){
        super(props)
        this.backPress = new BackPressComponent({backPress: () => this.onBackpress()})
     }

     componentDidMount() {
         this.backPress.componentDidMount()
     }
     componentWillUnmount(){
         this.backPress.componentWillUnmount()
     }

     onBackpress = () => {
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
        NavigationUtil.navigation = this.props.navigation;
        return <View style={{flex: 1}}>
            <DynamicTabNavigator />
            {this.renderCustomThemeView()}
        </View>
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible
})
const mapDispatchToProps = dispatch => ({
    onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
})
