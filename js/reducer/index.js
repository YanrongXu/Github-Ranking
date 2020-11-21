import {combineReducers} from 'redux'
import theme from './theme'
import popular from './popular'

/**
 * combine reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const index = combineReducers({
    theme: theme,
    popular: popular
})

export default index;