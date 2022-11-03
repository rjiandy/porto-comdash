// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {connect} from 'react-redux';
import {StyleSheet, Animated} from 'react-primitives';
import {Transition, TransitionGroup} from 'react-transition-group';

import WidgetItem from './WidgetItem';
import WidgetDetailCMS from './WidgetDetailCMS';

import {
  View,
  ScrollView,
  LoadingIndicator,
} from '../../../general/components/coreUIComponents';
import {
  Widget,
  SearchTextField,
} from '../../../general/components/UIComponents';
import {LIGHT_GREY} from '../../../general/constants/colors';

import type {ID, Widget as WidgetType} from './Widget-type';
import type {RootState} from '../../../general/stores/RootState';

type Props = {
  widgetList: Array<WidgetType>;
  windowWidth: number;
  fetchWidgetList: () => void;
  isLoading: boolean;
  error: ?Error;
};

type State = {
  selectedWidget: ?WidgetType;
  animations: Array<Animated.Value>;
  isCMSOpened: boolean;
  filterText: string;
};

const WIDGETS_PER_ROW = 4;
const WIDGETS_PER_ROW_IPAD_LANDSCAPE = 3;
const WIDGETS_PER_ROW_IPAD_PORTRAIT = 2;

export class WidgetListScene extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);

    this.state = {
      selectedWidget: null,
      animations: [],
      isCMSOpened: false,
      filterText: '',
    };
  }
  componentWillMount() {
    this.props.fetchWidgetList();
  }
  componentWillReceiveProps(newProps: Props) {
    if (newProps.widgetList.length > 0) {
      this._initiateAnimation();
    }
  }

  render() {
    let {selectedWidget, filterText, isCMSOpened} = this.state;
    let {widgetList, windowWidth, isLoading} = this.props;
    if (isLoading) {
      return (
        <Widget>
          <LoadingIndicator />
        </Widget>
      );
    }
    let max =
      windowWidth >= 1200
        ? WIDGETS_PER_ROW
        : windowWidth >= 900
          ? WIDGETS_PER_ROW_IPAD_LANDSCAPE
          : WIDGETS_PER_ROW_IPAD_PORTRAIT;
    let buffer = [];
    if (widgetList.length % max > 0) {
      for (let i = 0; i < max - widgetList.length % max; i++) {
        buffer.push(<View style={styles.buffer} />);
      }
    }

    let content = (
      <Widget>
        <SearchTextField
          value={filterText}
          onTextChange={(filterText) => this.setState({filterText})}
          icon="search"
          renderTextField={true}
          placeholder="Search widgets"
          containerStyle={[
            styles.horizontalMargin,
            {
              flex: 0,
              borderWidth: 1,
              borderColor: LIGHT_GREY,
              borderRadius: 4,
              height: 42,
              alignSelf: 'flex-start',
            },
          ]}
        />
        <ScrollView>
          <TransitionGroup>
            <View style={styles.widgetListContainer}>
              {widgetList
                .filter(({title}) =>
                  title.toLowerCase().includes(filterText.toLowerCase()),
                )
                .map((widget, index) => (
                  <Transition key={index}>
                    <Animated.View style={this._createAnimatedStyle(index)}>
                      <WidgetItem
                        widget={widget}
                        onPress={() => this._onWidgetPress(widget)}
                      />
                    </Animated.View>
                  </Transition>
                ))}
              {buffer}
            </View>
          </TransitionGroup>
          {/* // commented for now. We can add this later if we decide to add multiple assign user group function
          <MultipleSelectBar
          selectedItemsQty={selectedWidget.size}
          item="report"
          buttons={[
            {
              name: 'Delete',
              onPress: this._onSnackbarDeletePress,
              type: 'secondary',
            },
            {
              name: 'Cancel',
              onPress: this._onSnackbarCancelPress,
              type: 'cancel',
            },
          ]}
        /> */}
        </ScrollView>
      </Widget>
    );

    return isCMSOpened ? (
      <WidgetDetailCMS
        id={selectedWidget && selectedWidget.id}
        initialValue={selectedWidget}
        onClose={() => {
          this.setState({isCMSOpened: false, selectedWidget: null}, () => {
            this._initiateAnimation();
          });
        }}
      />
    ) : (
      content
    );
  }

  _initiateAnimation(extraSetStates?: {[key: string]: any}) {
    let {widgetList} = this.props;
    let animations = widgetList.map(() => new Animated.Value(0));
    this.setState({animations}, () => {
      Animated.stagger(
        150,
        animations.map((anim) => Animated.spring(anim, {toValue: 1})),
      ).start();
    });
  }

  _createAnimatedStyle(index: ID) {
    let {animations} = this.state;
    if (animations[index]) {
      return {
        opacity: animations[index],
        transform: Animated.template`
            translate3d(0, ${animations[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['12px', '0px'],
            })},0)`,
      };
    }
  }

  _onWidgetPress(widget: WidgetType) {
    this.setState({isCMSOpened: true, selectedWidget: widget});
  }
}

const styles = StyleSheet.create({
  widgetListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 10,
  },
  horizontalMargin: {
    marginHorizontal: 10,
  },
  buffer: {
    margin: 10,
    height: 200,
    width: 250,
  },
});

let mapStateToProps = (state: RootState) => {
  let {cmsState, windowSize} = state;
  let {widgetCMS} = cmsState;
  let {widgets, isLoading, error} = widgetCMS;
  return {
    windowWidth: windowSize.width,
    widgetList: [...widgets.values()],
    isLoading,
    error,
  };
};

let mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchWidgetList: () => {
      dispatch({
        type: 'FETCH_WIDGET_LIST_REQUESTED',
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetListScene);
