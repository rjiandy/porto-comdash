// @flow

import {takeEvery, call, put, select, all} from 'redux-saga/effects';

import {fetchStagingAPI as fetchJSON} from '../../../general/helpers/fetchJSON';

export default function* CMSUserSaga(): Generator<*, *, *> {
  yield takeEvery('FETCH_USER_LIST_REQUESTED', CMSUserGetSaga);
  yield takeEvery('UPDATE_USER_REQUESTED', CMSUserUpdateSaga);
  yield takeEvery(
    'ASSIGN_MULTIPLE_USER_TO_GROUPS_REQUESTED',
    CMSUserMultipleAssign
  );
}

let headers = {
  'Content-Type': 'application/json',
};

function* CMSUserMultipleAssign(action) {
  try {
    let {userIDs, groupIDs} = action;
    let {groupCMS, userCMS} = yield select((state) => state.cmsState);
    let {user: myUser} = yield select((state) => state.currentUser);
    let [{groups}, {users}] = [groupCMS, userCMS];
    for (let userID of userIDs) {
      let user = users.get(userID);
      for (let groupID of groupIDs) {
        if (user.groups.map(({id}) => id).includes(groupID)) {
          continue;
        } else {
          let newGroup = groups.get(groupID);
          user.groups.push({
            id: newGroup.id,
            groupName: newGroup.groupName,
          });
        }
      }
    }
    let changedUsers = [...users.values()].filter(({userLogin}) =>
      userIDs.includes(userLogin)
    );
    for (let user of changedUsers) {
      yield call(fetchJSON, `/Users/${user.userLogin}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(user),
      });
    }
    if (userIDs.includes(myUser.userLogin)) {
      put({type: 'FETCH_MY_DATA_REQUESTED'});
    }
    yield all([
      put({type: 'FETCH_USER_LIST_REQUESTED'}),
      put({type: 'FETCH_GROUP_LIST_REQUESTED'}),
    ]);
  } catch (error) {
    yield put({type: 'ASSIGN_MULTIPLE_USER_TO_GROUPS_FAILED', error});
  }
}

function* CMSUserUpdateSaga(action): Generator<*, *, *> {
  try {
    let {user} = action;
    let {currentUser} = yield select((state) => state);
    let body = JSON.stringify(user);
    yield call(fetchJSON, `/Users/${user.userLogin}`, {
      headers,
      method: 'PUT',
      body,
    });
    if (user.userLogin === currentUser.user.userLogin) {
      yield put({
        type: 'FETCH_MY_DATA_REQUESTED',
      });
    }
    yield all([
      put({type: 'FETCH_USER_LIST_REQUESTED'}),
      put({type: 'FETCH_GROUP_LIST_REQUESTED'}),
    ]);
  } catch (error) {
    yield put({
      type: 'UPDATE_USER_FAILED',
      error,
    });
  }
}

function* CMSUserGetSaga(): Generator<*, *, *> {
  try {
    let users = yield call(fetchJSON, '/Users', headers);
    let userList = new Map();
    for (let user of users) {
      userList.set(user.userLogin, user);
    }
    yield put({
      type: 'FETCH_USER_LIST_SUCCEED',
      users: userList,
    });
  } catch (error) {
    yield put({
      type: 'FETCH_USER_LIST_FAILED',
      error,
    });
  }
}
