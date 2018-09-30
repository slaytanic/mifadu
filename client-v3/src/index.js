import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import throttle from 'lodash.throttle';

import 'assets/css/material-dashboard-react.css?v=1.5.0'; // eslint-disable-line import/no-unresolved
import 'assets/scss/material-kit-react.css?v=1.2.0'; // eslint-disable-line import/no-unresolved
import 'react-vis/dist/style.css';

import { loadState, saveState } from 'store/local-storage';
import rootReducer from 'reducers/index';
import App from './App';

const history = createBrowserHistory();

const persistedState = loadState();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  connectRouter(history)(rootReducer),
  persistedState,
  composeEnhancer(applyMiddleware(routerMiddleware(history), thunk)),
);

store.subscribe(
  throttle(() => {
    saveState({
      currentUser: store.getState().currentUser,
    });
  }, 5000),
);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App history={history} />
    </Provider>,
    document.getElementById('root'),
  );
};

render();
