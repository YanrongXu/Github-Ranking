import {combineReducers} from 'redux'
import theme from './theme'

/**
 * combine reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const index = combineReducers({
    theme: theme,
})

export default index;