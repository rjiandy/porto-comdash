// @flow

import type {GlobalFilterState} from '../../features/GlobalFilter/GlobalFilter-type';

type Global = {
  globalFilter: GlobalFilterState;
};

export function loadStorage() {
  try {
    let serializedState = sessionStorage.getItem('global');
    if (serializedState) {
      return JSON.parse(serializedState);
    }
  } catch (error) {
    return undefined;
  }
}

export function saveStorage(state: Global) {
  try {
    let serializedState = JSON.stringify(state);
    sessionStorage.setItem('global', serializedState);
  } catch (err) {
    return null; //TODO: throw error
  }
}
