// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-primitives';

type Props = {
  onClick?: (event: MouseEvent) => void;
  target?: string;
  replace?: boolean;
  to: string | Object;
  innerRef?: (ref: ?Node) => mixed;
};

class Link extends Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  handleClick = (event: MouseEvent) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      !this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const {history} = this.context.router;
      const {replace, to} = this.props;

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  };

  render() {
    const {replace, to, innerRef, ...otherProps} = this.props;

    const href = this.context.router.history.createHref(
      typeof to === 'string' ? {pathname: to} : to
    );

    return (
      <View
        {...otherProps}
        accessibilityRole="link"
        onClick={this.handleClick}
        href={href}
        ref={innerRef}
      />
    );
  }
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export default Link;
