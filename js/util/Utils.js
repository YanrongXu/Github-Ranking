export default class Utils {
    static checkFavorite(item, keys = []) {
        if (!keys) return false
        for (let i = 0, len = item.length; i < len; i++) {
            let id = item ? item.id : item.full_name
            if (id.toString() === keys[i]) {
                return true
            }
        }
        return false
    }
}