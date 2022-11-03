// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Animated} from 'react-primitives';
import autobind from 'class-autobind';
import {View, Tabs, Tab, Icon} from '../general/components/coreUIComponents';
import WidgetThumbnailList from './WidgetThumbnailList';
import BrowseReports from '../routes/components/BrowseReport/BrowseReport';
import {SCREEN_BREAK_POINT} from '../general/constants/size';

import type {RootState} from '../general/stores/RootState';
import type {Viewport} from '../features/WindowListener/Viewport';

type Props = {
  drawerAnimatedValue: Animated.Value;
  onDrawerClose: () => void;
  onAddWidget: () => void;
  onCloseLibrary: () => void;
  windowSize: Viewport;
};

type State = {
  selectedTab: number;
  drawerWidth: string;
  isWidgetLibraryShown: boolean;
};

const DRAWER_WIDTH = '18%';
const DRAWER_ADD_WIDGET_WIDTH = '35%';
const DEFAULT_SELECTED_INDEX = 1;
export const ACTIVE_TAB_COLOR = '#414141';
const INACTIVE_TAB_COLOR = '#C5C5C5';

class Drawer extends Component {
  props: Props;
  state: State;
  _isBelowBreakpoint: boolean = false;
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedTab: DEFAULT_SELECTED_INDEX,
      drawerWidth: DRAWER_WIDTH,
      isWidgetLibraryShown: false,
    };
  }

  render() {
    let {
      onDrawerClose,
      onAddWidget,
      drawerAnimatedValue,
      windowSize,
      ...otherProps
    } = this.props;
    let {selectedTab, isWidgetLibraryShown} = this.state;
    let screenWidth = windowSize.width;
    let screenHeight = windowSize.height;
    this._isBelowBreakpoint = screenWidth < SCREEN_BREAK_POINT;

    let tabsComponentList = [
      {
        title: 'Reports',
        Component: BrowseReports,
        props: {
          isBelowBreakpoint: this._isBelowBreakpoint,
        },
      },
      {
        title: 'Widgets',
        Component: WidgetThumbnailList,
        props: {
          onAddWidget: this._toggleWidgetLibrary,
          isWidgetLibraryShown,
          drawerAnimatedValue,
          isActive: selectedTab === 1,
          screenWidth,
          screenHeight,
          isBelowBreakpoint: this._isBelowBreakpoint,
        },
      },
    ];

    let width = drawerAnimatedValue.interpolate({
      inputRange: [0, 1, 1.75],
      outputRange: ['0%', DRAWER_WIDTH, DRAWER_ADD_WIDGET_WIDTH],
    });

    let transform = {
      opacity: drawerAnimatedValue,
      width,
    };

    return (
      <Animated.View
        style={[
          styles.container,
          isWidgetLibraryShown ? {paddingTop: 10} : null,
          transform,
        ]}
      >
        <View style={{flex: 1, paddingHorizontal: 10}}>
          {isWidgetLibraryShown ? null : (
            <View style={{alignItems: 'flex-end'}}>
              <Icon
                name="close"
                onPress={onDrawerClose}
                style={{height: 10, width: 10}}
                containerStyle={{
                  marginTop: 10,
                  width: 'auto',
                  height: 'auto',
                  padding: 0,
                  marginBottom: -15,
                }}
              />
            </View>
          )}
          <View>
            <Tabs
              initialSelectedIndex={DEFAULT_SELECTED_INDEX}
              tabItemContainerStyle={{
                alignSelf: 'flex-end',
                width: isWidgetLibraryShown ? '48%' : '100%',
                zIndex: 0,
              }}
              style={{
                alignItems: 'flex-end',
              }}
              contentContainerStyle={{
                alignSelf: 'stretch',
              }}
              inkBarStyle={{
                marginTop: -54,
              }}
            >
              {tabsComponentList.map((tab, index) => {
                let {title, Component, props} = tab;
                let reportIcon = <Icon name="file" color="shadeBlue" />;
                let widgetIcon = <Icon name="widget" />;
                let icon = title === 'Widgets' ? widgetIcon : reportIcon;
                return (
                  <Tab
                    key={index}
                    label={this._isBelowBreakpoint ? null : title}
                    icon={this._isBelowBreakpoint ? icon : null}
                    isActive={selectedTab === index}
                    activeTextColor={ACTIVE_TAB_COLOR}
                    inactiveTextColor={INACTIVE_TAB_COLOR}
                    onActive={() => {
                      this.setState({selectedTab: index});
                      if (
                        tabsComponentList[index].title !== 'Widgets' &&
                        isWidgetLibraryShown
                      ) {
                        this._toggleWidgetLibrary();
                      }
                    }}
                    isBelowBreakpoint={this._isBelowBreakpoint}
                  >
                    <Component {...props} {...otherProps} />
                  </Tab>
                );
              })}
            </Tabs>
          </View>
        </View>
      </Animated.View>
    );
  }

  _toggleWidgetLibrary() {
    let {onAddWidget, onCloseLibrary} = this.props;
    let {isWidgetLibraryShown} = this.state;
    isWidgetLibraryShown ? onCloseLibrary() : onAddWidget();
    this.setState({
      // drawerWidth: (drawerWidth === '35%' && '20%') || '35%',
      isWidgetLibraryShown: !isWidgetLibraryShown,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    width: '20%',
    backgroundColor: '#fff',
  },
});

function mapStateToProps(state: RootState) {
  let {windowSize} = state;
  return {
    windowSize,
  };
}

export default connect(mapStateToProps)(Drawer);
