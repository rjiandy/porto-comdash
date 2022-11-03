// @flow
// import MD5Hash from './MD5Hash';
import ensureObject from './ensureObject';
import {fetchStagingAPI as fetchJSON} from './fetchJSON';

type Credentials = {
  username: string;
  password: string;
};

// let SALT = 'sv4Z1VdvuG';
let NAME_PREFIX = 'i2OQhckyrD';
let STORAGE_KEY = 'jDjNxjFyJh';

let userCredentials: ?Credentials = null;
let windowIdentifier: ?string;

export async function attemptAutoLogin(): Promise<boolean> {
  let existingName = window.name;
  let isExisting = existingName.startsWith(NAME_PREFIX);
  if (isExisting) {
    windowIdentifier = existingName;
    let savedValue = sessionStorage.getItem(
      `${STORAGE_KEY}/${windowIdentifier}`,
    );
    let savedCredentials;
    if (typeof savedValue === 'string') {
      try {
        savedCredentials = JSON.parse(atob(savedValue));
      } catch (e) {}
    }
    let {username, password} = ensureObject(savedCredentials) || {};
    let result = false;
    if (typeof username === 'string' && typeof password === 'string') {
      result = await attemptLogin(username, password);
    }
    return result;
  } else {
    window.name = windowIdentifier =
      NAME_PREFIX + Math.floor(Math.random() * Math.pow(2, 52)).toString(36);
    return false;
  }
}

async function checkAuth(username: string, password: string) {
  try {
    await fetchJSON('/auth', {
      headers: {
        Authorization: getAuth({username, password}),
      },
    });
  } catch (error) {
    if (error.status === 401) {
      return false;
    }
    throw error;
  }
  return true;
}

export async function attemptLogin(username: string, password: string) {
  let isSuccess = await checkAuth(username, password);
  if (isSuccess) {
    saveLogin(username, password);
  }
  return isSuccess;
}

function saveLogin(username: string, password: string) {
  userCredentials = {username, password};
  sessionStorage.setItem(
    `${STORAGE_KEY}/${String(windowIdentifier)}`,
    btoa(JSON.stringify({username, password})),
  );
}

export function getAuth(credentials?: ?Credentials = userCredentials): string {
  if (!credentials) {
    return '';
  }
  let {username, password} = credentials;
  return (
    'Basic ' +
    btoa(encodeURIComponent(username) + ':' + encodeURIComponent(password))
  );
}
