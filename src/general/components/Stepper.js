// @flow

import React from 'react';
import {StyleSheet, Image, Touchable} from 'react-primitives';
import {View, Text} from './coreUIComponents';
import rightArrow from '../../assets/images/right-arrow-grey.png';
import {GREY} from '../constants/colors';
import {SMALL_FONT_SIZE, TITLE_FONT_SIZE} from '../constants/text';

type Props = {
  big?: boolean;
  steps: ?Array<string>;
  onStepPress?: (index: number) => void;
  style?: StyleSheetTypes;
};

export default function Stepper(props: Props) {
  let {big, steps, onStepPress, style} = props;
  let arrowSize = big ? {width: 17, height: 17, marginRight: 15} : null;
  let textSize = big ? {fontSize: TITLE_FONT_SIZE, marginRight: 15} : null;
  let stepComponents = steps ? (
    steps.map((reportStep, index) => {
      return (
        <View style={styles.stepContainer} key={index}>
          {index !== 0 ? (
            <Image
              source={rightArrow}
              style={[styles.arrow, arrowSize]}
              resizeMode="contain"
            />
          ) : null}
          <Touchable onPress={() => onStepPress && onStepPress(index)}>
            <View>
              <Text style={[styles.step, textSize]}>{reportStep}</Text>
            </View>
          </Touchable>
        </View>
      );
    })
  ) : (
    <View />
  );
  return <View style={[styles.container, style]}>{stepComponents}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  step: {
    fontSize: SMALL_FONT_SIZE,
    color: GREY,
    marginRight: 7,
  },
  arrow: {
    height: 10,
    width: 10,
    marginRight: 7,
  },
});
