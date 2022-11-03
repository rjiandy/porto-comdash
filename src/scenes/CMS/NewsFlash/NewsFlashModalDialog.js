// // @flow
import React, {Component} from 'react';
import autobind from 'class-autobind';
import {StyleSheet} from 'react-primitives';
import SwipeableViews from 'react-swipeable-views';
import Dialog from 'material-ui/Dialog';

import Header from './components/NewsFlashModalDialog/NewsFlashDialogHeader';
import Navigation from './components/NewsFlashModalDialog/NewsFlashNavigation';

import type {NewsFlash} from './NewsFlash-type';

type Props = {
  title?: string;
  data?: Array<NewsFlash>;
  childComponent: NewsFlash => ReactNode;
};

type State = {
  open: boolean;
  currentIndex: number;
  maxIndex: number;
  shownNewsflashID: Set<string>;
};

class NewsFlashModalDialog extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      open: false,
      maxIndex: (this.props.data && this.props.data.length) || 0,
      currentIndex: 0,
      shownNewsflashID: new Set(),
    };
  }

  componentWillMount() {
    this._checkIsOpen(this.props.data);
  }

  componentWillReceiveProps(nextProps: Props) {
    this._checkIsOpen(nextProps.data);
  }

  _checkIsOpen(data?: Array<NewsFlash>) {
    if (data && data.length) {
      let unshowedData = this._getUnshowedData(data);
      this.setState(
        {
          maxIndex: data.length - 1 - this._getShownNewsflashID().size,
          open: unshowedData.length > 1,
        },
        () => this._setShownNewsflashID(data),
      );
    }
  }

  render() {
    let {title, childComponent} = this.props;
    let {currentIndex, maxIndex, open} = this.state;
    let Title = (
      <Header
        title={title}
        currentIndex={currentIndex}
        maxIndex={maxIndex}
        onHandleClose={this._onHandleClose}
      />
    );
    let unshowed = this._getUnshowedData();
    return (
      <Dialog
        title={Title}
        modal={false}
        open={open}
        onRequestClose={this._onHandleClose}
        autoScrollBodyContent={true}
        contentStyle={StyleSheet.flatten(styles.drawerStyle)}
      >
        <SwipeableViews
          index={currentIndex}
          enableMouseEvents
          onChangeIndex={this._handleChangeIndex}
        >
          {unshowed && unshowed.map((datum) => childComponent(datum))}
        </SwipeableViews>
        <Navigation
          onPreviousSelected={this._onPreviousSelected}
          onNextSelected={this._onNextSelected}
          currentIndex={currentIndex}
          maxIndex={maxIndex}
        />
      </Dialog>
    );
  }

  _getShownNewsflashID() {
    let shownNewsflashString = sessionStorage.getItem('shownNewsflashID');
    let shownNewsflash = shownNewsflashString
      ? new Set(shownNewsflashString.split('-'))
      : new Set();
    return shownNewsflash;
  }

  _getUnshowedData(passedData?: Array<NewsFlash>) {
    // let {data} = this.props;
    let data = passedData || this.props.data;
    let unshowed = [];
    if (data && data.length > 0) {
      unshowed = data.filter((datum) => {
        return !this._getShownNewsflashID().has(datum.id.toString());
      });
    }
    // console.log('unshowed length: ', unshowed.length);
    return unshowed;
  }

  _setShownNewsflashID(/*unshowedData?*/ data?: Array<NewsFlash>) {
    // THIS IS THE LOGIC FOR MARKING THE ITEM AS SEEN INDIVIDUALLY
    // let {currentIndex, shownNewsflashID} = this.state;
    // let unshowed = unshowedData || [...this._getUnshowedData()];
    // let newShownNewsflashID = new Set(shownNewsflashID);
    //
    // unshowed &&
    //   unshowed[currentIndex] &&
    //   newShownNewsflashID.add(unshowed[currentIndex].id.toString());

    // THIS IS THE LOGIC FOR MARKING ALL CURRENT UNREAD NEWSFLASH
    let newShownNewsflashID = new Set();
    data && data.map((datum) => newShownNewsflashID.add(datum.id.toString()));

    this.setState({shownNewsflashID: newShownNewsflashID});
    // console.log('state updated: ', newShownNewsflashID);
  }

  _storeShownNewsflashIDToSession() {
    let {shownNewsflashID} = this.state;
    sessionStorage.setItem('shownNewsflashID', [...shownNewsflashID].join('-'));
    // console.log('session updated: ', this._getShownNewsflashID());
  }

  _onPreviousSelected() {
    let {currentIndex} = this.state;
    if (currentIndex !== 0) {
      this.setState(
        {currentIndex: currentIndex - 1},
        // () => this._setShownNewsflashID(),
      );
    }
  }

  _onNextSelected() {
    let {maxIndex, currentIndex} = this.state;
    if (currentIndex !== maxIndex) {
      this.setState(
        {currentIndex: currentIndex + 1},
        // () => this._setShownNewsflashID(),
      );
    }
  }

  _handleChangeIndex(id: number) {
    this.setState({currentIndex: id});
  }

  _onHandleClose() {
    this._storeShownNewsflashIDToSession();
    this.setState({open: false, currentIndex: 0});
  }
}

let styles = StyleSheet.create({
  drawerStyle: {
    width: '80%',
    maxWidth: 'none',
    paddingHorizontal: 100,
    // height: 400,
  },
  paddingTopTen: {
    paddingTop: 10,
  },
});

export default NewsFlashModalDialog;
