// @flow

import React, {Component} from 'react';
import Waypoint from 'react-waypoint';

import {Widget} from '../components/UIComponents';

type Props = {
  title: string;
};

type State = {
  isVisible: boolean;
};

export default function visibilityWrapper(PassedComponent: ReactClass<*>) {
  class WrappedComponent extends Component {
    props: Props;
    state: State;
    static displayName = PassedComponent.displayName || PassedComponent.name;
    constructor() {
      super(...arguments);

      this.state = {
        isVisible: false,
      };
    }
    render() {
      return (
        <Waypoint
          scrollableAncestor={window}
          onEnter={() => this.setState({isVisible: true})}
        >
          <div>
            {this.state.isVisible
              ? <PassedComponent {...this.props} />
              : <Widget title={this.props.title || ''} />}
          </div>
        </Waypoint>
      );
    }
  }
  return WrappedComponent;
}
