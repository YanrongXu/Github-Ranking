import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native'

export default class FavoritePage extends Component{
    render() {
        const {navigation} = this.props
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>FavoritePage</Text>
                <Button
                    title={'change theme'}
                    onPress={() => navigation.setParams(
                        {
                            theme: {
                                tintColor: 'purple',
                                updateTime: new Date().getTime(),
                            }
                        }
                    )}
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