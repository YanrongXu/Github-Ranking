import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {connect} from 'react-redux'
import actions from '../action'



export default class AsyncStorageDemoPage extends Component{
    

    render() {
        const KEY = 'save_key'
        const {navigation} = this.props
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>AsyncStorage use</Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={text => {
                        this.value= text;
                    }}
                />
                <View style={styles.input_container}>
                    <Text onPress={() => {
                        this.doSave();
                    }}>
                        Save
                    </Text>
                    <Text onPress={() => {
                        this.doRemove();
                    }}>
                        Remove
                    </Text>
                    <Text onPress={() => {
                        this.getData();
                    }}>
                        get data
                    </Text>

                </View>
            
                <Text>{this.state.showText}</Text>
            </View>
        )
    }

    doSave() {

    }
    doRemove() {

    }
    getData() {

    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20, 
        textAlign: 'center',
        margin: 10,
    },
    input: {
        height: 30,
        flex: 1,
        borderColor: 'black',
        borderWidth: 1, 
        marginRight: 10
    },
    input_container: {
        flexDirection: 'row',
        alignItems: "center"
    }
})
