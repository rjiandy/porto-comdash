// @flow
import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';

import {
  FixedRatioView,
  FlexImage,
  Text,
  View,
} from '../general/components/coreUIComponents';
import {LIGHT_GREY, THEME_COLOR} from '../general/constants/colors';

import type {WidgetDefinition} from '../routes/widgets';

type Props = {
  widget: WidgetDefinition;
  style?: StyleSheetTypes;
  isSelected?: boolean;
};

class WidgetThumbnail extends Component {
  props: Props;
  state = {isHovered: false};

  render() {
    let {widget, isSelected} = this.props;
    let {title, thumbnail} = widget;
    let {isHovered} = this.state;
    return (
      <View
        style={styles.thumbnailContainer}
        onMouseOver={() => this.setState({isHovered: true})}
        onMouseOut={() => this.setState({isHovered: false})}
      >
        <View
          style={[styles.thumbnail, isSelected && styles.thumbnailSelected]}
        >
          <FixedRatioView ratio={166.3 / 78.5}>
            <FlexImage
              style={[
                styles.thumbnailImage,
                isHovered && styles.imageHover,
                isSelected && styles.imageSelected,
              ]}
              source={thumbnail}
            />
          </FixedRatioView>
        </View>
        <Text style={styles.label}>{title}</Text>
      </View>
    );
  }
}

export default WidgetThumbnail;

let styles = StyleSheet.create({
  thumbnailContainer: {
    margin: 10,
  },
  thumbnail: {
    borderColor: LIGHT_GREY,
    borderWidth: 1.5,
    borderRadius: 6,
    marginBottom: 4,
  },
  thumbnailImage: {
    flex: 1,
    margin: 5,
    filter: 'grayscale(100%) opacity(29%)',
  },
  imageHover: {
    flex: 1,
    filter: 'grayscale(20%) opacity(29%)',
  },
  thumbnailSelected: {
    borderColor: THEME_COLOR,
  },
  imageSelected: {
    filter: 'opacity(90%)',
  },
  label: {
    color: '#8a8a8a',
    paddingHorizontal: 2,
  },
});
