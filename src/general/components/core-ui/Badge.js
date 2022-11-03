// @flow

import React from 'react';
import {Badge} from 'material-ui';
import {StyleSheet} from 'react-primitives';

import {PALE_GREEN} from '../../../general/constants/colors';

type Props = {
  badgeContent: number | React$Element<*>;
};

export default function BadgeComponent(props: Props) {
  let {badgeContent} = props;
  return (
    <Badge
      badgeContent={badgeContent}
      badgeStyle={StyleSheet.flatten(styles.badgeIcon)}
      style={StyleSheet.flatten(styles.badge)}
      primary
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -12,
    top: -12,
    zIndex: 2,
  },
  badgeIcon: {
    backgroundColor: PALE_GREEN,
    height: 20,
    width: 20,
  },
});
