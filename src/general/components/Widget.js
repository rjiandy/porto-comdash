// @flow

import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';
import {View, Text} from './coreUIComponents';
import {colorStyles, THEME_COLOR} from '../constants/colors';

import type {RootState} from '../stores/RootState';

type Props = {
  windowWidth: number;
  title?: string;
  filters?: ReactNode;
  children: React$Element<*> | ReactClass<*>;
  style?: StyleSheetTypes;
};

export function Widget(props: Props) {
  let {children, title, filters, style, windowWidth} = props;
  return (
    <View
      style={[styles.container, colorStyles.thinShadow, style]}
      elevation={5}
    >
      {/* TODO: This should not render any header if title is empty */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {title ? (
            <View>
              <Text customStyle="title" style={styles.title}>
                {title}
              </Text>
              <View style={styles.separatorBar} />
            </View>
          ) : null}
        </View>
        {windowWidth > 900 && filters}
      </View>
      {windowWidth <= 900 && filters}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    minWidth: 590,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
  title: {
    marginBottom: 10,
  },
  separatorBar: {
    height: 3,
    backgroundColor: THEME_COLOR,
    borderRadius: 2,
    marginBottom: 20,
  },
});

function mapStateToProps(state: RootState) {
  return {
    windowWidth: state.windowSize.width,
  };
}

export default connect(mapStateToProps)(Widget);
