import React, {Component} from 'react';
import {View, Text, StyleSheet, Button,} from 'react-native'
import {connect} from 'react-redux'
import actions from '../action'

class TrendingPage extends Component{
    render() {
        const {navigation} = this.props
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>TrendingPage</Text>
                <Button
                    title={'change theme'}
                    onPress={() => this.props.onThemeChange('orange')}
                />
            </View>
        )
    }
}

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

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})
export default connect(null, mapDispatchToProps)(TrendingPage)