import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducer'

/**
 * custom log middleware 
 * @param {*} store 
 * @returns {function((*): Function}
 */
const logger = store => next => action => {
    if (typeof action == 'function') {
        console.log('dispacting a function')
    } else {
        console.log('dispatching', action)
    }
    const result = next(action);
    console.log('nextState', store.getState());
    return result;
}

const middleware = [
    logger,
    thunk
];

/**
 * create store
 */

 export default createStore(reducer, applyMiddleware(...middleware))