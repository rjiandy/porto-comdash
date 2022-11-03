// @flow

import appPath from './getAppPath';
import {getAuth} from './auth';

type FetchReturn = {[key: string]: mixed} | Array<{[key: string]: mixed}>;

const PREFIX = appPath === '/' ? '' : appPath;
const DEV_API_PORT = '8000';

function toObject(headers: Headers) {
  let result: {[key: string]: mixed} = {};
  for (let [key, value] of headers) {
    result[key] = value;
  }
  return result;
}

export function createFetchJSON(fetch: Function, remoteHost?: string) {
  let fetchJSON = async (
    url: string,
    options: Object
  ): Promise<FetchReturn> => {
    let fullURL = remoteHost ? remoteHost + url : url;
    let response = await fetch(fullURL, getOptionsWithAuth(options));
    let contentTypeRaw = response.headers.get('Content-Type') || '';
    let contentType = contentTypeRaw.split(';')[0].toLowerCase().trim();
    let body = await response.json();
    let errorMessage;
    if (!response.ok) {
      errorMessage = `Unexpected response status: ${response.status}`;
    } else if (contentType !== 'application/json') {
      errorMessage = `Unexpected response type: ${contentType}, should've return application/json`;
    }
    if (errorMessage != null) {
      let error: Object = new Error(errorMessage);
      Object.assign(error, {
        status: response.status,
        headers: toObject(response.headers),
        body,
      });
      throw error;
    }
    return body;
  };
  return fetchJSON;
}

function getOptionsWithAuth(options) {
  let auth = getAuth();
  if (!auth) {
    return options;
  }
  let {headers, ...otherOptions} = options;
  return {
    headers: {
      Authorization: auth,
      ...headers,
    },
    ...otherOptions,
  };
}

function getAPIBaseURL() {
  // eslint-disable-next-line no-restricted-globals
  let {port, hostname, protocol} = location;
  // This is to detect if we're running on production (API is on same
  // host/port) or in dev
  // TODO: Remove this when we get Webpack proxy working.
  if (port === '' || port === '80' || port === '443') {
    return '';
  }
  return `${protocol}//${hostname}:${DEV_API_PORT}${PREFIX}`;
}

export const fetchStagingAPI = createFetchJSON(
  global.fetch,
  'https://comdash-staging-api.kodefox.com/api'
);

export default createFetchJSON(global.fetch, getAPIBaseURL());
