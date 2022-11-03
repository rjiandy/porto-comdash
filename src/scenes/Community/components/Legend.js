// @flow
import React from 'react';
import {View, Text} from '../../../general/components/coreUIComponents';
import {StyleSheet} from 'react-primitives';

type LegendDatum = {
  color: string;
  text: string;
};

type LegendProps = {
  legends: Array<LegendDatum>;
};

function Legend(props: LegendProps) {
  let {legends} = props;
  let legendsNode = legends.map(({color, text}, id) => {
    return (
      <View key={id} style={styles.textAndBoxLegendWrapper}>
        <View
          style={StyleSheet.flatten([
            styles.legendColorBox,
            {backgroundColor: color},
          ])}
        />
        <Text>
          {text}
        </Text>
      </View>
    );
  });
  return (
    <View style={styles.legendContainer}>
      {legendsNode}
    </View>
  );
}

let styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  textAndBoxLegendWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColorBox: {
    height: 10,
    width: 10,
    marginRight: 5,
  },
});

export default Legend;
