import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native'
import DataStore from '../expand/dao/DataStore'
import {connect} from 'react-redux'
import actions from '../action'



export default class DataStoreDemoPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showText: ''
        }
        this.dataStore = new DataStore();
    }
    loadData() {
        let url = `https://api.github.com/search/repositories?q=${this.value}`;
        this.dataStore.fetchData(url)
            .then(data => {
                let showData = `first datetime data show: ${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
                this.setState({
                    showText: showData
                })
            })
            .catch(error => {
                error && console.log(error.toString())
            })
    }

    render() {
        const KEY = 'save_key'
        const {navigation} = this.props
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>offline store</Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={text => {
                        this.value= text;
                    }}
                />
                <Text onPress={() => {
                    this.loadData()
                }}>
                    getData
                </Text>
            
                <Text>{this.state.showText}</Text>
            </View>
        )
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
        borderColor: 'black',
        borderWidth: 1, 
        marginRight: 10
    },
    input_container: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-around'
    }
})
