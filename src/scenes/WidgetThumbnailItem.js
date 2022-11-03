// @flow
import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';
import autobind from 'class-autobind';
import {
  FixedRatioView,
  FlexImage,
  Text,
  View,
  Icon,
} from '../general/components/coreUIComponents';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import {
  LIGHT_GREY,
  THEME_COLOR,
  SHADOW_GREY,
} from '../general/constants/colors';
import {LANDING_PAGE_WIDGET} from '../general/constants/widget';
import {compose} from 'redux';

import type {WidgetDefinition} from '../routes/widgets';

type State = {
  isHovered: boolean;
};

type Props = {
  widget: WidgetDefinition;
  style?: StyleSheetTypes;
  isSelected?: boolean;
  laneIndex: number;
  index: number;
  isDragging: boolean;
  id: *;
  laneLength?: number;
  connectDragSource: Function;
  connectDropTarget: Function;
  moveCard: () => *;
};

const CARD_ITEM_TYPE = 'card';
const NUMBER_OF_WIDGETS_DISPLAYED = 5;

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      laneIndex: props.laneIndex,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragLaneIndex = monitor.getItem().laneIndex;
    const dragIndex = monitor.getItem().index;
    const hoverLaneIndex = props.laneIndex;
    const hoverIndex = props.index;

    if (monitor.getItem().id === LANDING_PAGE_WIDGET) {
      return;
    }

    // Don't replace items with themselves
    if (dragLaneIndex === hoverLaneIndex && dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    // $FlowFixMe
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line

    if (dragLaneIndex === hoverLaneIndex) {
      if (monitor.getItem().id === 'empty' || props.id === 'empty') {
        return;
      }

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards but it has not passed the middle part of the other item yet
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards but it has not passed the middle part of the other item yet
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
    }
    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex, dragLaneIndex, hoverLaneIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().laneIndex = hoverLaneIndex;
    monitor.getItem().index = hoverIndex;
  },
};

export class WidgetThumbnail extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isHovered: false,
    };
  }

  render() {
    let {
      widget,
      isSelected,
      isDragging,
      connectDragSource,
      connectDropTarget,
      laneLength,
    } = this.props;
    let {key} = widget;
    let {isHovered} = this.state;
    let opacity = isDragging ? 0.3 : 1;

    return connectDragSource(
      connectDropTarget(
        <div style={{opacity}}>
          <View
            onMouseOver={() => this.setState({isHovered: true})}
            onMouseOut={() => this.setState({isHovered: false})}
          >
            {key === 'empty' && laneLength && 5 - laneLength
              ? this._renderPlaceholderWidget(
                  this._renderWidgetThumbnail(
                    isDragging,
                    isSelected || false,
                    isHovered,
                    widget,
                  ),
                  [],
                  NUMBER_OF_WIDGETS_DISPLAYED - laneLength,
                )
              : this._renderWidgetThumbnail(
                  isDragging,
                  isSelected || false,
                  isHovered,
                  widget,
                )}
          </View>
        </div>,
      ),
    );
  }

  _renderWidgetThumbnail(
    isDragging: boolean,
    isSelected: boolean,
    isHovered: boolean,
    widget: {
      title: string;
      thumbnail: string;
      key: string;
    },
  ) {
    let {title, thumbnail, key} = widget;
    return (
      <View style={styles.thumbnailContainer}>
        <View
          style={[
            styles.thumbnail,
            isDragging ? {backgroundColor: LIGHT_GREY} : null,
            isSelected && styles.thumbnailSelected,
            key === 'empty' ? {borderColor: 'transparent'} : null,
          ]}
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {key === 'landingPageTerritory' ? (
            <Icon name="pin" style={{marginRight: 2, height: 12}} />
          ) : null}
          <Text style={styles.label}>{title}</Text>
        </View>
      </View>
    );
  }

  _renderPlaceholderWidget(
    widgetThumbnailComponent,
    placeholder: Array<*>,
    laneLength: number,
  ) {
    while (placeholder.length < laneLength) {
      placeholder.push(
        <View key={placeholder.length}>{widgetThumbnailComponent}</View>,
      );
    }
    return placeholder;
  }
}

const connectDropTarget = ({dropTarget}) => ({
  connectDropTarget: dropTarget(),
});

const connectDragSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

let WidgetThumbnailWithDNDFeature = compose(
  DropTarget(CARD_ITEM_TYPE, cardTarget, connectDropTarget),
  DragSource(CARD_ITEM_TYPE, cardSource, connectDragSource),
)(WidgetThumbnail);

export default WidgetThumbnailWithDNDFeature;

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
    filter: 'grayscale(100%) opacity(60%)',
  },
  imageHover: {
    flex: 1,
    filter: 'grayscale(20%) opacity(60%)',
  },
  thumbnailSelected: {
    borderColor: THEME_COLOR,
  },
  imageSelected: {
    filter: 'opacity(90%)',
  },
  label: {
    color: SHADOW_GREY,
    paddingHorizontal: 2,
  },
});
