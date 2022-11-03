// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, TabBar} from '../../../general/components/coreUIComponents';

type ContentOptionProps = {
  selectedZoneMode: string;
  zoneModeList: Array<string>;
  onZoneChange: (newZone: string) => void;
  selectedVolumeMode: string;
  volumeModeList: Array<string>;
  onVolumeModeChange: (newVolumeMode: string) => void;
};

function ContentOption(props: ContentOptionProps) {
  let {
    selectedZoneMode,
    zoneModeList,
    onZoneChange,
    selectedVolumeMode,
    volumeModeList,
    onVolumeModeChange,
  } = props;
  let convertFromArrayToTabListFormat = (arr) =>
    arr.map((name) => ({tabName: name}));
  let zoneList = convertFromArrayToTabListFormat(zoneModeList);
  let volumeList = convertFromArrayToTabListFormat(volumeModeList);
  return (
    <View style={styles.toggleContentContainer}>
      <View style={{marginBottom: 10}}>
        <TabBar
          selectedTabName={selectedZoneMode}
          tabList={zoneList}
          onChangeTab={onZoneChange}
        />
      </View>
      <View>
        <TabBar
          selectedTabName={selectedVolumeMode}
          tabList={volumeList}
          onChangeTab={onVolumeModeChange}
        />
      </View>
    </View>
  );
}

let styles = StyleSheet.create({
  toggleContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
});

export default ContentOption;
