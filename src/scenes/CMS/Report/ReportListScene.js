// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {Transition, TransitionGroup} from 'react-transition-group';
import {StyleSheet, Animated} from 'react-primitives';
import {Checkbox, Dialog} from 'material-ui';
import {connect} from 'react-redux';

import ReportItem from './ReportItem';
import ReportDetailCMS from './ReportDetailCMS';
import Stepper from '../../../general/components/Stepper';

import {
  View,
  Button,
  Text,
  LoadingIndicator,
  ScrollView,
  MaterialIcon,
} from '../../../general/components/coreUIComponents';
import {
  Widget,
  MultipleSelectBar,
  DataLabel,
  SearchTextField,
} from '../../../general/components/UIComponents';
import {
  PALE_GREY,
  LIGHT_GREY,
  MEDIUM_GREY,
  THEME_COLOR,
} from '../../../general/constants/colors';

import type {
  ReportFileID,
  ReportFolderID,
  ReportFolder,
  ReportFile,
} from './Report-type';
import type {RootState} from '../../../general/stores/RootState';

type State = {
  settingItem: ?(ReportFileID | ReportFolderID);
  selectedItems: Set<ReportFileID | ReportFolderID>;
  movedItems: Set<ReportFileID | ReportFolderID>;
  selectedItem: ?{type: 'file' | 'folder'; item?: ReportFile | ReportFolder};
  animations: Array<Animated.Value>;
  isCMSOpened: boolean;
  isDeleteDialogOpened: boolean;
  steps: Array<ReportFolderID>;
  filterText: string;
};

type Props = {
  reportFolders: Map<ReportFolderID, ReportFolder>;
  activeFolder: ?ReportFolderID;
  windowWidth: number;
  isLoading: boolean;
  error: ?Error;
  fetchRootFolder: () => void;
  onFolderPressed: (id: ReportFolderID) => void;
  // deleteFolder: (
  //   fileIDList: Array<ReportFileID>,
  //   folderIDList: Array<ReportFolderID>,
  //   activeFolderID: ?ReportFolderID,
  // ) => void;
  // onMoveFinished: (reportIDList: Set<ReportID>, newFolderID: ReportID) => void;
};

const REPORTS_PER_ROW = 5;
const REPORTS_PER_ROW_IPAD_LANDSCAPE = 4;
const REPORTS_PER_ROW_IPAD_PORTRAIT = 3;

export class ReportList extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedItems: new Set(),
      movedItems: new Set(),
      settingItem: null,
      selectedItem: null,
      animations: [],
      isCMSOpened: false,
      isDeleteDialogOpened: false,
      steps: [0],
      filterText: '',
    };
  }

  componentWillMount() {
    this.props.fetchRootFolder();
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.reportFolders.size > 0) {
      let {steps} = this.state;
      this._initiateAnimation(steps[0]);
    }
  }

  render() {
    let {
      selectedItems,
      movedItems,
      isCMSOpened,
      isDeleteDialogOpened,
      selectedItem,
      steps,
    } = this.state;
    let {reportFolders, activeFolder, isLoading, windowWidth} = this.props;

    if (isLoading) {
      return (
        <Widget>
          <LoadingIndicator />
        </Widget>
      );
    }

    let folderContent = [];
    let fileContent = [];
    if (activeFolder != null) {
      let currentFolder = reportFolders.get(activeFolder);
      if (currentFolder) {
        folderContent = currentFolder.folders;
        fileContent = currentFolder.files;
      }
    } else {
      folderContent = Array.from(reportFolders.values()).filter(
        (folder) => folder.parentId == null,
      );
    }
    let buffer = [];
    let max =
      windowWidth >= 1200
        ? REPORTS_PER_ROW
        : windowWidth >= 900
          ? REPORTS_PER_ROW_IPAD_LANDSCAPE
          : REPORTS_PER_ROW_IPAD_PORTRAIT;
    let extra = steps.length > 1 ? 1 : 0;
    while (
      (folderContent.length + fileContent.length + buffer.length + extra) %
        max !==
      0
    ) {
      buffer.push(<View style={styles.buffer} />);
    }

    let reportList = (
      <Widget>
        {this._renderHeader(folderContent, fileContent)}
        <ScrollView>
          <TransitionGroup key={steps.length}>
            <View style={styles.reportsContainer}>
              {this._renderBackButton()}
              {this._renderFolders(folderContent)}
              {this._renderFiles(fileContent)}
              {buffer}
            </View>
          </TransitionGroup>
        </ScrollView>
        <MultipleSelectBar
          selectedItemsQty={selectedItems.size}
          item="report"
          buttons={[
            {
              name: 'Move Items',
              onPress: this._onSnackbarMovePress,
              type: 'secondary',
            },
            {
              name: 'Delete',
              onPress: this._onSnackbarDeletePress,
              type: 'secondary',
            },
            {
              name: 'Cancel',
              onPress: this._onSnackbarCancelPress,
              type: 'cancel',
            },
          ]}
        />
        <MultipleSelectBar
          selectedItemsQty={movedItems.size}
          item="report"
          buttons={[
            {
              name: 'Move Here',
              onPress: this._onSnackbarMoveHerePress,
              type: 'secondary',
            },
            {
              name: 'Cancel',
              onPress: this._onSnackbarCancelMovePress,
              type: 'cancel',
            },
          ]}
        />
        <Dialog
          title="Delete Confirmation"
          actions={[
            <Button
              secondary
              key="cancel"
              label="Cancel"
              style={styles.confirmationButton}
              onPress={() => this.setState({isDeleteDialogOpened: false})}
            />,
            <Button
              secondary
              key="delete"
              label="Delete"
              style={styles.confirmationButton}
              onPress={() => this._onDeletePress(selectedItems)}
            />,
          ]}
          modal={false}
          open={isDeleteDialogOpened}
          onRequestClose={() => {
            this.setState({isDeleteDialogOpened: false});
          }}
        >
          <Text>Are you sure want to delete these items?</Text>
        </Dialog>
      </Widget>
    );

    if (isCMSOpened && selectedItem) {
      return (
        <ReportDetailCMS
          type={selectedItem.type}
          id={selectedItem.item && selectedItem.item.id}
          initialValue={selectedItem.item}
          onClose={() =>
            this.setState({isCMSOpened: false, selectedItem: null})}
        />
      );
    }
    return reportList;
  }

  _renderHeader(
    folderContent: Array<ReportFolder>,
    fileContent: Array<ReportFile>,
  ) {
    let {steps, selectedItems, filterText} = this.state;
    let {reportFolders} = this.props;
    let isAllSelected =
      selectedItems.size === [...folderContent, ...fileContent].length;
    return (
      <View
        style={{
          paddingBottom: 15,
          marginBottom: 10,
        }}
      >
        <Stepper
          big
          steps={steps.map((stepID) => {
            if (stepID === 0) {
              return 'root directory';
            } else {
              let folder = reportFolders.get(stepID);
              return (folder && folder.name) || '';
            }
          })}
          onStepPress={this._goToStep}
          style={{marginLeft: 10, alignSelf: 'flex-start', marginBottom: 15}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <DataLabel style={{paddingHorizontal: 10}}>
              <Checkbox
                checked={isAllSelected}
                onCheck={(evt, isAllSelected) => {
                  let newSelectedItems = isAllSelected
                    ? new Set([
                      ...folderContent.map((folder) => folder.id),
                      ...fileContent.map((file) => file.id),
                    ])
                    : new Set();
                  this.setState({
                    selectedItems: newSelectedItems,
                  });
                }}
                style={{width: 40}}
                uncheckedIcon={
                  <MaterialIcon
                    name="check-box-outline-blank"
                    color={MEDIUM_GREY}
                  />
                }
                checkedIcon={
                  <MaterialIcon name="check-box" color={THEME_COLOR} />
                }
              />
              <Text>All</Text>
            </DataLabel>
            <SearchTextField
              value={filterText}
              onTextChange={(text) => this.setState({filterText: text})}
              icon="search"
              renderTextField={true}
              placeholder="Search report"
              containerStyle={[
                {
                  flex: 0,
                  marginHorizontal: 15,
                  borderWidth: 1,
                  borderColor: LIGHT_GREY,
                  borderRadius: 4,
                  height: 42,
                },
              ]}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button
              secondary
              label="Add Folder"
              icon="add"
              onPress={() =>
                this.setState({
                  isCMSOpened: true,
                  selectedItem: {type: 'folder'},
                })}
            />
            {steps.length > 1 && (
              <Button
                primary
                label="Add File"
                icon="add"
                onPress={() =>
                  this.setState({
                    isCMSOpened: true,
                    selectedItem: {type: 'file'},
                  })}
                style={{marginLeft: 10}}
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  _renderBackButton() {
    let {steps} = this.state;
    return (
      steps.length > 1 && (
        <Transition>
          <Animated.View>
            <ReportItem back onPress={this._onBackPress} />
          </Animated.View>
        </Transition>
      )
    );
  }

  _renderFolders(folderContent: Array<ReportFolder>) {
    let {selectedItems, settingItem, filterText} = this.state;
    let filteredfolderContent = folderContent.filter((folder) => {
      return folder.name.toLowerCase().includes(filterText.toLowerCase());
    });
    return filteredfolderContent.map((folder, index) => {
      if (folder) {
        return (
          <Transition key={index}>
            <Animated.View>
              <ReportItem
                report={{type: 'folder', item: folder}}
                selected={selectedItems && selectedItems.has(folder.id)}
                moreOpened={settingItem === folder.id}
                onCheck={(evt, isChecked) => {
                  folder && this._onItemCheck(folder.id, isChecked, 'folder');
                }}
                onPress={() => {
                  folder && this._onItemPress(folder, 'folder');
                }}
                onMorePress={() => {
                  folder && this._onMorePress(folder.id);
                }}
                onCloseMorePress={() => {
                  this.setState({settingItem: null});
                }}
                onEditPress={() => {
                  this._onEditPress(folder, 'folder');
                }}
                onMovePress={() => {
                  folder && this._onMovePress(folder.id);
                }}
                onDeletePress={(id: ReportFolderID) =>
                  this._onDeletePress(new Set([id]))}
              />
            </Animated.View>
          </Transition>
        );
      }
      return null;
    });
  }

  _renderFiles(fileContent: Array<ReportFile>) {
    let {selectedItems, settingItem, filterText} = this.state;
    let filteredfileContent = fileContent.filter((file) => {
      return file.name.toLowerCase().includes(filterText.toLowerCase());
    });
    return filteredfileContent.map((file, index) => {
      if (file) {
        return (
          <Transition key={index}>
            <Animated.View>
              <ReportItem
                report={{type: 'file', item: file}}
                selected={selectedItems && selectedItems.has(file.id)}
                moreOpened={settingItem === file.id}
                onCheck={(evt, isChecked) => {
                  file && this._onItemCheck(file.id, isChecked, 'file');
                }}
                onPress={() => {
                  file && this._onItemPress(file, 'file');
                }}
                onMorePress={() => {
                  file && this._onMorePress(file.id);
                }}
                onCloseMorePress={() => {
                  this.setState({settingItem: null});
                }}
                onEditPress={() => {
                  this._onEditPress(file, 'file');
                }}
                onMovePress={() => {
                  file && this._onMovePress(file.id);
                }}
                onDeletePress={(id: ReportFolderID) =>
                  this._onDeletePress(new Set([id]))}
              />
            </Animated.View>
          </Transition>
        );
      }
      return null;
    });
  }

  _goToStep(stepIndex: number) {
    let {steps} = this.state;
    if (stepIndex < steps.length - 1) {
      let repeat = stepIndex + 1;
      let newSteps = [];
      while (repeat > 0) {
        newSteps.push(steps.shift());
        repeat -= 1;
      }
      let folderID = newSteps[newSteps.length - 1];
      this._initiateAnimation(folderID, {steps: newSteps});
      if (folderID === 0) {
        this.props.fetchRootFolder();
      } else {
        this.props.onFolderPressed(folderID);
      }
    }
  }

  _initiateAnimation(id: number, extraSetStates?: {[key: string]: any}) {
    let {reportFolders, activeFolder} = this.props;
    let contentLength = 0;
    if (activeFolder != null) {
      let currentFolder = reportFolders.get(activeFolder);
      if (currentFolder) {
        contentLength =
          currentFolder.folders.length + currentFolder.files.length;
      }
    } else {
      let reportFolderArray = Array.from(reportFolders.values());
      contentLength = reportFolderArray.filter(
        (folder) => folder.parentId == null,
      ).length;
    }
    let animations = [];
    for (let i = 0; i < contentLength; i++) {
      animations.push(new Animated.Value(0));
    }
    animations.push(new Animated.Value(0));
    animations.push(new Animated.Value(0));
    this.setState(
      {
        animations,
        ...extraSetStates,
      },
      () => {
        Animated.stagger(
          150,
          animations.map((anim) => Animated.spring(anim, {toValue: 1})),
        ).start();
      },
    );
  }

  _createAnimatedStyle(index: number) {
    let {animations} = this.state;
    return {
      opacity: animations[index],
      transform: Animated.template`
        translate3d(0, ${animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['12px', '0px'],
        })},0)`,
    };
  }
  _onEditPress(item: ReportFile | ReportFolder, type: 'file' | 'folder') {
    this.setState({
      selectedItem: {type, item},
      isCMSOpened: true,
      settingItem: null,
    });
  }

  _onBackPress() {
    let {steps} = this.state;
    let newSteps = [...steps];
    newSteps.pop();
    let lastID = newSteps[newSteps.length - 1];
    this._initiateAnimation(lastID, {steps: newSteps});
    if (lastID === 0) {
      this.props.fetchRootFolder();
    } else {
      this.props.onFolderPressed(lastID);
    }
  }

  _onMovePress(reportID: number) {
    // let {movedReports} = this.state;
    // if (movedReports.size > 0) {
    //   // TODO: warn user that this will replace the current moved files
    // }
    this.setState({
      movedItems: new Set([reportID]),
      settingItem: null,
    });
  }

  _onDeletePress(reportIDList: Set<number>) {
    // eslint-disable-next-line no-alert
    alert(`delete ${Array.from(reportIDList.values()).join(' ')}`);
    this.setState({
      isDeleteDialogOpened: false,
      selectedItems: new Set(),
      settingItem: null,
    });
  }

  _onMorePress(id: ReportFileID | ReportFolderID) {
    this.setState({settingItem: id});
  }

  _onItemPress(item: ReportFile | ReportFolder, type: 'file' | 'folder') {
    if (type === 'folder') {
      let {steps} = this.state;
      let newSteps = [...steps];
      newSteps.push(item.id);
      this._initiateAnimation(item.id, {steps: newSteps});
      this.props.onFolderPressed(item.id);
    } else {
      this.setState({
        isCMSOpened: true,
        selectedItem: {type, item},
        settingItem: null,
      });
    }
  }

  _onSnackbarMovePress() {
    let {selectedItems} = this.state;
    this.setState({
      selectedItems: new Set(),
      movedItems: new Set(selectedItems),
    });
  }

  _onSnackbarDeletePress() {
    this.setState({isDeleteDialogOpened: true});
  }

  _onSnackbarCancelPress() {
    this.setState({
      selectedItems: new Set(),
    });
  }

  _onItemCheck(itemID: number, isChecked: boolean, type: 'file' | 'folder') {
    let {selectedItems} = this.state;
    let newSelectedItems = new Set(selectedItems);
    if (isChecked) {
      newSelectedItems.add(itemID);
    } else {
      newSelectedItems.delete(itemID);
    }
    this.setState({
      selectedItems: newSelectedItems,
      settingItem: null,
    });
  }

  _onSnackbarMoveHerePress() {
    // let {movedItems} = this.state;
    // let {stepper} = this.props;

    // onMoveFinished(movedItems, stepper[stepper.length - 1]);
    this.setState({
      movedItems: new Set(),
    });
  }

  _onSnackbarCancelMovePress() {
    this.setState({
      movedItems: new Set(),
    });
  }
}

const styles = StyleSheet.create({
  reportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buffer: {
    margin: 10,
    height: 150,
    width: 200,
  },
  snackbar: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: PALE_GREY,
    height: 46,
  },
  snackbarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  snackbarButton: {
    height: 26,
    lineHeight: 0,
  },
  confirmationButton: {
    borderColor: 'transparent',
  },
});

export function mapStateToProps(state: RootState) {
  let {cmsState} = state;
  let {reportCMS} = cmsState;
  let {reportFolders, activeFolder, isLoading, error} = reportCMS;
  return {
    windowWidth: state.windowSize.width,
    reportFolders,
    activeFolder,
    isLoading,
    error,
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchRootFolder: () => {
      dispatch({
        type: 'FETCH_REPORT_ROOT_FOLDER_REQUESTED',
      });
    },
    onFolderPressed: (folderID: ReportFolderID) => {
      dispatch({
        type: 'FETCH_REPORT_FOLDER_LIST_BY_ID_REQUESTED',
        folderID,
      });
      dispatch({
        type: 'ACTIVE_FOLDER_CHANGED',
        activeFolder: folderID,
      });
    },
    // deleteFolder: (
    //   fileIDList: Array<ReportFileID>,
    //   folderIDList: Array<ReportFolderID>,
    //   activeFolderID: ?ReportFolderID,
    // ) => {
    //   dispatch({
    //     type: 'DELETE_REPORT_REQUESTED',
    //     fileIDList,
    //     folderIDList,
    //     activeFolderID,
    //   });
    // },
    // onMoveFinished: (reportIDList: Set<ReportID>, newFolderID: ReportID) => {
    //   // eslint-disable-next-line no-alert
    //   alert(
    //     `newFolder: ${newFolderID}, reportIDList: ${Array.from(
    //       reportIDList.values(),
    //     ).join(' ')}`,
    //   );
    // },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportList);
