// @flow

import React from 'react';
import {Tabs as TabsComponent, Tab as TabComponent} from 'material-ui';
import {THEME_COLOR} from '../../constants/colors';
import {DEFAULT_FONT_FAMILY} from '../../constants/text';

const ACTIVE_TAB_COLOR = '#414141';
const INACTIVE_TAB_COLOR = '#C5C5C5';
const DEFAULT_TAB_BAR_HEIGHT = 48;

type Style = {[key: string]: string | number};

type TabsProps = {
  initialSelectedIndex: number;
  tabHeight?: number;
  style?: Style;
  tabTemplateStyle?: Style;
  inkBarStyle?: Style;
  tabItemContainerStyle?: Style;
  contentContainerStyle?: Style;
  rootContainerStyle?: Style;
};

export function Tabs(props: TabsProps) {
  let {
    initialSelectedIndex,
    tabHeight,
    tabTemplateStyle,
    inkBarStyle,
    tabItemContainerStyle,
    contentContainerStyle,
    style,
    ...otherProps
  } = props;
  return (
    <TabsComponent
      initialSelectedIndex={initialSelectedIndex}
      tabTemplateStyle={{...styles.tabContainer, ...tabTemplateStyle}}
      inkBarStyle={{
        ...styles.selectedBar,
        ...inkBarStyle,
        top: (tabHeight || DEFAULT_TAB_BAR_HEIGHT) + 3,
      }}
      tabItemContainerStyle={{
        ...styles.tabItemContainer,
        height: tabHeight || DEFAULT_TAB_BAR_HEIGHT,
        ...tabItemContainerStyle,
      }}
      contentContainerStyle={{
        ...styles.tabContentContainer,
        ...contentContainerStyle,
      }}
      style={{...styles.tabContainer, ...style}}
      {...otherProps}
    />
  );
}

type TabProps = {
  label: ?string;
  icon: ?ReactNode;
  isActive: boolean;
  buttonStyle?: Style;
  activeTextColor?: string;
  inactiveTextColor?: string;
  onActive?: () => void;
};

export function Tab(props: TabProps) {
  let {
    label,
    icon,
    isActive,
    buttonStyle,
    activeTextColor,
    inactiveTextColor,
    onActive,
    ...otherProps
  } = props;
  return (
    <TabComponent
      label={label}
      icon={icon}
      buttonStyle={{
        ...styles.tab,
        color: isActive
          ? activeTextColor || ACTIVE_TAB_COLOR
          : inactiveTextColor || INACTIVE_TAB_COLOR,
        ...buttonStyle,
      }}
      onActive={() => onActive && onActive()}
      {...otherProps}
    />
  );
}

const styles = {
  tabContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 10,
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
  },
  selectedBar: {
    backgroundColor: THEME_COLOR,
    height: 3,
    marginTop: -3,
  },
  tabItemContainer: {
    backgroundColor: 'white',
    display: 'block',
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
    borderBottomColor: INACTIVE_TAB_COLOR,
    alignItems: 'flex-end',
  },
  tab: {
    textTransform: 'capitalize',
    fontFamily: DEFAULT_FONT_FAMILY,
  },
};
