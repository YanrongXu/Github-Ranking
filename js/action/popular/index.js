import types from '../types';
import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData, _projectModels} from '../ActionUtil';
/**
 * get the popular data from github async action
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 * @returns {function (*=)}
 */
export function onLoadPopularData(storeName, url, pageSize, favoriteDao) {
  return (dispatch) => {
    dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_popular) // async auction and datastream
      .then((data) => {
        console.log('popular data', data);
        handleData(
          Types.POPULAR_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
          favoriteDao,
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
          storeName,
          error,
        });
      });
  };
}

/**
 * loadMore
 * @param {*} storeName
 * @param {*} pageIndex page
 * @param {*} pageSize how many project on the page
 * @param {*} dataArray the whole data
 * @param {*} favoriteDao
 * @param {*} callBack page communcation: such as error
 */
export function onLoadMorePopular(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callBack,
) {
  return (dispatch) => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callBack === 'function') {
          callBack('no more');
        }
        dispatch({
          type: Types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex,
        });
      } else {
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
          dispatch({
            type: Types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data,
          });
        });
      }
    }, 500);
  };
}
