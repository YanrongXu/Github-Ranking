import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default class TrendingItem extends Component {
    render() {
        const {item} = this.props
        if (!item) return null;
        let favoriteButton = <TouchableOpacity
            onPress={() => {

            }}
            underlayColor={'transparent'}
            style={{padding: 6}}
        >
            <FontAwesome 
                name={'star-o'}
                size={26}
                style={{color: 'red'}}
            />
        </TouchableOpacity>
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>
                        {item.name}
                    </Text>
                    <Text style={styles.description}>
                        {item.description}
                    </Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Built by: </Text>
                            {item.builtBy.map((result, i, arr) => {
                                return <Image
                                        key={i}
                                        style={{height: 22, width: 22, margin: 2}}
                                        source={{uri: arr[i].avatar}}
                                />
                            })}
                        </View>
                        {favoriteButton}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        // shadow for ios only
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        // elevation for android only
        elevation: 2
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    }
})