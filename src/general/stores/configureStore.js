// @flow

import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import debounce from 'lodash/debounce';

import rootReducer from './rootReducers';
import rootSaga from './rootSaga';
import {loadStorage, saveStorage} from '../helpers/internalStorage';

let sagaMiddleware = createSagaMiddleware();

function configureStore() {
  let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; //eslint-disable-line
  let store = createStore(
    rootReducer,
    loadStorage(),
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );
  sagaMiddleware.run(rootSaga);
  return store;
}

let store: Store = configureStore();

store.subscribe(
  debounce(() => {
    let {globalFilter} = store.getState();
    saveStorage({globalFilter});
  }),
  500,
);

export default store;
