import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
//models
import timerModel from './models/timer';
import { combineReducers } from 'redux';

// combine as many reducers and models as you need.
const reducers = combineReducers({
  [timerModel.name]: timerModel.reducer
});

const logger = createLogger();
const store = createStore(
    reducers,
    applyMiddleware(...[thunkMiddleware, logger])
);

// make sure you initialize the models right after you
// create your store
timerModel.init(store);

if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = reducers;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
