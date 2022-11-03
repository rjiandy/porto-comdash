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

import type {ID, HelpLink} from './HelpLink-type';

type Props = {
  helpLink: HelpLink;
  selected?: boolean;
  moreOpened?: boolean;
  hideMore?: boolean;
  style?: StyleSheetTypes;
  onPress?: () => void;
  onCheck?: (event: Event, isChecked: boolean) => void;
  onMorePress?: () => void;
  onDeletePress?: (id: ID) => void;
};

type State = {
  isDeleteDialogOpened: boolean;
};

export default class HelpLinkItem extends Component {
  props: Props;
  state: State = {isDeleteDialogOpened: false};
  render() {
    let {
      helpLink,
      selected,
      onCheck,
      style,
      onMorePress,
      hideMore,
      moreOpened,
      onDeletePress,
      onPress,
      ...otherProps
    } = this.props;

    let {isDeleteDialogOpened} = this.state;
    let moreButton = (
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
        <View style={[styles.flex, styles.content, styles.horizontalMargin]}>
          <View style={styles.topMargin} />
          <Button
            primary
            label="Open"
            style={styles.smallTopMargin}
            onPress={() => {}}
          />
          <Button
            secondary
            label="Delete"
            style={styles.smallTopMargin}
            onPress={() => this.setState({isDeleteDialogOpened: true})}
          />
        </View>
      );
    } else {
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
              <Text style={[styles.flex, styles.fileTitle]}>
                {helpLink.name}
              </Text>
            </View>
            <View style={styles.tinyTopMargin}>
              <Icon name="help" style={styles.icon} />
            </View>
            <View style={styles.tinyTopMargin}>
              <Text customStyle="small" style={styles.fileDescription}>
                created by: {helpLink.creator && helpLink.creator.name}
              </Text>
              <Text customStyle="small" style={styles.fileDescription}>
                created on: {formatDateTime(helpLink.createdDate, 'DATE_TIME')}
              </Text>
              <Text customStyle="small" style={styles.fileDescription}>
                last edited on:{' '}
                {formatDateTime(helpLink.lastEdited, 'DATE_TIME')}
              </Text>
            </View>
          </View>
        </Touchable>
      );
    }

    return (
      <View
        style={[styles.container, style, selected && styles.selectedContainer]}
        {...otherProps}
      >
        {!hideMore && moreButton}
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
                helpLink &&
                  helpLink.id &&
                  onDeletePress &&
                  onDeletePress(helpLink.id);

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
    minHeight: 185,
    width: 200,
  },
  content: {
    padding: 15,
  },
  selectedContainer: {
    borderColor: THEME_COLOR,
  },
  centerContent: {
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
