import types from '../types';
import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData, _projectModels} from '../ActionUtil';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';
/**
 * Loading favorite function
 * @param flag
 * @param isShowLoading isloading or not
 * @returns {function(*)}
 */
export function onLoadFavoriteData(flag, isShowLoading) {
  return (dispatch) => {
    if (isShowLoading) {
      dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag});
    }
    new FavoriteDao(flag)
      .getAllItems()
      .then((items) => {
        let resultData = [];
        for (let i = 0, len = items.length; i < len; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        dispatch({
          type: Types.FAVORITE_LOAD_SUCCESS,
          projectModels: resultData,
          storeName: flag,
        });
      })
      .catch((e) => {
        console.log(e);
        dispatch({type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag});
      });
  };
}

