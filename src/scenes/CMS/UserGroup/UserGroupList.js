// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';
import {Checkbox, Dialog} from 'material-ui';
import UserGroupDetail from './UserGroupDetail';

import type {RootState} from '../../../general/stores/RootState';
import type {Dispatch} from '../../../general/stores/Action';

import {
  View,
  Text,
  MaterialIcon,
  Icon,
  Button,
  ScrollView,
  LoadingIndicator,
} from '../../../general/components/coreUIComponents';
import {
  Widget,
  SearchTextField,
} from '../../../general/components/UIComponents';
import MultipleSelectBar from '../../../general/components/MultipleSelectBar';
import {
  MEDIUM_GREY,
  ALTERNATIVE_GREY,
  MAIN_BLUE,
  LIGHT_GREY,
} from '../../../general/constants/colors';

import type {User, Group} from '../CMS-type';

// TODO: Define newsFlashList and reportList type
type Props = {
  currentUser: User;
  groupList: Map<number, Group>;
  newsFlashList: Map<string, mixed>;
  userList: Map<string, User>;
  reportList: Map<string, mixed>;
  helpLinkList: Map<string, mixed>;
  isLoading: boolean;
  error: ?Error;
  createGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (groupID: number | Array<number>) => void;
};

type State = {
  isDetailOpened: boolean;
  selectedGroups: Set<string>;
  selectedGroup: ?number;
  activeDetailGroup: ?number;
  isDeleteConfirmationDialogOpened: boolean;
  tickableGroupList: Array<string>;
  filterText: string;
};

export class UserGroupList extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isDetailOpened: false,
      selectedGroups: new Set(),
      selectedGroup: null,
      activeDetailGroup: null,
      isDeleteConfirmationDialogOpened: false,
      tickableGroupList: [],
      filterText: '',
    };
  }
  componentWillMount() {
    let {currentUser, groupList} = this.props;
    let tickableGroupList;
    if (currentUser.role !== 'SUPER_USER') {
      tickableGroupList = [...groupList.values()]
        .filter(({createdBy}) => createdBy !== 'SUPER_USER')
        .map(({id}) => id.toString());
    } else {
      tickableGroupList = [...groupList.values()].map(({id}) => id.toString());
    }
    this.setState({
      tickableGroupList,
    });
  }
  _onCheck(groupID: string) {
    let {selectedGroups} = this.state;
    let newSelectedGroup = new Set(selectedGroups);
    if (!selectedGroups.has(groupID)) {
      newSelectedGroup.add(groupID);
      this.setState({
        selectedGroups: newSelectedGroup,
        selectedGroup: null,
      });
    } else {
      newSelectedGroup.delete(groupID);
      this.setState({
        selectedGroups: newSelectedGroup,
        selectedGroup: null,
      });
    }
  }
  _isTickAll() {
    let {tickableGroupList, selectedGroups} = this.state;
    if (tickableGroupList.length === 0) {
      return false;
    }
    for (let id of tickableGroupList) {
      if (!selectedGroups.has(id)) {
        return false;
      }
    }
    return true;
  }
  _tickAll() {
    let {tickableGroupList, selectedGroups} = this.state;
    if (this._isTickAll()) {
      this.setState({
        selectedGroups: new Set(
          [...selectedGroups].filter((id) => !tickableGroupList.includes(id)),
        ),
      });
    } else {
      this.setState({
        selectedGroups: new Set([...[...selectedGroups], ...tickableGroupList]),
      });
    }
  }
  render() {
    let {isDetailOpened, activeDetailGroup, filterText} = this.state;
    let {groupList, isLoading, deleteGroup, currentUser, error} = this.props;
    if (isLoading) {
      return (
        <Widget>
          <View style={styles.flex}>
            <LoadingIndicator />
          </View>
        </Widget>
      );
    }
    if (error) {
      return (
        <View
          style={[styles.container, styles.justifyCenter, styles.alignCenter]}
        >
          <Text style={{fontStyle: 'italic'}}>An Error Occurred {error}</Text>
        </View>
      );
    }
    if (isDetailOpened) {
      return (
        <UserGroupDetail
          onSavePress={(group) => {
            activeDetailGroup
              ? this.props.updateGroup({
                ...group,
                createdBy:
                    currentUser.user && currentUser.user.role
                      ? currentUser.user.role
                      : 'USER',
              })
              : this.props.createGroup(group);
            this.setState({isDetailOpened: false});
          }}
          onCancelPress={() => this.setState({isDetailOpened: false})}
          groupDetail={
            activeDetailGroup ? groupList.get(activeDetailGroup) : null
          }
          userAccess={currentUser.role}
        />
      );
    }
    return (
      <Widget>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 14,
            marginHorizontal: 10,
          }}
        >
          <SearchTextField
            value={filterText}
            onTextChange={(filterText) =>
              this.setState({
                filterText,
                tickableGroupList: [...groupList.values()]
                  .filter(({groupName}) =>
                    groupName.toLowerCase().includes(filterText.toLowerCase()),
                  )
                  .map(({id}) => id.toString()),
              })}
            icon="search"
            renderTextField={true}
            placeholder="Search groups"
            containerStyle={[
              {
                flex: 0,
                borderWidth: 1,
                borderColor: LIGHT_GREY,
                borderRadius: 4,
                height: 42,
              },
            ]}
          />
          <Button
            primary
            label="Add New Group"
            icon="add"
            onPress={() => {
              this.setState({
                activeDetailGroup: null,
                isDetailOpened: true,
              });
            }}
          />
        </View>
        <View style={styles.container}>
          <ScrollView>
            <View
              style={[
                styles.flexRow,
                styles.alignCenter,
                {paddingRight: 96, marginBottom: 14},
              ]}
            >
              <View style={styles.iconContainer}>
                <Checkbox
                  style={{width: 40}}
                  iconStyle={{marginLeft: 1}}
                  checkedIcon={
                    <MaterialIcon name="check-box" style={{color: MAIN_BLUE}} />
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
              <View style={styles.header}>
                <Text style={styles.headerText}>Group Name</Text>
              </View>
              <View style={[styles.header, styles.alignCenter]}>
                <Text style={styles.headerText}>Members</Text>
              </View>
              <View style={[styles.header, styles.alignCenter]}>
                <Text style={styles.headerText}>Widgets</Text>
              </View>
              <View style={[styles.header, styles.alignCenter]}>
                <Text style={styles.headerText}>Newsflashes</Text>
              </View>
              <View style={[styles.header, styles.alignCenter]}>
                <Text style={styles.headerText}>Reports</Text>
              </View>
              <View style={[styles.header, styles.alignCenter]}>
                <Text style={styles.headerText}>Help Links</Text>
              </View>
            </View>
            <View style={styles.content}>
              {Array.from(groupList.values())
                .filter(({groupName}) =>
                  groupName.toLowerCase().includes(filterText.toLowerCase()),
                )
                .map((group, index) => {
                  let memberNames = group.users.map(({name}) => name || '');
                  let reportNames = group.reportFolders.map(
                    ({name}) => name || '',
                  );
                  let newsflashNames = group.newsFlashes.map(
                    ({title}) => title || '',
                  );
                  let widgetNames = group.widgets.map(
                    ({widgetName}) => widgetName || '',
                  );
                  let groupData = {
                    ...group,
                    memberList: memberNames,
                    widgetList: widgetNames,
                    reportList: reportNames,
                    helpLinkList: [],
                    newsFlashList: newsflashNames,
                  };
                  return (
                    <UserGroupRowItem
                      key={index}
                      group={groupData}
                      onCheck={() => {
                        this._onCheck(group.id.toString());
                      }}
                      isChecked={this.state.selectedGroups.has(
                        group.id.toString(),
                      )}
                      isEditing={this.state.selectedGroup === group.id}
                      isOptionsEnabled={
                        [...this.state.selectedGroups.values()].length === 0
                      }
                      onDetailPress={(groupID) =>
                        this.setState({
                          isDetailOpened: true,
                          activeDetailGroup: groupID,
                        })}
                      onDeletePress={(groupID) =>
                        this.setState({
                          selectedGroup: groupID,
                          isDeleteConfirmationDialogOpened: true,
                        })}
                      disabled={
                        currentUser.role !== 'SUPER_USER' &&
                        group.createdBy === 'SUPER_USER'
                      }
                      userAccess={currentUser.role}
                    />
                  );
                })}
            </View>
          </ScrollView>
        </View>
        <MultipleSelectBar
          item="user"
          selectedItemsQty={Array.from(this.state.selectedGroups).length}
          buttons={[
            {
              name: 'Delete',
              onPress: () => {
                this.setState({isDeleteConfirmationDialogOpened: true});
              },
              type: 'secondary',
            },
            {
              name: 'Cancel',
              type: 'cancel',
              onPress: () => {
                this.setState({selectedGroups: new Set()});
              },
            },
          ]}
        />
        <Dialog
          title="Delete Confirmation"
          actions={[
            <Button
              key="cancel"
              secondary
              label="Cancel"
              onPress={() =>
                this.setState({isDeleteConfirmationDialogOpened: false})}
              style={styles.confirmationButton}
            />,
            <Button
              key="delete"
              secondary
              label="Delete"
              onPress={() => {
                let {selectedGroup, selectedGroups} = this.state;
                if (selectedGroup) {
                  deleteGroup([selectedGroup]);
                } else {
                  deleteGroup(
                    [...selectedGroups.values()].map((groupID) =>
                      Number(groupID),
                    ),
                  );
                }
                this.setState({
                  selectedGroups: new Set(),
                  isDeleteConfirmationDialogOpened: false,
                });
              }}
              style={styles.confirmationButton}
            />,
          ]}
          modal={false}
          open={this.state.isDeleteConfirmationDialogOpened}
          onRequestClose={() =>
            this.setState({isDeleteConfirmationDialogOpened: false})}
        >
          {this.state.selectedGroup
            ? `Are you sure want delete this item?`
            : 'Are you sure want delete these items?'}
        </Dialog>
      </Widget>
    );
  }
}

type UserGroupRowItemProps = {
  group: {
    widgetList: Array<string>;
    memberList: Array<string>;
    newsFlashList: Array<string>;
    reportList: Array<string>;
    helpLinkList: Array<string>;
  } & Group;
  onCheck: () => void;
  isChecked: boolean;
  isEditing: boolean;
  disabled: boolean;
  isOptionsEnabled: boolean;
  onDetailPress: (groupID: number) => void;
  onDeletePress: (groupID: number) => void;
};

export function UserGroupRowItem(props: UserGroupRowItemProps) {
  let {
    isChecked,
    onCheck,
    group,
    onDetailPress,
    isOptionsEnabled,
    onDeletePress,
    disabled,
  } = props;
  return (
    <View
      style={[
        styles.rowItem,
        {borderColor: isChecked ? MAIN_BLUE : ALTERNATIVE_GREY},
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
          name="group"
          color="blueShade"
          style={[
            styles.avatar,
            {filter: disabled ? 'grayscale(100%) opacity(60%)' : 'unset'},
          ]}
        />
      </View>
      <View style={styles.flex}>
        <Text>{group.groupName}</Text>
      </View>
      <View style={[styles.flex, styles.flexRow, styles.justifyCenter]}>
        <Text fontWeight="bold" style={{color: MAIN_BLUE}}>
          {group.memberList.length.toString()}
        </Text>
      </View>
      <View style={[styles.flex, styles.flexRow, styles.justifyCenter]}>
        <Text fontWeight="bold" style={{color: MAIN_BLUE}}>
          {group.widgetList.length.toString()}
        </Text>
      </View>
      <View style={[styles.flex, styles.flexRow, styles.justifyCenter]}>
        <Text fontWeight="bold" style={{color: MAIN_BLUE}}>
          {group.newsFlashList.length.toString()}
        </Text>
      </View>
      <View style={[styles.flex, styles.flexRow, styles.justifyCenter]}>
        <Text fontWeight="bold" style={{color: MAIN_BLUE}}>
          {group.reportList.length.toString()}
        </Text>
      </View>
      <View style={[styles.flex, styles.flexRow, styles.justifyCenter]}>
        <Text fontWeight="bold" style={{color: MAIN_BLUE}}>
          {group.helpLinkList.length.toString()}
        </Text>
      </View>
      {isOptionsEnabled ? (
        disabled ? (
          <View style={[styles.justifyEnd, styles.flexRow]}>
            <View style={{width: 48, height: 48}} />
            <MaterialIcon
              name="navigate-next"
              color={MEDIUM_GREY}
              hoverColor={MAIN_BLUE}
              onPress={() => {
                onDetailPress(group.id);
              }}
            />
          </View>
        ) : (
          <View style={[styles.justifyEnd, styles.flexRow]}>
            <MaterialIcon
              name="delete"
              color={MEDIUM_GREY}
              hoverColor="red"
              onPress={() => {
                onDeletePress(group.id);
              }}
            />
            <MaterialIcon
              name="edit"
              color={MEDIUM_GREY}
              hoverColor={MAIN_BLUE}
              onPress={() => {
                onDetailPress(group.id);
              }}
            />
          </View>
        )
      ) : (
        <View style={[styles.justifyEnd, {width: 96}]} />
      )}
    </View>
  );
}

function mapStateToProps(state: RootState) {
  let {cmsState, currentUser} = state;
  return {
    currentUser: currentUser.user,
    error: cmsState.groupCMS.error,
    isLoading: cmsState.groupCMS.isLoading,
    groupList: cmsState.groupCMS.groups,
    userList: cmsState.userCMS.users,
    newsFlashList: cmsState.newsFlashCMS.newsFlashes,
    reportList: cmsState.reportCMS.reportFolders,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    createGroup: (group: Group) => {
      dispatch({type: 'CREATE_GROUP_REQUESTED', group});
    },
    updateGroup: (group: Group) => {
      dispatch({type: 'UPDATE_GROUP_REQUESTED', group});
    },
    deleteGroup: (groupID: Array<number>) => {
      dispatch({type: 'DELETE_GROUP_REQUESTED', groupID});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupList);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  confirmationButton: {
    borderColor: 'transparent',
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
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 22,
    height: 20,
  },
  buttonBlock: {
    width: '30%',
    height: '98%',
    backgroundColor: 'white',
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
