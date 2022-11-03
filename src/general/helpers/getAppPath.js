// @flow

const appPath = (
    document.documentElement &&
    document.documentElement.dataset &&
    document.documentElement.dataset.appPath &&
    '/' + document.documentElement.dataset.appPath.split('/').filter((s) => s).join('/')
  ) || '';

export default appPath;
