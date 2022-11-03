// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Provider} from 'react-redux';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';

import store from './general/stores/configureStore';
import ViewportProvider from './features/WindowListener/ViewportListener';
import LoginProvider from './LoginProvider';
import Main from './routes/Main';
import appPath from './general/helpers/getAppPath';

import './App.css';

class App extends Component {
  constructor() {
    super(...arguments);
    autobind(this);
  }

  render() {
    let Router = appPath === '/' ? BrowserRouter : MemoryRouter;
    return (
      <MuiThemeProvider>
        <Provider store={store}>
          <ViewportProvider>
            <LoginProvider>
              <Router>
                <Main />
              </Router>
            </LoginProvider>
          </ViewportProvider>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
