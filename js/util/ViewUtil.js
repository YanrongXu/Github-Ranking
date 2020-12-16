import React from 'react'
import {TouchableOpacity, StyleSheet, View, Text} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {
    /**
     * get setting page item
     * @param callback
     * @param text
     * @param color
     * @param Icons
     * @param icon
     * @param expandableIco
     * @return {xml}
     */
    static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
        return (
            <TouchableOpacity
                onPress={callback}
                style={styles.setting_item_container}
            >
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {Icons&&icon?
                        <Icons
                            name={icon}
                            size={16}
                            style={{color: color, marginRight: 10}}
                        />:
                        <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}} />
                    }
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIco ? expandableIco : 'ios-arrow-forward'}
                    size={16}
                    style={{
                        marginRight: 10,
                        alignSelf: 'center',
                        color: color || 'black',
                    }}
                />
            </TouchableOpacity>
        )
    }

    /**
     * get the menu item
     * @param callback
     * @param menu
     * @param color
     * @param expandableIco
     * @return {XML}
     */
    static getMenuItem(callback, menu, color, expandableIco) {
        return ViewUtil.getSettingItem(callback, menu.name, color, menu.Icons, menu.icon, expandableIco)
    }
    /**
     * get the left return to prevew button
     * @param {*} callBack
     * @return {XML}
     */
    static getLeftBackButton(callBack) {
        return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}
        >
            <Ionicons
                name={'ios-chevron-back'}
                size={26}
                style={{color: 'white', paddingBottom: 25}}
            />
        </TouchableOpacity>
    }
    /**
     * get the share button
     * @param {*} callBack
     */
    static getShareButton(callBack) {
        return <TouchableOpacity
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Ionicons
                name={'md-share'}
                size={20}
                style={{opacity: 0.9, marginRight: 10, color: 'white'}}
            />
        </TouchableOpacity>
    }

    static getRightButton(title, callBack) {
        return <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={callBack}>
            <Text style={{fontSize: 20, color: '#FFFFFF', marginRight: 10}}>{title}</Text>
        </TouchableOpacity>
    }
}


const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
})

