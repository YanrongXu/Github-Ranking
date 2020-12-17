import {AsyncStorage} from 'react-native'
import ThemeFactory, {ThemeFlags} from "../../res/styles/ThemeFactory";

const THEME_KEY = 'theme_key'
export default class ThemeDao {
    /**
     * get current theme
     * @returns {Promise<unknown>}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error)
                    return
                }
                if (!result) {
                    this.save(ThemeFlags.Default)
                    result = ThemeFlags.Default
                    resolve(data)
                }
                resolve(ThemeFactory.createTheme(result))
            })
        })
    }

    /**
     * save theme
     * @param themeFlag
     */
    save(themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag, (error, result) => {
        })
    }
}


