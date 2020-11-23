import {combineReducers} from 'redux'
import theme from './theme'
import popular from './popular'
import trending from './trending'

/**
 * combine reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const index = combineReducers({
    theme: theme,
    popular: popular,
    trending: trending
})

export default index;