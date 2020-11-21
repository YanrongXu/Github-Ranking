import types from '../types'
import Types from '../types'
import DataStore from '../../expand/dao/DataStore'
/**
 * get the popular data from github async action
 * @param storeName
 * @param url
 * @returns {function (*=)}
 */
export function onLoadPopularData(storeName, url, pageSize) {
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url) // async auction and datastream
            .then(data => {
                handleData(dispatch, storeName, data, pageSize)
                console.log('i fire')
            })
            .catch(error => {
                console.log(error)
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL, 
                    storeName,
                    error
                });
            })
    }
}

/**
 * loadMore
 * @param {*} storeName 
 * @param {*} pageIndex page
 * @param {*} pageSize how many project on the page
 * @param {*} dataArray the whole data
 * @param {*} callBack page communcation: such as error
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray=[], callBack) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex-1)*pageSize >= dataArray.length) {
                if (typeof callBack == 'function' ) {
                    callBack('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModes: dataArray
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max)
                })
            }
        }, 500);
    }
}

function handleData(dispatch, storeName, data, pageSize) {
    let fixItems = []
    if (data && data.data && data.data.items) {
        fixItems = data.data.items
    }
    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        items: fixItems,
        projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
        storeName,
        pageIndex: 1
    })
}