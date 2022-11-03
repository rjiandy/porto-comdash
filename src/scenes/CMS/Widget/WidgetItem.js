// @flow

import React, {Component} from 'react';
import {StyleSheet, Touchable} from 'react-primitives';
import {
  View,
  Text,
  FlexImage,
} from '../../../general/components/coreUIComponents';

import {ALTERNATIVE_GREY} from '../../../general/constants/colors';
import {DEFAULT_FONT_SIZE} from '../../../general/constants/text';

import {widgets as widgetList} from '../../../routes/widgets';

import type {Widget} from './Widget-type';

type Props = {
  widget: Widget;
  style?: StyleSheetTypes;
  onPress?: () => void;
};

type State = {
  isDeleteDialogOpened: boolean;
};

export default class WidgetItem extends Component {
  props: Props;
  state: State = {isDeleteDialogOpened: false};
  render() {
    let {widget, style, onPress, ...otherProps} = this.props;

    return (
      <View style={[styles.container, style]} {...otherProps}>
        <Touchable onPress={onPress}>
          <View style={[styles.flex, styles.content]}>
            <View style={[styles.rowFlexed, styles.centerAligned]}>
              <Text style={[styles.flex, styles.widgetTitle]}>
                {widget.title}
              </Text>
            </View>
            <View style={styles.tinyTopMargin}>
              {widgetList[widget.widgetName] ? (
                <FlexImage source={widgetList[widget.widgetName].thumbnail} />
              ) : null}
            </View>
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: ALTERNATIVE_GREY,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 30,
    marginVertical: 15,
    minHeight: 230,
    width: 250,
  },
  content: {
    padding: 15,
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
  widgetTitle: {
    fontSize: DEFAULT_FONT_SIZE,
  },
  icon: {
    width: 100,
    height: 100,
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
});
