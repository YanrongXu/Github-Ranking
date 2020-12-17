export default class ArrayUtil {
    /**
     * check if two arrays are same
     * @param arr1
     * @param arr2
     * @returns {boolean} true, if two array is same
     */
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) return false
        if (arr1.length !== arr2.length) return false
        for (let i = 0, l = arr1.length; i < l; i++) {
            if (arr1[i] !== arr2[i]) return false
        }
        return true
    }

    /**
     * Update Array, if item is exits, delete it from array, otherwise adding to array
     * @param array
     * @param item
     */
    static updateArray(array, item) {
        for (let i = 0, len = array.length; i < len; i++) {
            let temp = array[i];
            if (item === temp) {
                array.splice(i, 1);
                return;
            }
        }
        array.push(item);
    }

    /**
     * remove item from the array
     * @param array
     * @param item
     * @param id
     * @returns {*}
     */
    static remove(array, item, id) {
        if (!array) return;
        for (let i = 0, l = array.length; i < l; i++) {
            const val = array[i];
            if (item === val || val && val[id] && val[id] === item[id]) {
                array.splice(i, 1);
            }
        }
        return array;
    }

    static clone(from){
        if (!from) return []
        let newArray = []
        for (let i = 0, l = from.length; i < l; i++) {
            newArray[i] = from[i]
        }
        return newArray
    }
}
