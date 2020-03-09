import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducre from './reducers'

const initialState = {};

const middleware = [thunk];

const store = createStore(rootReducre, initialState, compose(
    applyMiddleware(...middleware)
));

export default store