// @flow

import React, {Component} from 'react';

import {StyleSheet, Touchable} from 'react-primitives';
import {IconButton, Checkbox, Dialog} from 'material-ui';

import {
  View,
  Text,
  Button,
  Icon,
  MaterialIcon,
} from '../../../general/components/coreUIComponents';
import {
  THEME_COLOR,
  MEDIUM_GREY,
  GREY,
  ALTERNATIVE_GREY,
} from '../../../general/constants/colors';
import {DEFAULT_FONT_SIZE} from '../../../general/constants/text';
import formatDateTime from '../../../general/helpers/formatDateTime';

import type {ReportFile, ReportFolder} from './Report-type';

type Props = {
  report?: | {type: 'file'; item: ReportFile}
    | {type: 'folder'; item: ReportFolder};
  back?: boolean;
  moved?: boolean;
  selected?: boolean;
  moreOpened?: boolean;
  style?: StyleSheetTypes;
  onPress?: () => void;
  onCloseMorePress?: () => void;
  onEditPress?: (item: ReportFile | ReportFolder) => void;
  onCheck?: (event: Event, isChecked: boolean) => void;
  onMorePress?: () => void;
  onMovePress?: () => void;
  onDeletePress?: (id: number) => void;
};

type State = {
  isDeleteDialogOpened: boolean;
};

export default class ReportItem extends Component {
  props: Props;
  state: State = {isDeleteDialogOpened: false};

  render() {
    let {
      report,
      back,
      moved,
      selected,
      moreOpened,
      style,
      onPress,
      onCheck,
      onMorePress,
      onEditPress,
      onMovePress,
      onDeletePress,
      onCloseMorePress,
    } = this.props;
    let {isDeleteDialogOpened} = this.state;
    let item;
    let type;
    if (report) {
      ({item, type} = report);
    }

    let moreButton = moreOpened ? (
      <IconButton
        onTouchTap={onCloseMorePress}
        style={StyleSheet.flatten(styles.moreIconContainer)}
      >
        <MaterialIcon name="close" color={MEDIUM_GREY} />
      </IconButton>
    ) : (
      <IconButton
        onTouchTap={onMorePress}
        style={StyleSheet.flatten(styles.moreIconContainer)}
      >
        <MaterialIcon name="more-horiz" color={MEDIUM_GREY} />
      </IconButton>
    );
    let content;
    if (moreOpened) {
      content = (
        <View style={styles.flex}>
          <View style={styles.topMargin} />
          <IconButton
            onTouchTap={onCloseMorePress}
            style={StyleSheet.flatten(styles.moreIconContainer)}
          >
            <MaterialIcon name="close" color={MEDIUM_GREY} />
          </IconButton>
          <View style={[styles.content, styles.horizontalMargin]}>
            <Button
              primary
              label={type === 'file' ? 'Open' : 'Edit'}
              style={styles.smallTopMargin}
              onPress={() => {
                if (item) {
                  if (type === 'file') {
                    onPress && onPress();
                  } else {
                    onEditPress && onEditPress(item);
                  }
                }
              }}
            />
            <Button
              primary
              label="Move"
              style={styles.smallTopMargin}
              onPress={onMovePress}
            />
            <Button
              secondary
              label="Delete"
              style={styles.smallTopMargin}
              onPress={() => this.setState({isDeleteDialogOpened: true})}
            />
          </View>
        </View>
      );
    } else if (back) {
      content = (
        <Touchable onPress={onPress}>
          <View style={[styles.flex, styles.centerContent]}>
            <Icon name="back" style={styles.icon} />
          </View>
        </Touchable>
      );
    } else if (report) {
      let {type, item} = report;
      content = (
        <Touchable onPress={onPress}>
          <View style={[styles.flex, styles.content]}>
            <View style={[styles.rowFlexed, styles.centerAligned]}>
              <Touchable>
                <View>
                  <Checkbox
                    checked={selected}
                    onCheck={onCheck}
                    uncheckedIcon={
                      <MaterialIcon
                        name="check-box-outline-blank"
                        color={MEDIUM_GREY}
                      />
                    }
                    checkedIcon={
                      <MaterialIcon name="check-box" color={THEME_COLOR} />
                    }
                    style={StyleSheet.flatten(styles.checkbox)}
                  />
                </View>
              </Touchable>
              <Text style={[styles.flex, styles.fileTitle]}>{item.name}</Text>
            </View>
            <View style={styles.tinyTopMargin}>
              <Icon name={type} style={styles.icon} />
            </View>
            <View style={styles.tinyTopMargin}>
              <Text customStyle="small" style={styles.fileDescription}>
                created by: {item.creator && item.creator.name}
              </Text>
              <Text customStyle="small" style={styles.fileDescription}>
                created on: {formatDateTime(item.createdDate, 'DATE_TIME')}
              </Text>
              <Text customStyle="small" style={styles.fileDescription}>
                last edited on: {formatDateTime(item.lastEdited, 'DATE_TIME')}
              </Text>
            </View>
          </View>
        </Touchable>
      );
    }
    return (
      <View
        style={[
          styles.container,
          style,
          selected && styles.selectedContainer,
          moved && styles.moved,
        ]}
      >
        {!moreOpened && !back && !selected && moreButton}
        {content}
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
              onPress={() => {
                report &&
                  report.item &&
                  report.item.id &&
                  onDeletePress &&
                  onDeletePress(report.item.id);

                this.setState({isDeleteDialogOpened: false});
              }}
            />,
          ]}
          modal={false}
          open={isDeleteDialogOpened}
          onRequestClose={() =>
            this.setState({
              isDeleteDialogOpened: false,
            })}
        >
          <Text>Are you sure want to delete this item?</Text>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  moved: {
    borderColor: THEME_COLOR,
    borderStyle: 'dashed',
  },
  container: {
    borderColor: ALTERNATIVE_GREY,
    borderRadius: 4,
    borderWidth: 2,
    margin: 10,
    minHeight: 150,
    width: 200,
  },
  content: {
    padding: 15,
  },
  selectedContainer: {
    borderColor: THEME_COLOR,
  },
  centerContent: {
    height: 183,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  rowFlexed: {
    flexDirection: 'row',
  },
  centerAligned: {
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  endJustified: {
    justifyContent: 'flex-end',
  },
  checkbox: {
    width: 40,
    height: 24,
  },
  fileTitle: {
    flexWrap: 'wrap',
    paddingRight: 10,
    fontSize: DEFAULT_FONT_SIZE,
  },
  fileDescription: {
    color: GREY,
    textAlign: 'center',
  },
  moreIconContainer: {
    position: 'absolute',
    top: 3,
    right: 0,
  },
  icon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  topMargin: {
    marginTop: 20,
  },
  smallTopMargin: {
    height: 30,
    lineHeight: 0,
    marginTop: 13,
  },
  tinyTopMargin: {
    marginTop: 12,
  },
  horizontalMargin: {
    marginHorizontal: 20,
  },
  confirmationButton: {
    borderColor: 'transparent',
  },
});
