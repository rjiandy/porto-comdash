// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {StyleSheet, Image, Touchable} from 'react-primitives';
import {Checkbox, Dialog} from 'material-ui';

import {
  View,
  Text,
  MaterialIcon,
  Button,
} from '../../../general/components/coreUIComponents';

import {
  THEME_COLOR,
  LIGHT_GREY,
  MEDIUM_GREY,
  ALTERNATIVE_GREY,
  GREY,
} from '../../../general/constants/colors';

import formatDateTime from '../../../general/helpers/formatDateTime';

import type {ID, NewsFlash} from './NewsFlash-type';

type Props = {
  news: NewsFlash;
  toggleMenu: (id: ID) => void;
  isChecked: boolean;
  onDetailPress: (news: NewsFlash) => void;
  onDeletePress: (id: ID) => void;
};

type State = {
  isMoreMenuSelected: boolean;
  isDeleteConfirmationDialogOpened: boolean;
};

export default class NewsFlashItem extends Component {
  props: Props;
  state: State;
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isMoreMenuSelected: false,
      isDeleteConfirmationDialogOpened: false,
    };
  }
  render() {
    let {news: {id, title}, isChecked, onDeletePress} = this.props;
    let {isMoreMenuSelected, isDeleteConfirmationDialogOpened} = this.state;
    return (
      <View
        style={[
          styles.newsFlashContainer,
          {borderColor: isChecked ? THEME_COLOR : ALTERNATIVE_GREY},
        ]}
      >
        <Header
          isMoreMenuSelected={isMoreMenuSelected}
          isChecked={isChecked}
          onCheck={this._onHeaderCheck}
          title={title}
          onSelect={this._onSelect}
        />
        {isMoreMenuSelected
          ? this._renderMoreButton()
          : this._renderNewsFlashContent()}
        <Dialog
          title="Confirmation"
          actions={[
            <Button
              key="cancel"
              secondary
              label="Cancel"
              onPress={() =>
                this.setState({isDeleteConfirmationDialogOpened: false})}
              style={styles.confirmationButton}
            />,
            <Button
              key="delete"
              secondary
              label="Delete"
              onPress={() => {
                onDeletePress(id);

                this.setState({
                  isDeleteConfirmationDialogOpened: false,
                  isMoreMenuSelected: false,
                });
              }}
              style={styles.confirmationButton}
            />,
          ]}
          modal={false}
          open={isDeleteConfirmationDialogOpened}
          onRequestClose={() =>
            this.setState({isDeleteConfirmationDialogOpened: false})}
        >
          <Text>{`Are you sure want delete this item?`}</Text>
        </Dialog>
      </View>
    );
  }

  _onHeaderCheck() {
    let {news: {id}, toggleMenu} = this.props;
    toggleMenu(id);
  }

  _onSelect() {
    this.setState({isMoreMenuSelected: !this.state.isMoreMenuSelected});
  }

  _renderNewsFlashContent() {
    let {news, onDetailPress} = this.props;
    let {imageUrl, creator, createdDate, lastEdited} = news;
    return (
      <Touchable onPress={() => onDetailPress(news)}>
        <View>
          <View style={styles.imageContainer}>
            <Image style={{width: 270, height: 130}} source={{uri: imageUrl}} />
          </View>
          <View style={{paddingTop: 10}}>
            <Text customStyle="small" style={{color: GREY}}>
              created by {creator && creator.name}
            </Text>
            <Text customStyle="small" style={{color: GREY}}>
              created on {formatDateTime(createdDate, 'DATE_TIME')}
            </Text>
            <Text customStyle="small" style={{color: GREY}}>
              last edited on {formatDateTime(lastEdited, 'DATE_TIME')}
            </Text>
          </View>
        </View>
      </Touchable>
    );
  }

  _renderMoreButton() {
    return (
      <View
        style={{
          padding: 20,
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Button
          primary
          label="View Link"
          style={{width: 180, lineHeight: 0, marginBottom: 20}}
        />
        <Button
          secondary
          label="Delete"
          style={{
            width: 180,
            lineHeight: 0,
          }}
          onPress={() =>
            this.setState({isDeleteConfirmationDialogOpened: true})}
        />
      </View>
    );
  }
}

type HeaderProps = {
  isMoreMenuSelected: boolean;
  isChecked: boolean;
  title: string;
  onCheck: () => void;
  onSelect: () => void;
};

function Header(props: HeaderProps) {
  let {isMoreMenuSelected, isChecked, onCheck, title, onSelect} = props;
  let headerContent = isMoreMenuSelected ? (
    <View style={styles.headerBefore} />
  ) : (
    <View style={styles.headerBefore}>
      <Checkbox
        style={{width: 40}}
        checkedIcon={
          <MaterialIcon name="check-box" style={{color: THEME_COLOR}} />
        }
        uncheckedIcon={
          <MaterialIcon
            name="check-box-outline-blank"
            style={{color: MEDIUM_GREY}}
          />
        }
        checked={isChecked}
        onCheck={onCheck}
      />
      <Text customStyle="title" style={styles.title}>
        {title}
      </Text>
    </View>
  );
  let headerMenu = isChecked ? (
    <View style={[styles.headerMenu, {height: 48}]} />
  ) : (
    <View style={[styles.headerMenu, {marginRight: -15}]}>
      <MaterialIcon
        name={isMoreMenuSelected ? 'clear' : 'more-horiz'}
        style={{color: MEDIUM_GREY}}
        onPress={onSelect}
      />
    </View>
  );
  return (
    <View style={styles.header}>
      {headerContent}
      {headerMenu}
    </View>
  );
}

const styles = StyleSheet.create({
  newsFlashContainer: {
    width: 320,
    borderColor: ALTERNATIVE_GREY,
    borderRadius: 5,
    borderWidth: 1.5,
    padding: 25,
    paddingTop: 15,
    marginRight: 40,
    marginBottom: 30,
    minHeight: 250,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBefore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  headerMenu: {
    cursor: 'pointer',
    alignItems: 'flex-end',
    flex: 1,
  },
  title: {
    flex: 1,
    maxHeight: 38,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: LIGHT_GREY,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationButton: {
    borderColor: 'transparent',
  },
});
