// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {
  View,
  Text,
  Icon,
} from '../../../../../general/components/coreUIComponents';
import {THEME_COLOR} from '../../../../../general/constants/colors';

type HeaderProps = {
  title?: string;
  currentIndex: number;
  maxIndex: number;
  onHandleClose: () => void;
};

const DEFAULT_TITLE = 'NEWSFLASH';

function Header(props: HeaderProps) {
  let {title, currentIndex, maxIndex, onHandleClose} = props;
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <View>
          <Text customStyle="title" style={styles.title}>
            {title ? title : DEFAULT_TITLE}
          </Text>
          <View style={styles.separatorBar} />
        </View>
      </View>
      <View style={styles.locationIndex}>
        <Text>
          {currentIndex + 1} / {maxIndex + 1}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Icon
          name="close"
          color="blue"
          onPress={onHandleClose}
          style={StyleSheet.flatten(styles.iconDimension)}
        />
      </View>
    </View>
  );
}

let styles = StyleSheet.create({
  locationIndex: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDimension: {
    width: 12,
    height: 12,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  titleContainer: {
    alignSelf: 'center',
  },
  title: {
    marginBottom: 5,
  },
  separatorBar: {
    height: 3,
    backgroundColor: THEME_COLOR,
    borderRadius: 2,
    marginBottom: 20,
  },
});

export default Header;
