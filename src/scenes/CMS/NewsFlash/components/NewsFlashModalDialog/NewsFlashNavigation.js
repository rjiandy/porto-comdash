// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, Icon} from '../../../../../general/components/coreUIComponents';

type NavigationProps = {
  onPreviousSelected: () => void;
  onNextSelected: () => void;
  currentIndex: number;
  maxIndex: number;
};

function NewsFlashNavigation(props: NavigationProps) {
  let {onPreviousSelected, onNextSelected, currentIndex, maxIndex} = props;
  return (
    <View>
      <View style={[styles.arrowPosition, {left: 0}]}>
        <Icon
          name="right-arrow"
          onPress={onPreviousSelected}
          color={currentIndex === 0 ? 'grey' : 'blue'}
          style={{transform: [{rotate: '180deg'}]}}
        />
      </View>
      <View style={[styles.arrowPosition, {right: 0}]}>
        <Icon
          name="right-arrow"
          onPress={onNextSelected}
          color={currentIndex === maxIndex ? 'grey' : 'blue'}
        />
      </View>
    </View>
  );
}

let styles = StyleSheet.create({
  arrowPosition: {
    top: '50%',
    height: 50,
    width: 50,
    position: 'fixed',
  },
});

export default NewsFlashNavigation;
