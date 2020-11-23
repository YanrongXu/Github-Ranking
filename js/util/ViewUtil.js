import React from 'react'
import { TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {
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
}