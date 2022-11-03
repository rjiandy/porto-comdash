// @flow

let userGroupList = new Map();
userGroupList.set('userGroup1', {
  id: 'userGroup1',
  name: 'Jakarta',
  memberList: ['user1', 'user3'],
  newsFlashList: ['newsFlash1', 'newsFlash3'],
  reportList: ['report2', 'report3'],
});
userGroupList.set('userGroup2', {
  id: 'userGroup2',
  name: 'National',
  memberList: ['user2', 'user3'],
  newsFlashList: ['newsFlash2', 'newsFlash3'],
  reportList: ['report2', 'report3'],
});
userGroupList.set('userGroup3', {
  id: 'userGroup3',
  name: 'Balikpapan',
  memberList: ['user1', 'user2'],
  newsFlashList: ['newsFlash1', 'newsFlash2'],
  reportList: ['report1', 'report2'],
});
userGroupList.set('userGroup4', {
  id: 'userGroup4',
  name: 'Surabaya',
  memberList: ['user3', 'user4'],
  newsFlashList: ['newsFlash3', 'newsFlash4'],
  reportList: ['report3', 'report4'],
});
userGroupList.set('userGroup5', {
  id: 'userGroup5',
  name: 'Sidoarjo',
  memberList: ['user1', 'user4'],
  newsFlashList: ['newsFlash1', 'newsFlash4'],
  reportList: ['report1', 'report4'],
});
export default userGroupList;
