// @flow
import React from 'react';
import {Image, StyleSheet} from 'react-primitives';
import {View, Text} from '../../components/coreUIComponents.js';
import warningIcon from '../../../assets/images/warning.svg';
import {PALE_RED, LIGHT_GREY} from '../../constants/colors.js';
type Props = {
  errorMessage: mixed;
  url: string;
};

export default function ErrorComponent(props: Props) {
  let {errorMessage, url} = props;
  return (
    <View style={styles.container}>
      <Image source={warningIcon} style={styles.icon} />
      <Text customStyle="title" fontWeight="bold" style={styles.title}>
        Error on {url}
      </Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: LIGHT_GREY,
    borderRadius: 4,
  },
  title: {
    color: PALE_RED,
    marginVertical: 15,
    flexWrap: 'wrap',
  },
  errorMessage: {
    flexWrap: 'wrap',
  },
  icon: {
    height: 42,
    width: 42,
  },
});
