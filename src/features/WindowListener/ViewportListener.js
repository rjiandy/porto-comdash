// @flow
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {Component, Children} from 'react';

import type {Dispatch} from '../../general/stores/Action';

type Props = {
  onResize: () => null;
  children: mixed;
};

export class ViewportListener extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  render() {
    let {children} = this.props;
    return Children.only(children);
  }

  _onResize() {
    let {onResize} = this.props;
    if (onResize) {
      onResize();
    }
  }
}

const viewportProvider = connect(
  null,
  (dispatch: Dispatch) => ({
    onResize: () =>
      dispatch({
        type: 'VIEWPORT_UPDATED',
        windowSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      }),
  }),
)(ViewportListener);

export default viewportProvider;
