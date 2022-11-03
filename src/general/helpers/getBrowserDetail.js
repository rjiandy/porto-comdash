// @flow

import browser from 'detect-browser';

let isModernBrowser = true;
try {
  // eslint-disable-next-line no-eval
  eval('let f = async () => 1');
} catch (e) {
  isModernBrowser = false;
}

let {name, version} = browser;
export default {
  name,
  version: Number(version.split('.')[0]),
  isModernBrowser,
};
