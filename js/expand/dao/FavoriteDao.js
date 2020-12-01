import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
    constructor(flag) {
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    }
    /**
     * favorite function, save the favorite item
     * @param {*} key id for the item
     * @param {*} value value for the item
     * @param {*} callback 
     */
    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (error, result) => {
            if (!error) {
                this.updataFavoriteKeys(key, true);
            }
        })
    }
    /**
     * update the favorite key set
     * @param {*} key 
     * @param {*} isAdd true add, false delete
     */
    updataFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = []
                if (result) {
                    favoriteKeys = JSON.parse(result)
                }
                let index = favoriteKeys.indexOf(key)
                if (isAdd) {
                    if (index === -1) favoriteKeys.push(key)
                } else {
                    if (index !== -1) favoriteKeys.splice(index, 1)
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
             }
        })
    }
    /**
     * getting the id from Repository to the favorite
     * @returns {Promise}
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(error)
                    }
                } else {
                    reject(error)
                }
            })
        })
    }
    /**
     * remove the favorite item, remove the exisit favorite item
     * @param {*} key item id
     */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updataFavoriteKeys(key, false)
            }
        })
    }
    /**
     * get all all favorite item
     * @returns {Promise}
     */
    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys().then((keys) => {
                let items = []
                if (keys) {
                    AsyncStorage.multiGet(keys, (err, stores) => {
                        try {
                            stores.map((result, i, store) => {
                                let key = store[i][0]
                                let value = store[i][1]
                                if (value) items.push(JSON.parse(value))
                            })
                            resolve(items)
                        } catch (e) {
                            reject(e)
                        }
                    })
                } else {
                    resolve(items)
                }
            }).catch((e) => {
                reject(e)
            })
        })
    }

}