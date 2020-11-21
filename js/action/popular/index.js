import types from '../types'
import Types from '../types'
import DataStore from '../../expand/dao/DataStore'
/**
 * get the popular data from github async action
 * @param storeName
 * @param url
 * @returns {function (*=)}
 */
export function onLoadPopularData(storeName, url) {
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url) // async auction and datastream
            .then(data => {
                handleData(dispatch, storeName, data)
                console.log('i fire')
            })
            .catch(error => {
                console.log(error)
                dispatch({
                    type: Types.LOAD_POPULAR_FAIL, 
                    storeName,
                    error
                });
            })
    }
}

function handleData(dispatch, storeName, data) {
    dispatch({
        type: Types.LOAD_POPULAR_SUCCESS,
        items: data && data.data && data.data.items,
        storeName
    })
}