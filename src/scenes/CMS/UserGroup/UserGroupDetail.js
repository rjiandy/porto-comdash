// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {Dialog} from 'material-ui';

import {
  View,
  ScrollView,
  TextInput,
  Text,
  Button,
} from '../../../general/components/coreUIComponents';
import {
  colorStyles,
  ALTERNATIVE_GREY,
} from '../../../general/constants/colors.js';

import TagItem from './TagItem';
import CMSSidebar from '../components/CMSSidebar';
import MultiSelectItemSidebar from '../components/MultiSelectItemSidebar';
import styles from './UserGroupDetail-style';

import type {Group, User, NewsFlash, Widget, ReportFolder} from '../CMS-type';
import type {MultiSelectItemSidebarProps} from '../components/MultiSelectItemSidebar';
type DataType =
  | 'MEMBERS'
  | 'WIDGETS'
  | 'NEWS_FLASHES'
  | 'REPORTS'
  | 'HELP_LINKS';

type State = {
  groupTitle: string;
  isSidebarActive: boolean;
  sidebarContent: ?MultiSelectItemSidebarProps;
  sidebarType: DataType;
  assignedNewsFlashes: Array<string>;
  assignedWidgets: Array<string>;
  assignedReports: Array<string>;
  assignedHelpLinks: Array<string>;
  assignedUser: Array<string>;
  isConfirmDialogShowing: boolean;
  showingConfirmDialog: 'Save' | 'Discard' | null;
};

type Props = {
  // TODO: get these types from redux
  groupDetail: ?Group;
  userList: Map<string, User>;
  newsFlashList: Map<number, NewsFlash>;
  widgetList: Map<number, Widget>;
  reportList: Map<number, ReportFolder>;
  helpLinkList: Map<number, any>;
  onSavePress: (group: Group) => void;
  onCancelPress: () => void;
  userAccess: 'POWER_USER' | 'SUPER_USER';
};

export class UserGroupCMS extends Component {
  state: State;
  props: Props;
  _title: string;
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isConfirmDialogShowing: false,
      showingConfirmDialog: null,
      groupTitle: '',
      isSidebarActive: false,
      sidebarType: 'MEMBERS',
      sidebarContent: null,
      assignedUser: [],
      assignedWidgets: [],
      assignedReports: [],
      assignedHelpLinks: [],
      assignedNewsFlashes: [],
    };
    this._title = '';
  }
  componentWillMount() {
    if (this.props.groupDetail) {
      let {
        groupName,
        users,
        newsFlashes,
        widgets,
        reportFolders,
      } = this.props.groupDetail;
      let assignedMembers = users.map(({userLogin}) => userLogin);
      let assignedNewsFlashes = newsFlashes.map(({id}) => id.toString());
      let assignedWidgets = widgets.map(({id}) => id.toString());
      let assignedReports = reportFolders.map(({id}) => id.toString());
      this.setState({
        groupTitle: groupName,
        assignedUser: assignedMembers,
        assignedNewsFlashes,
        assignedWidgets,
        assignedReports,
      });
    }
  }
  _checkAccess() {
    let {userAccess, groupDetail} = this.props;
    if (groupDetail) {
      let {createdBy} = groupDetail;
      if (userAccess === 'SUPER_USER') {
        return true;
      } else {
        return createdBy !== 'SUPER_USER';
      }
    } else {
      return true;
    }
  }
  render() {
    let {
      userList,
      newsFlashList,
      widgetList,
      reportList,
      helpLinkList,
      onSavePress,
      onCancelPress,
    } = this.props;
    let {
      groupTitle,
      assignedUser,
      assignedWidgets,
      assignedReports,
      assignedHelpLinks,
      assignedNewsFlashes,
      isSidebarActive,
      sidebarContent,
    } = this.state;
    return (
      <View style={[styles.container, colorStyles.thinShadow]}>
        <ScrollView style={styles.content}>
          <View style={styles.fieldComponent}>
            <Text style={{marginBottom: 10}}>Group Name</Text>
            <View
              style={[
                styles.inputStyle,
                {backgroundColor: !this._checkAccess() && ALTERNATIVE_GREY},
              ]}
            >
              <TextInput
                fullWidth
                value={groupTitle}
                disabled={!this._checkAccess()}
                onTextChange={(newText) => this.setState({groupTitle: newText})}
                errorText={
                  groupTitle === '' ? 'Please fill the group name' : ''
                }
                hintText="Group Name"
              />
            </View>
          </View>
          <View style={styles.fieldComponent}>
            <TagItem
              items={{
                type: 'MEMBERS',
                data: [...userList.values()]
                  .filter(({userLogin}) => assignedUser.includes(userLogin))
                  .map(({userLogin, name}) => ({
                    type: 'MEMBERS',
                    userLogin,
                    name,
                  })),
              }}
              disabled={!this._checkAccess()}
              onTagDeletePress={(id) => {
                let newAssignedData = assignedUser
                  .filter((userLogin) => userLogin !== id)
                  .map((item) => item.toString());
                this.setState({
                  assignedUser: newAssignedData,
                  sidebarContent: this._setSidebarContent(
                    'MEMBERS',
                    newAssignedData,
                  ),
                });
              }}
              onAddPress={() => {
                this.setState({
                  isSidebarActive: true,
                  sidebarContent: this._setSidebarContent('MEMBERS'),
                });
              }}
            />
          </View>
          <View style={styles.fieldComponent}>
            <TagItem
              items={{
                type: 'WIDGETS',
                data: [...widgetList.values()]
                  .filter(({id}) => assignedWidgets.includes(id.toString()))
                  .map(({id, widgetName}) => ({
                    type: 'WIDGETS',
                    id: id.toString(),
                    name: widgetName,
                  })),
              }}
              disabled={!this._checkAccess()}
              onTagDeletePress={(id) => {
                let newAssignedData = assignedWidgets.filter(
                  (widgetID) => widgetID !== id,
                );
                this.setState({
                  assignedWidgets: newAssignedData,
                  sidebarContent: this._setSidebarContent(
                    'WIDGETS',
                    newAssignedData,
                  ),
                });
              }}
              onAddPress={() => {
                this.setState({
                  isSidebarActive: true,
                  sidebarContent: this._setSidebarContent('WIDGETS'),
                });
              }}
            />
          </View>
          <View style={styles.fieldComponent}>
            <TagItem
              items={{
                type: 'REPORTS',
                data: [...reportList.values()]
                  .filter(({id}) => assignedReports.includes(id.toString()))
                  .map(({id, name}) => ({
                    type: 'REPORTS',
                    id: id.toString(),
                    name,
                  })),
              }}
              disabled={!this._checkAccess()}
              onTagDeletePress={(id) => {
                let newAssignedData = assignedReports.filter(
                  (reportID) => reportID !== id,
                );
                this.setState({
                  assignedReports: newAssignedData,
                  sidebarContent: this._setSidebarContent(
                    'REPORTS',
                    newAssignedData,
                  ),
                });
              }}
              onAddPress={() => {
                this.setState({
                  isSidebarActive: true,
                  sidebarContent: this._setSidebarContent('REPORTS'),
                });
              }}
            />
          </View>
          <View style={styles.fieldComponent}>
            <TagItem
              items={{
                type: 'HELP_LINKS',
                data: [...helpLinkList.values()]
                  .filter(({id}) => assignedHelpLinks.includes(id.toString()))
                  .map(({id, name}) => ({
                    type: 'HELP_LINKS',
                    id: id.toString(),
                    name,
                  })),
              }}
              disabled={!this._checkAccess()}
              onTagDeletePress={(id) => {
                let newAssignedData = assignedHelpLinks.filter(
                  (helpLinkID) => helpLinkID !== id,
                );
                this.setState({
                  assignedHelpLinks: newAssignedData,
                  sidebarContent: this._setSidebarContent(
                    'HELP_LINKS',
                    newAssignedData,
                  ),
                });
              }}
              onAddPress={() => {
                this.setState({
                  isSidebarActive: true,
                  sidebarContent: this._setSidebarContent('HELP_LINKS'),
                });
              }}
            />
          </View>
          <View style={[styles.fieldComponent, {marginBottom: 0}]}>
            <TagItem
              items={{
                type: 'NEWS_FLASHES',
                data: [...newsFlashList.values()]
                  .filter(({id}) => assignedNewsFlashes.includes(id.toString()))
                  .map(({id, title}) => ({
                    type: 'NEWS_FLASHES',
                    id: id.toString(),
                    title,
                  })),
              }}
              disabled={!this._checkAccess()}
              onTagDeletePress={(id) => {
                let newAssignedData = assignedNewsFlashes.filter(
                  (newsFlashID) => newsFlashID !== id,
                );
                this.setState({
                  assignedNewsFlashes: newAssignedData,
                  sidebarContent: this._setSidebarContent(
                    'NEWS_FLASHES',
                    newAssignedData,
                  ),
                });
              }}
              onAddPress={() => {
                this.setState({
                  isSidebarActive: true,
                  sidebarContent: this._setSidebarContent('NEWS_FLASHES'),
                });
              }}
            />
          </View>
        </ScrollView>
        <CMSSidebar
          style={styles.sidebar}
          isOpen={isSidebarActive}
          title={this._title}
          isSaveDisabled={groupTitle === '' || !this._checkAccess()}
          onSave={() =>
            this.setState({
              isConfirmDialogShowing: true,
              showingConfirmDialog: 'Save',
            })}
          onCancelPress={() =>
            this._checkAccess()
              ? this.setState({
                isConfirmDialogShowing: true,
                showingConfirmDialog: 'Discard',
              })
              : this.props.onCancelPress()}
        >
          {isSidebarActive && sidebarContent ? (
            <MultiSelectItemSidebar {...sidebarContent} />
          ) : null}
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
              style={{borderColor: 'transparent'}}
            />,
            <Button
              key={this.state.showingConfirmDialog || Math.random().toString()}
              secondary
              label={this.state.showingConfirmDialog}
              onPress={() => {
                if (this.state.showingConfirmDialog === 'Save') {
                  onSavePress({
                    ...this.props.groupDetail,
                    groupName: this.state.groupTitle,
                    newsFlashes: [...newsFlashList.values()].filter(({id}) =>
                      assignedNewsFlashes.includes(id.toString()),
                    ),
                    reportFolders: [...reportList.values()].filter(({id}) =>
                      assignedReports.includes(id.toString()),
                    ),
                    users: [...userList.values()].filter(({userLogin}) =>
                      assignedUser.includes(userLogin),
                    ),
                    widgets: [...widgetList.values()].filter(({id}) =>
                      assignedWidgets.includes(id.toString()),
                    ),
                  });
                } else {
                  onCancelPress();
                }
              }}
              style={{borderColor: 'transparent'}}
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
  _setSidebarContent(
    type: DataType,
    newAssignedData?: Array<string>,
  ): ?MultiSelectItemSidebarProps {
    if (type) {
      let contentProps;
      switch (type) {
        case 'MEMBERS': {
          this._title = 'User List';
          contentProps = {
            icon: 'user',
            key: 'user',
            noItemFound: 'No users found. Please try another keyword',
            searchPlaceholder: 'Search User',
            itemList: [
              ...this.props.userList.values(),
            ].map(({userLogin, name}) => ({id: userLogin, name})),
            selectedItems: newAssignedData
              ? newAssignedData
              : this.state.assignedUser,
            toggleSidebar: () =>
              this.setState({isSidebarActive: false, sidebarContent: null}),
            onConfirm: (selectedMembers: Array<string>) => {
              this.setState({
                assignedUser: selectedMembers,
              });
            },
          };
          return contentProps;
        }
        case 'WIDGETS': {
          this._title = 'Widget List';
          contentProps = {
            icon: 'widget',
            key: 'widget',
            noItemFound: 'No widgets found. Please try another keyword',
            searchPlaceholder: 'Search Widget',
            itemList: [
              ...this.props.widgetList.values(),
            ].map(({id, widgetName}) => ({
              id: id.toString(),
              name: widgetName,
            })),
            selectedItems: newAssignedData
              ? newAssignedData
              : this.state.assignedWidgets,
            toggleSidebar: () =>
              this.setState({isSidebarActive: false, sidebarContent: null}),
            onConfirm: (selectedWidgets: Array<string>) => {
              this.setState({
                assignedWidgets: selectedWidgets,
              });
            },
          };
          return contentProps;
        }
        case 'REPORTS': {
          this._title = 'Report List';
          contentProps = {
            icon: 'file',
            key: 'report',
            noItemFound: 'No reports found. Please try another keyword',
            searchPlaceholder: 'Search Report',
            itemList: [...this.props.reportList.values()].map(({id, name}) => ({
              id: id.toString(),
              name,
            })),
            selectedItems: newAssignedData
              ? newAssignedData
              : this.state.assignedReports,
            toggleSidebar: () =>
              this.setState({isSidebarActive: false, sidebarContent: null}),
            onConfirm: (selectedReports: Array<string>) => {
              this.setState({
                assignedReports: selectedReports,
              });
            },
          };
          return contentProps;
        }
        case 'HELP_LINKS': {
          this._title = 'Help Link List';
          contentProps = {
            icon: 'help',
            key: 'help',
            noItemFound: 'No help links found. Please try another keyword',
            searchPlaceholder: 'Search Help Link',
            itemList: [
              ...this.props.helpLinkList.values(),
            ].map(({id, name}) => ({id: id.toString(), name})),
            selectedItems: newAssignedData
              ? newAssignedData
              : this.state.assignedHelpLinks,
            toggleSidebar: () =>
              this.setState({isSidebarActive: false, sidebarContent: null}),
            onConfirm: (selectedHelpLinks: Array<string>) => {
              this.setState({
                assignedHelpLinks: selectedHelpLinks,
              });
            },
          };
          return contentProps;
        }
        case 'NEWS_FLASHES': {
          this._title = 'News Flash List';
          contentProps = {
            icon: 'newsFlash',
            key: 'newsFlash',
            noItemFound: 'No news flash found. Please try another keyword',
            addDataButtonLabel: 'Create New Flash',
            searchPlaceholder: 'Search News Flash',
            itemList: [
              ...this.props.newsFlashList.values(),
            ].map(({id, title}) => ({id: id.toString(), name: title})),
            selectedItems: newAssignedData
              ? newAssignedData
              : this.state.assignedNewsFlashes,
            toggleSidebar: () =>
              this.setState({isSidebarActive: false, sidebarContent: null}),
            onConfirm: (selectedNewsFlashes) => {
              this.setState({
                assignedNewsFlashes: selectedNewsFlashes,
              });
            },
          };
          return contentProps;
        }
        default:
          return null;
      }
    }
  }
  _toggleSidebar(command: 'open' | 'close') {
    if (command === 'open') {
      this.setState({
        isSidebarActive: true,
      });
    } else {
      this.setState({
        isSidebarActive: false,
      });
    }
  }
}

function mapStateToProps(state) {
  let {
    userCMS,
    newsFlashCMS,
    widgetCMS,
    reportCMS,
    helpLinkCMS,
  } = state.cmsState;
  return {
    userList: userCMS.users,
    newsFlashList: newsFlashCMS.newsFlashes,
    widgetList: widgetCMS.widgets,
    reportList: reportCMS.reportFolders,
    helpLinkList: helpLinkCMS.helpLinks,
  };
}

export default connect(mapStateToProps)(UserGroupCMS);
