// @flow
import React, {Component, Children} from 'react';
import autobind from 'class-autobind';

import LoginPage from './general/components/LoginPage';
import {attemptLogin, attemptAutoLogin} from './general/helpers/auth';

type Props = {
  children?: mixed;
};

type State = {
  isLoading: boolean;
  isAuthorized: boolean;
};

class LoginProvider extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isLoading: true,
      isAuthorized: false,
    };
    this._checkAutoLogin();
  }

  async _checkAutoLogin() {
    let isAuthorized = await attemptAutoLogin();
    this.setState({
      isLoading: false,
      isAuthorized,
    });
  }

  async _attemptLogin(params: {username: string; password: string}) {
    let {username, password} = params;
    let isAuthorized = await attemptLogin(username, password);
    // TODO: Error message when login fails.
    this.setState({isAuthorized: true});
    this.setState({
      isLoading: false,
      isAuthorized,
    });
  }

  render() {
    let {isLoading, isAuthorized} = this.state;
    if (isLoading) {
      // TODO: Loading Indicator.
      return null;
    }
    if (!isAuthorized) {
      return <LoginPage onLoginPress={this._attemptLogin} />;
    }
    let {children} = this.props;
    return Children.only(children);
  }
}

export default LoginProvider;
