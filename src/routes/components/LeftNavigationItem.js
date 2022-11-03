// @flow

import React from 'react';
import {View, Image, StyleSheet} from 'react-primitives';
import {Route} from 'react-router-dom';
import {Link} from '../../general/components/coreUIComponents';

type LeftNavIconProps = {
  to: string;
  imgSource: string | {uri: string};
  activeOnlyWhenExact?: boolean;
};

export default function LeftNavigationItem(props: LeftNavIconProps) {
  let {to, imgSource, activeOnlyWhenExact} = props;
  return (
    <Route path={to} exact={activeOnlyWhenExact}>
      {
        ({match}) => (
          <View style={[styles.flexRow, styles.bigTopMargin, styles.leftNavIconContainer]}>
            <View style={match ? styles.activeLeftNav : null} />
            <View style={[styles.flex, styles.centerContent]}>
              <Link to={to}>
                <Image source={imgSource} style={styles.leftNavIcon} />
              </Link>
            </View>
          </View>
        )
      }
    </Route>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigTopMargin: {
    marginTop: 40,
  },
  leftNavIconContainer: {
    height: 45,
  },
  leftNavIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 0,
  },
  activeLeftNav: {
    backgroundColor: '#4a90e2',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: -4,
    width: 4,
  },
});
