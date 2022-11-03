// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import autobind from 'class-autobind';
import {StyleSheet} from 'react-primitives';
import {Checkbox} from 'material-ui';
import UserDetail from './UserDetail';

import type {RootState} from '../../../general/stores/RootState';
import type {Dispatch} from '../../../general/stores/Action';

import {
  View,
  Text,
  MaterialIcon,
  Icon,
  ScrollView,
  LoadingIndicator,
} from '../../../general/components/coreUIComponents';
import {
  Widget,
  SearchTextField,
} from '../../../general/components/UIComponents';
import MultipleSelectBar from '../../../general/components/MultipleSelectBar';
import MultiSelectItemSidebar from '../components/MultiSelectItemSidebar';

import formatSnakeCaseToCapitalize from '../../../general/helpers/formatSnakeCaseToCapitalize';

import {
  ALTERNATIVE_GREY,
  MEDIUM_GREY,
  MAIN_BLUE,
  LIGHT_GREY,
} from '../../../general/constants/colors';

import type {User, Group, GroupMetadata} from '../CMS-type';

type UserRowItemProps = {
  onCheck: () => void;
  isChecked: boolean;
  onDetailPress: string => void;
  onOptionPress: string => void;
  groupsName: Array<string>;
  isOptionsEnabled: boolean;
  isEditing: boolean;
  disabled: boolean;
} & User;

function UserRowItem(props: UserRowItemProps) {
  let {
    isChecked,
    onCheck,
    role,
    userLogin,
    name,
    groupsName,
    onDetailPress,
    isOptionsEnabled,
    disabled,
  } = props;
  return (
    <View
      style={[
        styles.rowItem,
        {
          borderColor: isChecked ? MAIN_BLUE : ALTERNATIVE_GREY,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        {!disabled ? (
          <Checkbox
            style={{width: 40}}
            checkedIcon={
              <MaterialIcon name="check-box" style={{color: MAIN_BLUE}} />
            }
            uncheckedIcon={
              <MaterialIcon
                name="check-box-outline-blank"
                style={{color: MEDIUM_GREY}}
              />
            }
            checked={isChecked}
            onCheck={onCheck}
          />
        ) : (
          <View style={{width: 40}} />
        )}
        <Icon
          name="user"
          color="blueShade"
          style={[
            styles.avatar,
            {filter: disabled ? 'grayscale(100%) opacity(60%)' : 'unset'},
          ]}
        />
      </View>
      <View style={{flex: 0.7}}>
        <Text>{name}</Text>
      </View>
      <View style={{flex: 0.7}}>
        <Text>{userLogin}</Text>
      </View>
      <View style={{flex: 0.5}}>
        <Text>{formatSnakeCaseToCapitalize(role)}</Text>
      </View>
      <View style={[styles.flex, styles.flexRow, styles.alignCenter]}>
        <Text style={styles.flex}>{groupsName.join(', ')}</Text>
      </View>
      {isOptionsEnabled ? (
        <View style={[{flex: 0}, styles.justifyEnd]}>
          <MaterialIcon
            name={!disabled ? 'edit' : 'navigate-next'}
            color={MEDIUM_GREY}
            hoverColor={MAIN_BLUE}
            onPress={() => onDetailPress(userLogin)}
          />
        </View>
      ) : (
        <View style={[styles.justifyEnd, {width: 48}]} />
      )}
    </View>
  );
}

type Props = {
  userList: Map<string, User>;
  userGroupList: Map<number, Group | GroupMetadata>; // TODO: get this type from redux
  updateUser: User => void;
  isLoading: boolean;
  error: ?Error;
  multipleGroupAssign: (
    assignedUsers: Array<string>,
    assignedGroups: Array<number>,
  ) => void;
  currentUser: {
    access: 'SUPER_USER' | 'POWER_USER' | null;
    userLogin: string;
  };
};
type State = {
  isDetailOpened: boolean;
  isSidebarOpened: boolean;
  selectedUsers: Set<string>;
  activeDetailUser: string;
  dirtyAssignedGroups: Array<string>;
  selectedUser: ?string;
  tickableUserList: Array<string>;
  filterText: string;
};

export class UserList extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isDetailOpened: false,
      selectedUsers: new Set(),
      selectedUser: null,
      activeDetailUser: '',
      isSidebarOpened: false,
      dirtyAssignedGroups: [],
      tickableUserList: [],
      filterText: '',
    };
  }
  componentWillMount() {
    let {currentUser, userList} = this.props;
    let tickableUserList;
    if (currentUser.access !== 'SUPER_USER') {
      tickableUserList = [...userList.values()]
        .filter(({role}) => role !== 'SUPER_USER')
        .map(({userLogin}) => userLogin);
    } else {
      tickableUserList = [...userList.values()].map(({userLogin}) => userLogin);
    }
    this.setState({
      tickableUserList,
    });
  }
  _isTickAll() {
    let {tickableUserList, selectedUsers} = this.state;
    if (tickableUserList.length === 0) {
      return false;
    }
    for (let id of tickableUserList) {
      if (!selectedUsers.has(id)) {
        return false;
      }
    }
    return true;
  }
  _tickAll() {
    let {tickableUserList, selectedUsers} = this.state;
    if (this._isTickAll()) {
      this.setState({
        selectedUsers: new Set(
          [...selectedUsers].filter((id) => !tickableUserList.includes(id)),
        ),
      });
    } else {
      this.setState({
        selectedUsers: new Set([...[...selectedUsers], ...tickableUserList]),
      });
    }
  }
  _onCheck(userLogin: string) {
    let {selectedUsers} = this.state;
    let newUsers = new Set(selectedUsers);
    if (!selectedUsers.has(userLogin)) {
      newUsers.add(userLogin);
      this.setState({
        selectedUsers: newUsers,
        selectedUser: null,
      });
    } else {
      newUsers.delete(userLogin);
      this.setState({
        selectedUsers: newUsers,
        selectedUser: null,
      });
    }
  }
  render() {
    let {isDetailOpened, isSidebarOpened, filterText} = this.state;
    let {
      userList,
      userGroupList,
      updateUser,
      isLoading,
      error,
      currentUser,
    } = this.props;
    let userListPage = (
      <Widget>
        {isLoading && !error ? (
          <View
            style={[styles.container, styles.justifyCenter, styles.alignCenter]}
          >
            <LoadingIndicator />
          </View>
        ) : !isLoading && error ? (
          <View
            style={[styles.container, styles.justifyCenter, styles.alignCenter]}
          >
            <Text style={{fontStyle: 'italic'}}>An Error Occurred {error}</Text>
          </View>
        ) : (
          <View style={styles.flex}>
            <View style={styles.filterContainer}>
              <SearchTextField
                value={filterText}
                onTextChange={(filterText) =>
                  this.setState({
                    filterText,
                    tickableUserList: [...userList.values()]
                      .filter(({name}) =>
                        name.toLowerCase().includes(filterText.toLowerCase()),
                      )
                      .map(({userLogin}) => userLogin),
                  })}
                icon="search"
                renderTextField={true}
                placeholder="Search users"
                containerStyle={[
                  {
                    flex: 0,
                    borderWidth: 1,
                    borderColor: LIGHT_GREY,
                    borderRadius: 4,
                    height: 42,
                    alignSelf: 'flex-start',
                  },
                ]}
              />
            </View>
            <View style={styles.container}>
              <ScrollView>
                <View
                  style={[
                    styles.flexRow,
                    styles.justifyCenter,
                    {paddingRight: 48, marginBottom: 14},
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Checkbox
                      style={{width: 10}}
                      iconStyle={{marginLeft: 1}}
                      checkedIcon={
                        <MaterialIcon
                          name="check-box"
                          style={{color: MAIN_BLUE}}
                        />
                      }
                      uncheckedIcon={
                        <MaterialIcon
                          name="check-box-outline-blank"
                          style={{color: MEDIUM_GREY}}
                        />
                      }
                      checked={this._isTickAll()}
                      onCheck={this._tickAll}
                    />
                    <View style={styles.avatar} />
                  </View>
                  <View style={[styles.header, {flex: 0.7}]}>
                    <Text style={styles.headerText}>Name</Text>
                  </View>
                  <View style={[styles.header, {flex: 0.7}]}>
                    <Text style={styles.headerText}>User ID</Text>
                  </View>
                  <View style={[styles.header, {flex: 0.5}]}>
                    <Text style={styles.headerText}>Role</Text>
                  </View>
                  <View style={styles.header}>
                    <Text style={styles.headerText}>Groups</Text>
                  </View>
                </View>
                <View style={styles.content}>
                  {Array.from(userList.values())
                    .filter(({name}) =>
                      name.toLowerCase().includes(filterText.toLowerCase()),
                    )
                    .map((user, index) => {
                      let groupsName = user.groups.map((group) => {
                        return group.groupName || group.id.toString(); // NOTE: use ID if groupName is null
                      });
                      return (
                        <UserRowItem
                          key={index}
                          {...user}
                          groupsName={groupsName}
                          onCheck={() => {
                            this._onCheck(user.userLogin);
                          }}
                          onOptionPress={() =>
                            this.setState({
                              selectedUser:
                                user.userLogin === this.state.selectedUser
                                  ? null
                                  : user.userLogin,
                            })}
                          isEditing={this.state.selectedUser === user.userLogin}
                          isOptionsEnabled={
                            [...this.state.selectedUsers.values()].length === 0
                          }
                          disabled={
                            currentUser.access !== 'SUPER_USER' &&
                            user.role === 'SUPER_USER'
                          }
                          isChecked={this.state.selectedUsers.has(
                            user.userLogin,
                          )}
                          onDetailPress={(userLogin) =>
                            this.setState({
                              isDetailOpened: true,
                              activeDetailUser: userLogin,
                            })}
                        />
                      );
                    })}
                </View>
              </ScrollView>
              <MultipleSelectBar
                item="user"
                selectedItemsQty={
                  Array.from(this.state.selectedUsers.values()).length
                }
                buttons={[
                  {
                    name: 'Assign',
                    onPress: () => {
                      this.setState({
                        isSidebarOpened: true,
                      });
                    },
                    type: 'primary',
                  },
                  {
                    name: 'Cancel',
                    type: 'cancel',
                    onPress: () => {
                      this.setState({
                        selectedUsers: new Set(),
                        isSidebarOpened: false,
                      });
                    },
                  },
                ]}
              />
              {isSidebarOpened ? (
                <View style={styles.sidebarContainer}>
                  <MultiSelectItemSidebar
                    searchPlaceholder="Search group..."
                    icon="group"
                    noItemFound="No groups found. Please try another keyword or refresh this page."
                    itemList={[
                      ...userGroupList.values(),
                    ].map(({id, groupName}) => ({
                      id: id.toString(),
                      name: groupName || '',
                    }))}
                    toggleSidebar={(
                      command: 'open' | 'close',
                      selectedItems,
                    ) => {
                      this.setState({
                        dirtyAssignedGroups: selectedItems,
                        isSidebarOpened: false,
                      });
                    }}
                    selectedItems={this.state.dirtyAssignedGroups}
                    onConfirm={(selectedGroups) => {
                      this.props.multipleGroupAssign(
                        [...this.state.selectedUsers.values()],
                        selectedGroups.map((id) => Number(id)),
                      );
                      this.setState({
                        dirtyAssignedGroups: [],
                        selectedUsers: new Set(),
                        isSidebarOpened: false,
                      });
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        )}
      </Widget>
    );
    return isDetailOpened ? (
      <UserDetail
        onSavePress={(user: User) => {
          updateUser(user);
          this.setState({isDetailOpened: false, selectedUser: null});
        }}
        onCancelPress={() =>
          this.setState({isDetailOpened: false, selectedUser: null})}
        userDetail={userList.get(this.state.activeDetailUser)}
        groupList={userGroupList}
        currentUser={this.props.currentUser}
      />
    ) : (
      userListPage
    );
  }
}

function mapStateToProps(state: RootState) {
  let {cmsState, currentUser} = state;
  let {userCMS, groupCMS} = cmsState;
  return {
    currentUser: {
      access: (currentUser.user && currentUser.user.role) || null,
      userLogin: (currentUser.user && currentUser.user.userLogin) || '',
    },
    isLoading: userCMS.isLoading,
    error: userCMS.error,
    userList: userCMS.users,
    userGroupList: groupCMS.groups, // TODO: Use this to assign when multiple select is on
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateUser(user: User) {
      dispatch({
        type: 'UPDATE_USER_REQUESTED',
        user,
      });
    },
    multipleGroupAssign(userIDs, groupIDs) {
      dispatch({
        type: 'ASSIGN_MULTIPLE_USER_TO_GROUPS_REQUESTED',
        userIDs,
        groupIDs,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  touchable: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  iconContainer: {
    width: 107,
    flexDirection: 'row',
    paddingLeft: 15,
    alignItems: 'center',
  },
  rowItem: {
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1.6,
    height: 40,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  button: {
    width: 120,
    lineHeight: 0,
    height: 30,
    margin: 'auto',
  },
  header: {
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    color: MAIN_BLUE,
    fontWeight: '700',
  },
  spacer: {
    width: 107,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  avatar: {
    width: 22,
    height: 20,
  },
  sidebarContainer: {
    marginLeft: 20,
    backgroundColor: 'white',
    maxWidth: 260, // weird behaviour because it keeps growing
    minWidth: 260,
    flex: 1,
    padding: 20,
    paddingBottom: 12,
    borderLeftWidth: 1,
    borderColor: '#D0DAE3',
  },
  filterContainer: {
    marginBottom: 16,
    marginHorizontal: 10,
  },
});
