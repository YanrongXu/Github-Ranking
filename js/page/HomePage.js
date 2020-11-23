import React, {Component} from 'react';
import {BackHandler, StyleSheet} from 'react-native'
import { NavigationActions } from 'react-navigation';
import BackPressComponent from '../common/BackPressComponent';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';



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
    
    render() {
        NavigationUtil.navigation = this.props.navigation;
        return <DynamicTabNavigator />
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(HomePage);

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