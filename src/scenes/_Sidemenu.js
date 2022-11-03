// @flow
import React, {Component} from 'react';
import autobind from 'class-autobind';

import {slide as Menu} from 'react-burger-menu';

import Sidebar from '../routes/components/Sidebar.js';
import SidebarTabs from '../general/components/SidebarTabs';
import type {SideBarCategory} from '../general/components/SidebarTabs';
import {TRANSPARENT} from '../general/constants/colors';

type State = {
  isSidebarOpened: boolean;
  currentSideBar: SideBarCategory;
};

class Sidemenu extends Component {
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isSidebarOpened: false,
      currentSideBar: 'report',
    };
  }

  render() {
    let {currentSideBar, isSidebarOpened} = this.state;
    return (
      <Menu
        right
        width={265}
        styles={sidebarStyles}
        isOpen={isSidebarOpened}
        onStateChange={(state) => {
          if (!state.isOpen) {
            this.setState({isSidebarOpened: false});
          }
        }}
      >
        <SidebarTabs
          isSidebarOpened={isSidebarOpened}
          currentSideBar={currentSideBar}
          toggleSidebar={this._toggleSidebar}
        />
        <Sidebar content={this.state.currentSideBar} />
      </Menu>
    );
  }

  _toggleSidebar(sideBarCategory: 'widget' | 'report') {
    let {currentSideBar, isSidebarOpened} = this.state;
    if (!isSidebarOpened) {
      this.setState({
        isSidebarOpened: true,
        currentSideBar: sideBarCategory,
      });
    } else if (currentSideBar !== sideBarCategory) {
      this.setState({currentSideBar: sideBarCategory});
    } else {
      this.setState({
        isSidebarOpened: false,
      });
    }
  }
}

const sidebarStyles = {
  bmMorphShape: {
    fill: 'white',
  },
  bmOverlay: {
    background: TRANSPARENT,
  },
};

export default Sidemenu;
