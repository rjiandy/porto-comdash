// @flow
/* eslint-disable react/no-find-dom-node */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {StyleSheet, Animated} from 'react-primitives';
import autobind from 'class-autobind';
import {withRouter} from 'react-router';
import {
  Link,
  ScrollView,
  View,
  Button,
  Icon,
  Text,
} from '../general/components/coreUIComponents';
import {SearchTextField} from '../general/components/UIComponents';
import WidgetThumbnail from './WidgetThumbnailItem';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {LIGHT_GREY} from '../general/constants/colors';
import {DEFAULT_FONT_FAMILY} from '../general/constants/text';
import {LANDING_PAGE_WIDGET} from '../general/constants/widget';
import scrollTo from '../general/helpers/scrollTo';
import ensureElement from '../general/helpers/ensureElement';

import type {RootState} from '../general/stores/RootState';
import type {Dispatch} from '../general/stores/Action';
import type {WidgetList} from '../features/WidgetList/WidgetList-type';

type KeyboardEvent = Event & {key: string};

type Element = Element & {scrollTo?: (x: number, y: number) => void};

type Props = {
  lanes: Array<WidgetList>;
  onLanesChanges: (newLanes: Array<WidgetList>) => void;
  onAddWidget?: () => void;
  style?: StyleSheetTypes;
  showSelected?: boolean;
  isWidgetLibraryShown: boolean;
  match?: {
    params: {[key: string]: string};
  };
  location: {pathname: string};
  history: {
    replace: (newRoute: string) => void;
  };
  drawerAnimatedValue: Animated.Value;
  isActive: boolean;
  screenWidth: number;
  isBelowBreakpoint: boolean;
  screenHeight: number;
};

type State = {
  searchText: string;
  currentWidgetSearchText: ?string;
};

function getOffsetRelativeTo(element: Element, parent: Element) {
  let offsetTop = 0;
  let currentNode = element;
  while (currentNode != null && currentNode !== parent) {
    offsetTop += Number(currentNode.offsetTop || 0);
    currentNode = currentNode.offsetParent || currentNode;
  }
  return offsetTop;
}

class WidgetThumbnailList extends Component {
  props: Props;
  state: State;
  _widgets: Object;
  _list: ?Object;

  constructor() {
    super(...arguments);
    autobind(this);
    this._widgets = {};
    this.state = {
      searchText: '',
      currentWidgetSearchText: null,
    };
  }
  componentWillMount() {
    this._addRemoveEmptyWidgets(this.props.lanes);
  }

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyPressedHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyPressedHandler);
  }

  _onKeyPressedHandler(event: KeyboardEvent) {
    let {key, target} = event;
    let {lanes, location, history, isWidgetLibraryShown} = this.props;

    if (this._list) {
      let listNode = ReactDOM.findDOMNode(this._list);
      if (
        (key === 'ArrowUp' || key === 'ArrowDown') &&
        listNode &&
        // $FlowFixMe: EventTarget is a generic type, but in this case we know that target will be node
        (target === document.body || listNode.contains(target)) &&
        !isWidgetLibraryShown
      ) {
        event.preventDefault();
        let url = location.pathname.split('/');
        let activeWidgetName = url[url.length - 1];
        let indexes = lanes[0].map((lane) => lane.key);
        let activeIndex = indexes.findIndex(
          (widgetName) => widgetName === activeWidgetName,
        );
        if (key === 'ArrowUp') {
          if (activeIndex > 0) {
            history.replace(`/dashboard/${indexes[activeIndex - 1]}`);
          }
        } else if (key === 'ArrowDown') {
          if (activeIndex < indexes.length - 1) {
            history.replace(`/dashboard/${indexes[activeIndex + 1]}`);
          }
        }
      }
    }
  }

  componentWillReceiveProps(newProps: Props) {
    let {match} = newProps;
    if (match && match.params) {
      let node = ensureElement(
        ReactDOM.findDOMNode(this._widgets[match.params.widget]),
      );
      let listNode = ensureElement(ReactDOM.findDOMNode(this._list));
      node && listNode && this._scrollToActiveWidget(listNode, node);
    }
  }

  _scrollToActiveWidget(listNode: Element, widgetNode: Element) {
    // this is hacky way until we fix the flex in tab bar
    let viewPortHeight = document.body
      ? window.innerHeight - getOffsetRelativeTo(listNode, document.body)
      : window.innerHeight;
    let widgetOffsetTop = getOffsetRelativeTo(widgetNode, listNode);
    let itemTopRelativeViewPortTop = widgetOffsetTop - listNode.scrollTop;
    let itemBottomRelativeViewPortBottom =
      viewPortHeight -
      (widgetOffsetTop - listNode.scrollTop + widgetNode.offsetHeight);

    if (itemTopRelativeViewPortTop < 0) {
      scrollTo(listNode, listNode.scrollTop + itemTopRelativeViewPortTop, 200);
    } else if (itemBottomRelativeViewPortBottom < 0) {
      scrollTo(
        listNode,
        listNode.scrollTop - itemBottomRelativeViewPortBottom,
        200,
      );
    }
  }

  render() {
    let {
      onAddWidget,
      isWidgetLibraryShown,
      drawerAnimatedValue,
      isActive,
      isBelowBreakpoint,
      screenHeight,
    } = this.props;
    let {currentWidgetSearchText} = this.state;

    let right = drawerAnimatedValue.interpolate({
      inputRange: [1, 1.75],
      outputRange: ['5%', '1%'],
    });
    let width = drawerAnimatedValue.interpolate({
      inputRange: [1, 1.75],
      outputRange: ['196%', '99%'],
    });
    let transform = {
      right,
      width,
    };
    return (
      <View
        style={[
          {height: screenHeight - 60},
          isActive ? null : {opacity: 0, marginTop: 200}, // TODO find a better solution
          !isWidgetLibraryShown ? {width: '100%', alignSelf: 'center'} : null,
        ]}
      >
        <Animated.View
          style={[{position: 'absolute', top: 0, bottom: 0}, transform]}
        >
          <View
            style={{
              width: '46%',
              alignSelf: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // paddingLeft: 10,
              // paddingRight: currentWidgetSearchText !== null ? 10 : 0,
            }}
          >
            <SearchTextField
              value={currentWidgetSearchText || ''}
              onTextChange={(text) =>
                this.setState({currentWidgetSearchText: text})}
              icon={
                currentWidgetSearchText !== null
                  ? 'search-arrow-back'
                  : 'search'
              }
              renderTextField={currentWidgetSearchText !== null}
              placeholder={isBelowBreakpoint ? '' : 'Search widget'}
              onIconPress={() =>
                this.setState({
                  currentWidgetSearchText:
                    currentWidgetSearchText === null ? '' : null,
                })}
              containerStyle={[
                {
                  marginHorizontal: 10,
                  marginVertical: 10.5,
                  borderWidth: 0.5,
                  borderColor: LIGHT_GREY,
                  borderRadius: 4,
                  height: 44,
                },
                currentWidgetSearchText !== null
                  ? null
                  : {justifyContent: 'center', paddingRight: 0},
              ]}
            />
            {currentWidgetSearchText !== null ? null : (
              <Button
                secondary
                // label={
                //   screenWidth < 1035
                //     ? null
                //     : isWidgetLibraryShown ? 'Close Library' : 'Add Widget'
                // }
                iconSvg={isWidgetLibraryShown ? 'left-arrow' : 'add-widget'}
                svgContainerStyle={[
                  styles.svgContainerStyle,
                  isBelowBreakpoint ? {marginRight: 0} : null,
                ]}
                onPress={() => onAddWidget && onAddWidget()}
                style={StyleSheet.flatten(styles.addButton)}
                labelStyle={StyleSheet.flatten(styles.addButtonLabel)}
              />
            )}
          </View>
          <View style={styles.container}>
            {this._renderWidgetThumbnail(1)}
            {this._renderListSeparator()}
            {this._renderWidgetThumbnail(0)}
          </View>
        </Animated.View>
      </View>
    );
  }

  _addRemoveEmptyWidgets(lanes: Array<WidgetList>) {
    let placeholderWidget = {
      key: 'empty',
      title: ' ',
      thumbnail: 'default',
      Component: null,
    };
    let newLanes = lanes.map((lane) => {
      if (lane.length < 4 && !lane.find((widget) => widget.key === 'empty')) {
        lane.push(placeholderWidget);
      } else if (
        lane.length > 4 &&
        lane.find((widget) => widget.key === 'empty')
      ) {
        lane.splice(lane.findIndex((widget) => widget.key === 'empty'), 1);
      }
      return lane;
    });
    this.props.onLanesChanges(newLanes);
  }

  _getFilteredLane(laneIndex: number) {
    let {lanes} = this.props;

    let filteredLane = lanes[laneIndex];
    let searchText = this.state.searchText.toLowerCase();
    let currentWidgetSearchText =
      (this.state.currentWidgetSearchText &&
        this.state.currentWidgetSearchText.toLowerCase()) ||
      '';

    filteredLane = filteredLane.filter((widget) => {
      return widget.title
        .toLowerCase()
        .includes(laneIndex === 1 ? searchText : currentWidgetSearchText);
    });
    return filteredLane;
  }

  _renderWidgetThumbnail(laneIndex: number) {
    let {
      style,
      match,
      showSelected = true,
      isWidgetLibraryShown,
      isBelowBreakpoint,
    } = this.props;
    let params = (match && match.params) || {};
    let widgetThumbnail = (i, widget, laneLength?: number) => {
      return (
        <WidgetThumbnail
          widget={widget}
          isSelected={
            showSelected && !isWidgetLibraryShown
              ? widget.key === params.widget
              : false
          }
          id={widget.key}
          laneIndex={laneIndex}
          index={i}
          moveCard={this._moveCard}
          laneLength={laneLength}
        />
      );
    };
    let additionalScrollViewProps = {};
    if (laneIndex === 0) {
      additionalScrollViewProps.setRef = (node) => {
        this._list = node;
      };
    }

    let filteredLane = this._getFilteredLane(laneIndex);

    return (
      <View
        style={[
          styles.scrollView,
          {height: '100%'},
          laneIndex === 1 ? {marginTop: -120} : null,
        ]}
      >
        {laneIndex === 1 ? (
          <View style={styles.headerTextContainer}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.tabBarText}>Widget Library</Text>
            </View>
            <View style={styles.searchTextContainer}>
              <SearchTextField
                value={this.state.searchText}
                onTextChange={(searchText) => this.setState({searchText})}
                icon="search"
                renderTextField
                placeholder={isBelowBreakpoint ? '' : 'Search widget'}
                containerStyle={{
                  borderWidth: 0.5,
                  borderColor: LIGHT_GREY,
                  borderRadius: 4,
                  height: 44,
                  marginBottom: 1,
                }}
              />
            </View>
          </View>
        ) : null}
        <ScrollView
          style={[style, laneIndex === 0 ? {paddingBottom: 120} : null]}
          {...additionalScrollViewProps}
        >
          {filteredLane.map((widget, i) => {
            let key = widget.key;
            return isWidgetLibraryShown ? (
              <View key={key}>
                {widgetThumbnail(i, widget, filteredLane.length)}
              </View>
            ) : (
              <Link
                key={key}
                to={`/dashboard/${key}`}
                ref={(node) => (this._widgets[widget.key] = node)}
              >
                {widgetThumbnail(i, widget)}
              </Link>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  _renderListSeparator() {
    let {isWidgetLibraryShown} = this.props;
    return (
      <View
        style={[
          styles.listSeparator,
          {marginTop: -140, opacity: isWidgetLibraryShown ? 1 : 0},
        ]}
      >
        <View style={styles.verticalLine} />
        <Icon name="drag" style={styles.listSeparatorIcon} />
        <View style={styles.verticalLine} />
      </View>
    );
  }

  _moveCard(
    dragIndex: number,
    hoverIndex: number,
    dragLaneIndex: number,
    hoverLaneIndex: number,
  ) {
    let newLanes = [...this.props.lanes];
    let dragCard = {...this._getFilteredLane(dragLaneIndex)[dragIndex]};

    let filteredDragIndex = newLanes[dragLaneIndex].findIndex(
      (card) => card.key === dragCard.key,
    );
    // drag
    newLanes[dragLaneIndex].splice(filteredDragIndex, 1);

    // if dropped to pinned item
    if (
      this._getFilteredLane(hoverLaneIndex)[hoverIndex].key ===
      LANDING_PAGE_WIDGET
    ) {
      hoverIndex += 1;
    }

    // dropped across lane
    if (dragLaneIndex !== hoverLaneIndex) {
      // if dropped to empty
      if (newLanes[hoverLaneIndex][hoverIndex].key === 'empty') {
        newLanes[hoverLaneIndex].splice(hoverIndex, 0, dragCard);
        // newLanes[hoverLaneIndex] = [dragCard];
      } else {
        // logic to add item in between indexes
        let startToIndex = newLanes[hoverLaneIndex].slice(0, hoverIndex);

        let indexToEnd = newLanes[hoverLaneIndex].slice(
          hoverIndex,
          newLanes[hoverLaneIndex].length,
        );
        startToIndex.push(dragCard); // and drop
        newLanes[hoverLaneIndex] = startToIndex.concat(indexToEnd);
      }
    } else {
      // same lane
      newLanes[dragLaneIndex].splice(hoverIndex, 0, dragCard); // and drop
    }
    this.setState({searchText: '', currentWidgetSearchText: null});
    this._addRemoveEmptyWidgets(newLanes);
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  headerTextContainer: {
    width: '100%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  addButton: {
    margin: 10,
    padding: 3,
    height: 'auto',
    minWidth: 0,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: LIGHT_GREY,
  },
  addButtonLabel: {
    color: 'rgb(65, 65, 65)',
    fontWeight: '500',
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  svgContainerStyle: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    marginRight: 7,
  },
  listSeparator: {
    padding: 5,
    alignItems: 'center',
  },
  verticalLine: {
    borderLeftWidth: 2,
    borderColor: LIGHT_GREY,
    flex: 1,
  },
  listSeparatorIcon: {
    height: 22,
    width: 22,
    marginVertical: 15,
    transform: [{rotate: '180deg'}],
  },
  tabBarText: {
    height: 32,
    textTransform: 'capitalize',
    fontFamily: 'SanFransiscoText',
    color: 'rgb(65, 65, 65)',
    fontSize: 14,
    fontWeight: 500,
  },
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '3px solid rgb(197, 197, 197)',
  },
  searchTextContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function mapStateToProps(state: RootState) {
  return {
    lanes: state.widgetList.lanes,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onLanesChanges: (newLanes: Array<WidgetList>) => {
      dispatch({
        type: 'LANES_CHANGED',
        newLanes,
      });
    },
  };
}

export default withRouter(
  DragDropContext(HTML5Backend)(
    connect(mapStateToProps, mapDispatchToProps)(WidgetThumbnailList),
  ),
);
