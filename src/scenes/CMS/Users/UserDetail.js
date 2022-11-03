// @flow

import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';
import {Dialog} from 'material-ui';
import autobind from 'class-autobind';

import {
  View,
  Text,
  TextInput,
  Button,
  Tag,
  Dropdown,
} from '../../../general/components/coreUIComponents';
import {ALTERNATIVE_GREY, colorStyles} from '../../../general/constants/colors';

import CMSSidebar from '../components/CMSSidebar';
import MultiSelectItemSidebar from '../components/MultiSelectItemSidebar';

import formatSnakeCaseToCapitalize from '../../../general/helpers/formatSnakeCaseToCapitalize';

import type {User, GroupMetadata} from '../CMS-type';

type Props = {
  userDetail: User;
  groupList: Map<number, GroupMetadata>;
  onCancelPress: () => void;
  onSavePress: User => void;
  currentUser: {
    access: 'SUPER_USER' | 'POWER_USER' | null;
    userLogin: string;
  };
};

type RoleItem = {
  value: 'USER' | 'POWER_USER' | 'SUPER_USER';
  text: 'User' | 'Super User' | 'Power User';
};

type State = {
  isConfirmDialogShowing: boolean;
  showingConfirmDialog: 'Save' | 'Discard' | null;
  isSideBarEnabled: boolean;
  selectedItems: Array<GroupMetadata>;
  itemList: Array<GroupMetadata>;
  activeRole: 'USER' | 'SUPER_USER' | 'POWER_USER';
  roleList: Array<RoleItem>;
};

export class UserDetail extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    let roleList = [
      {
        value: 'USER',
        text: 'User',
      },
      {
        value: 'POWER_USER',
        text: 'Power User',
      },
    ];
    if (this.props.currentUser.access === 'SUPER_USER') {
      roleList.push({
        value: 'SUPER_USER',
        text: 'Super User',
      });
    }
    this.state = {
      showingConfirmDialog: null,
      isConfirmDialogShowing: false,
      isSideBarEnabled: false,
      itemList: [],
      activeRole: this.props.userDetail.role,
      roleList: roleList,
      selectedItems: [],
    };
  }

  componentWillMount() {
    let {groups} = this.props.userDetail;
    let itemList = [];
    let selectedItems = this.state.selectedItems; // to avoid rerendering
    if (groups.length > 0 && [...this.props.groupList.values()].length > 0) {
      itemList = [...this.props.groupList.values()];
      selectedItems = groups;
    } else {
      itemList = [...this.props.groupList.values()];
    }
    this.setState({
      itemList,
      selectedItems,
      activeRole: this.props.userDetail.role,
    });
  }
  render() {
    let {selectedItems, activeRole} = this.state;
    let {userLogin} = this.props.userDetail;
    let {onCancelPress, userDetail, onSavePress} = this.props;
    return (
      <View style={[styles.container, colorStyles.thinShadow]}>
        <View style={styles.content}>
          <View style={styles.field}>
            <Text style={{marginBottom: 6}}>NAME</Text>
            <View
              style={[styles.inputStyle, {backgroundColor: ALTERNATIVE_GREY}]}
            >
              <TextInput
                fullWidth
                value={this.props.userDetail.name}
                disabled
              />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={{marginBottom: 6}}>USER ID</Text>
            <View
              style={[styles.inputStyle, {backgroundColor: ALTERNATIVE_GREY}]}
            >
              <TextInput fullWidth value={userLogin} disabled />
            </View>
          </View>
          <View style={[styles.field]}>
            <Text style={{marginBottom: 6}}>ROLE</Text>
            {this._checkAccess() ? (
              <Dropdown
                onSelect={(role) => this.setState({activeRole: role})}
                label=""
                options={this.state.roleList}
                selectedValue={this.state.activeRole}
              />
            ) : (
              <View
                style={[styles.inputStyle, {backgroundColor: ALTERNATIVE_GREY}]}
              >
                <TextInput
                  fullWidth
                  value={formatSnakeCaseToCapitalize(this.state.activeRole)}
                  disabled
                />
              </View>
            )}
          </View>
          <View style={styles.field}>
            <Text style={{marginBottom: 6}}>MEMBER OF GROUPS</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {Array.from(selectedItems).map(({id, groupName}) => {
                return (
                  <View style={styles.tagContainer} key={id}>
                    <Tag
                      key={id}
                      icon="group"
                      onRequestDelete={
                        this._checkAccess()
                          ? () => this._handleDelete(id.toString())
                          : () => {}
                      }
                      label={groupName}
                      disabled={!this._checkAccess()}
                    />
                  </View>
                );
              })}
              {this._checkAccess() && (
                <Button
                  secondary
                  label="Assign Group"
                  onPress={() =>
                    this.setState({
                      isSideBarEnabled: !this.state.isSideBarEnabled,
                    })}
                  icon="add"
                  iconPosition="left"
                  iconStyle={StyleSheet.flatten(styles.iconButton)}
                  style={StyleSheet.flatten(styles.button)}
                />
              )}
            </View>
          </View>
        </View>
        <CMSSidebar
          isOpen={this.state.isSideBarEnabled}
          title="Group List"
          onSave={this._saveData}
          onCancelPress={this._cancelPress}
          isSaveDisabled={!this._checkAccess()}
        >
          <MultiSelectItemSidebar
            searchPlaceholder="Search group..."
            icon="group"
            noItemFound="No group found. Please try another keyword."
            itemList={this.state.itemList.map(({id, groupName}) => ({
              id: id.toString(),
              name: groupName || '',
            }))}
            selectedItems={this.state.selectedItems.map(({id}) =>
              id.toString(),
            )}
            onConfirm={(selectedItems) =>
              this.setState({
                selectedItems: this.state.itemList.filter(({id}) =>
                  selectedItems.includes(id.toString()),
                ),
                itemList: this.state.itemList,
              })}
            toggleSidebar={this._toggleSidebar}
          />
        </CMSSidebar>
        <Dialog
          title={
            this.state.showingConfirmDialog
              ? this.state.showingConfirmDialog + ' Confirmation'
              : ''
          }
          actions={[
            <Button
              key="cancel"
              secondary
              label="Cancel"
              onPress={() => {
                this.setState({
                  isConfirmDialogShowing: false,
                  showingConfirmDialog: null,
                });
              }}
              style={styles.confirmationButton}
            />,
            <Button
              key={this.state.showingConfirmDialog || Math.random().toString()}
              secondary
              label={this.state.showingConfirmDialog}
              onPress={() => {
                if (this.state.showingConfirmDialog === 'Save') {
                  let updatedUser = {
                    ...userDetail,
                    role: activeRole,
                    groups: selectedItems,
                  };
                  onSavePress(updatedUser);
                } else {
                  onCancelPress();
                }
              }}
              style={styles.confirmationButton}
            />,
          ]}
          modal={false}
          open={this.state.isConfirmDialogShowing}
          onRequestClose={() =>
            this.setState({
              isConfirmDialogShowing: false,
              showingConfirmDialog: null,
            })}
        >
          {this.state.showingConfirmDialog === 'Save'
            ? `Do you want to save these changes?`
            : 'Are you sure you want to discard these changes?'}
        </Dialog>
      </View>
    );
  }
  _checkAccess() {
    let {currentUser: {access, userLogin}, userDetail} = this.props;
    if (access && userLogin) {
      return (
        access === 'SUPER_USER' ||
        userDetail.userLogin === userLogin ||
        (access === 'POWER_USER' && userDetail.role !== 'SUPER_USER')
      );
    }
    return false;
  }
  _cancelPress() {
    if (!this._checkAccess()) {
      this.props.onCancelPress();
    } else {
      this.setState({
        isConfirmDialogShowing: true,
        showingConfirmDialog: 'Discard',
      });
    }
  }
  _saveData() {
    this.setState({
      isConfirmDialogShowing: true,
      showingConfirmDialog: 'Save',
    });
  }
  _toggleSidebar(command: 'open' | 'close') {
    if (command === 'open') {
      this.setState({
        isSideBarEnabled: true,
      });
    } else {
      this.setState({
        isSideBarEnabled: false,
      });
    }
  }
  _handleDelete(id: string) {
    this.setState({
      selectedItems: this.state.selectedItems.filter(
        (item) => item.id.toString() !== id,
      ),
    });
  }
}

export default UserDetail;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  tagContainer: {
    marginRight: 20,
    marginBottom: 10,
  },
  iconButton: {
    marginLeft: 0,
  },
  button: {
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 480,
    paddingVertical: 20,
    borderRadius: 8,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flex: 1,
  },
  confirmationButton: {
    borderColor: 'transparent',
  },
  inputStyle: {
    height: 40,
    borderRadius: 4,
  },
  field: {
    height: 60,
    width: '100%',
    marginBottom: 30,
  },
});
