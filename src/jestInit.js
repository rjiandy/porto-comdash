/* eslint-disable no-console */
// @flow
((log, warn, error) => {
  // $FlowFixMe
  console.warn = (...args: Array<mixed>) => {
    if (typeof args[0] === 'string') {
      let value = args[0];
      if (value.startsWith('Warning: Accessing createClass')) {
        return;
      }
    }
    warn.apply(console, args);
  };
  // $FlowFixMe
  console.error = (...args: Array<mixed>) => {
    if (typeof args[0] === 'string') {
      let value = args[0];
      if (
        value.startsWith('Warning: React.createElement') ||
        value.startsWith('Warning: Failed prop type')
      ) {
        return;
      }
    }
    error.apply(console, args);
  };
})(console.log, console.warn, console.error);
