// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';

import {
  View,
  ScrollView,
  Icon,
  Badge,
  Text,
} from '../../../general/components/coreUIComponents';
import formatDateTime from '../../../general/helpers/formatDateTime';
import {StyleSheet, Touchable, Image} from 'react-primitives';
import {
  colorStyles,
  LIGHT_GREY,
  THEME_COLOR,
  PALE_BLUE,
  TRANSPARENT,
} from '../../../general/constants/colors';
import triangle from '../../../assets/images/dropdown-triangle.png';
import getTimeInterval from '../../../general/helpers/getTimeInterval';

import type {RootState} from '../../../general/stores/RootState';
import type {NewsFlash} from '../../../scenes/CMS/NewsFlash/NewsFlash-type';

type Props = {
  notificationList: Array<NewsFlash>;
  updateNotification: (id: number) => void;
};

type State = {
  isDropdownOpened: boolean;
};

class NotificationButton extends Component {
  props: Props;
  state: State;
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isDropdownOpened: false,
    };
  }

  render() {
    let unreadNotificationNumber = this._getUnreadNotificationNumber();
    return (
      <View style={{marginRight: 30}}>
        <Touchable onPress={() => this.setState({isDropdownOpened: true})}>
          <View>
            {unreadNotificationNumber > 0 ? (
              <Badge badgeContent={unreadNotificationNumber} />
            ) : null}
            <Icon name="notification" color="blue" style={styles.button} />
          </View>
        </Touchable>
        {this._renderDropdown()}
        {this._renderOverlay()}
      </View>
    );
  }

  _getUnreadNotificationNumber() {
    let {notificationList} = this.props;
    let unreadNotification = 0;
    notificationList.forEach((notification) => {
      if (!notification.hasRead) {
        unreadNotification += 1;
      }
    });
    return unreadNotification;
  }

  _renderDropdown() {
    let {notificationList} = this.props;
    let {isDropdownOpened} = this.state;
    return isDropdownOpened ? (
      <View style={styles.notificationContent}>
        <View
          style={[styles.notificationContentBackground, colorStyles.thinShadow]}
        >
          <Image source={triangle} style={styles.triangle} />
          <ScrollView style={styles.scrollView}>
            {notificationList.length
              ? this._renderNotification()
              : this._renderEmptyNotification()}
          </ScrollView>
        </View>
        <Touchable onPress={() => this.setState({isDropdownOpened: false})}>
          <View style={{flex: 1, cursor: 'default'}} />
        </Touchable>
      </View>
    ) : null;
  }

  _renderEmptyNotification() {
    return (
      <View style={styles.emptyNotificationContainer}>
        <View style={styles.emptyNotificationLogo}>
          <Icon name="notification" color="grey" style={styles.button} />
        </View>
        <Text style={styles.emptyNotificationText}>
          {"You don't have any notification right now"}
        </Text>
      </View>
    );
  }

  _renderNotification() {
    let {notificationList} = this.props;
    return Array.from(notificationList.values())
      .sort((a, b) => {
        return new Date(b.startingTime) - new Date(a.startingTime);
      })
      .map((notification, index) => {
        let dateTime = new Date(notification.startingTime);
        let timeInterval = getTimeInterval(new Date(notification.startingTime));
        return (
          <Touchable
            key={index}
            onPress={() => {
              this._onNotificationPress(notification.fileUrl, notification.id);
            }}
          >
            <View
              style={[
                styles.dropdownItem,
                styles.bottomBorder,
                notification.hasRead ? null : {backgroundColor: PALE_BLUE},
              ]}
            >
              <Icon
                name="newsflash"
                color={notification.hasRead ? 'grey' : 'blue'}
                style={[styles.button, {height: 30, marginRight: 15}]}
              />
              <View style={styles.notificationTextContainer}>
                <Text
                  style={notification.hasRead ? null : {color: THEME_COLOR}}
                >
                  {notification.title}
                </Text>
                <Text customStyle="small">
                  {this._displayTimeInterval({
                    ...timeInterval,
                    dateTime,
                  })}
                </Text>
              </View>
            </View>
          </Touchable>
        );
      });
  }

  _displayTimeInterval(props: Object) {
    let {timeUnit, interval, dateTime} = props;
    if (timeUnit === 'day' && interval > 3) {
      return `on ${formatDateTime(dateTime, 'DATE')}`;
    } else if (interval === 0) {
      return `just now`;
    } else {
      let baseTimeView = `${interval} ${timeUnit}`;
      if (interval === 1) {
        return baseTimeView + ' ago';
      }
      return baseTimeView + 's  ago';
    }
  }

  _renderOverlay() {
    let {isDropdownOpened} = this.state;
    return isDropdownOpened ? (
      <Touchable onPress={() => this.setState({isDropdownOpened: false})}>
        <View style={styles.overlay} />
      </Touchable>
    ) : null;
  }

  _onNotificationPress(link: string, id: number) {
    window.open(link, '_blank');
    this.props.updateNotification(id);
  }
}

const styles = StyleSheet.create({
  button: {
    height: 25,
    minWidth: 25,
  },
  overlay: {
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 4,
    cursor: 'default',
  },
  notificationContent: {
    width: 300,
    position: 'absolute',
    top: 57,
    backgroundColor: TRANSPARENT,
    right: -75,
    borderRadius: 4,
    zIndex: 5,
  },
  notificationContentBackground: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EBECF0',
  },
  triangle: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -18,
    right: 75,
    zIndex: 6,
  },
  dropdownItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  notificationTextContainer: {
    flex: 1,
  },
  bottomBorder: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY,
  },
  scrollView: {
    maxHeight: 420,
  },
  emptyNotificationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  emptyNotificationLogo: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '20deg'}],
    marginBottom: 20,
  },
  emptyNotificationText: {
    color: THEME_COLOR,
  },
});

function mapStateToProps(state: RootState) {
  let {user} = state.currentUser;
  let newsFlashesList = (user && user.newsFlashes) || [];
  return {
    notificationList: newsFlashesList,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateNotification(id: string) {
      dispatch({type: 'UPDATE_MY_UNREAD_NEWS_FLASHES_REQUESTED', id});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationButton);
