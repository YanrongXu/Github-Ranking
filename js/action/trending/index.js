import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {handleData} from '../ActionUtil'
/**
 * get the popular data from github async action
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 * @returns {function (*=)}
 */
export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending) // async auction and datastream
            .then(data => {
                console.log('trending data',data)
                handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize)
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
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray=[], callBack) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex-1)*pageSize >= dataArray.length) {
                if (typeof callBack == 'function' ) {
                    callBack('no more')
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels: dataArray.slice(0, max)
                })
            }
        }, 500);
    }
}

