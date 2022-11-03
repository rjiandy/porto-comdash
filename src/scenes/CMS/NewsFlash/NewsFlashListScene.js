// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {StyleSheet, Animated} from 'react-primitives';
import {Dialog, Checkbox} from 'material-ui';
import {Transition, TransitionGroup} from 'react-transition-group';

import {MEDIUM_GREY, THEME_COLOR} from '../../../general/constants/colors';

import NewsFlashDetailCMS from './NewsFlashDetailCMS';
import NewsFlashItem from './NewsFlashItem';
import {
  View,
  Button,
  LoadingIndicator,
  ScrollView,
  MaterialIcon,
  Text,
} from '../../../general/components/coreUIComponents';
import {
  DataLabel,
  Widget,
  MultipleSelectBar,
  SearchTextField,
} from '../../../general/components/UIComponents';
import {LIGHT_GREY} from '../../../general/constants/colors';

import type {ID, NewsFlash} from './NewsFlash-type';

import type {RootState} from '../../../general/stores/RootState';
import type {Dispatch} from '../../../general/stores/Action';

type Props = {
  windowWidth: number;
  newsFlashList: Array<NewsFlash>;
  fetchNewsFlashList: () => void;
  deleteNewsFlash: (idList: Array<ID>) => void;
  isLoading: boolean;
  error: ?Error;
};

type State = {
  isDeleteConfirmationDialogOpened: boolean;
  isCMSOpened: boolean;
  selectedNewsFlashList: Set<ID>;
  selectedNewsFlash: ?NewsFlash;
  animations: Array<Animated.Value>;
  tickableNewsFlashList: Array<ID>;
  filterText: string;
};

const ITEMS_PER_ROW = 3;
const ITEMS_PER_ROW_IPAD_LANDSCAPE = 3;
const ITEMS_PER_ROW_IPAD_PORTRAIT = 2;

class NewsFlashListScene extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isDeleteConfirmationDialogOpened: false,
      isCMSOpened: false,
      selectedNewsFlashList: new Set(),
      selectedNewsFlash: null,
      animations: [],
      tickableNewsFlashList: [],
      filterText: '',
    };
  }

  componentWillMount() {
    this.props.fetchNewsFlashList();
    if (this.props.newsFlashList.length > 0) {
      // TODO: Add access Logic here
      this.setState({
        tickableNewsFlashList: this.props.newsFlashList.map(({id}) => id),
      });
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.newsFlashList.length > 0) {
      this._initiateAnimation();
    }
  }

  _isAllTicked() {
    let {tickableNewsFlashList, selectedNewsFlashList} = this.state;
    if (tickableNewsFlashList.length === 0) {
      return false;
    }
    for (let id of tickableNewsFlashList) {
      if (!selectedNewsFlashList.has(id)) {
        return false;
      }
    }
    return true;
  }

  _checkAll() {
    let {tickableNewsFlashList, selectedNewsFlashList} = this.state;
    if (this._isAllTicked()) {
      this.setState({
        selectedNewsFlashList: new Set(
          [...selectedNewsFlashList].filter(
            (id) => !tickableNewsFlashList.includes(id),
          ),
        ),
      });
    } else {
      this.setState({
        selectedNewsFlashList: new Set([
          ...[...selectedNewsFlashList],
          ...tickableNewsFlashList,
        ]),
      });
    }
  }

  render() {
    let {newsFlashList, isLoading, windowWidth} = this.props;
    let {
      selectedNewsFlashList,
      selectedNewsFlash,
      isCMSOpened,
      isDeleteConfirmationDialogOpened,
      filterText,
    } = this.state;

    if (isLoading) {
      return (
        <Widget>
          <LoadingIndicator />
        </Widget>
      );
    }

    let max =
      windowWidth >= 1200
        ? ITEMS_PER_ROW
        : windowWidth >= 900
          ? ITEMS_PER_ROW_IPAD_LANDSCAPE
          : ITEMS_PER_ROW_IPAD_PORTRAIT;
    let buffer = [];
    if (newsFlashList.length % max > 0) {
      for (let i = 0; i < max - newsFlashList.length % max; i++) {
        buffer.push(<View style={styles.buffer} />);
      }
    }
    let newsflashList = (
      <Widget>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <DataLabel style={{paddingHorizontal: 10}}>
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
                checked={this._isAllTicked()}
                onCheck={this._checkAll}
              />
              <Text>All </Text>
            </DataLabel>
            <SearchTextField
              value={filterText}
              onTextChange={(filterText) =>
                this.setState({
                  filterText,
                  tickableNewsFlashList: newsFlashList
                    .filter(({title}) =>
                      title.toLowerCase().includes(filterText.toLowerCase()),
                    )
                    .map(({id}) => id),
                })}
              icon="search"
              renderTextField={true}
              placeholder="Search newsflashes"
              containerStyle={[
                {
                  flex: 0,
                  marginHorizontal: 15,
                  borderWidth: 1,
                  borderColor: LIGHT_GREY,
                  borderRadius: 4,
                  height: 42,
                },
              ]}
            />
          </View>
          <Button
            secondary
            label="Add News Flash"
            icon="add"
            onPress={() => {
              this.setState({isCMSOpened: true});
            }}
            style={{alignSelf: 'flex-end', marginBottom: 10}}
          />
        </View>
        <ScrollView>
          <TransitionGroup>
            <View style={styles.newsFlashListContainer}>
              {newsFlashList
                .filter(({title}) =>
                  title.toLowerCase().includes(filterText.toLowerCase()),
                )
                .map((newsflash, index) => (
                  <Transition key={index}>
                    <Animated.View style={this._createAnimatedStyle(index)}>
                      <NewsFlashItem
                        key={newsflash.id}
                        news={newsflash}
                        toggleMenu={this._onMenuSelected}
                        isChecked={selectedNewsFlashList.has(newsflash.id)}
                        onDetailPress={(news: NewsFlash) =>
                          this.setState({
                            isCMSOpened: true,
                            selectedNewsFlash: newsflash,
                          })}
                        onDeletePress={(id: ID) => {
                          this._onDeletePress(new Set([id]));
                          this.setState({selectedNewsFlash: null});
                        }}
                      />
                    </Animated.View>
                  </Transition>
                ))}
              {buffer}
            </View>
          </TransitionGroup>
        </ScrollView>
        <MultipleSelectBar
          item="newsflash"
          selectedItemsQty={selectedNewsFlashList.size}
          buttons={[
            {
              name: 'Delete',
              onPress: () =>
                this.setState({isDeleteConfirmationDialogOpened: true}),
              type: 'secondary',
            },
            {
              name: 'Cancel',
              onPress: this._onCancelSelected,
              type: 'cancel',
            },
          ]}
        />
        <Dialog
          title="Delete Confirmation"
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
                let {selectedNewsFlashList} = this.state;
                this._onDeletePress(selectedNewsFlashList);
                this.setState({
                  isDeleteConfirmationDialogOpened: false,
                  selectedNewsFlashList: new Set(),
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
          {`Are you sure want delete these items?`}
        </Dialog>
      </Widget>
    );
    return isCMSOpened ? (
      <NewsFlashDetailCMS
        id={selectedNewsFlash && selectedNewsFlash.id}
        news={selectedNewsFlash}
        initialValue={selectedNewsFlash}
        onClose={() =>
          this.setState({isCMSOpened: false, selectedNewsFlash: null})}
      />
    ) : (
      newsflashList
    );
  }

  _initiateAnimation(extraSetStates?: {[key: string]: any}) {
    let {newsFlashList} = this.props;
    let animations = newsFlashList.map(() => new Animated.Value(0));
    this.setState({animations}, () => {
      Animated.stagger(
        150,
        animations.map((anim) => Animated.spring(anim, {toValue: 1})),
      ).start();
    });
  }

  _createAnimatedStyle(index: number) {
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

  _onMenuSelected(id: number) {
    let {selectedNewsFlashList} = this.state;
    let found = selectedNewsFlashList.has(id);
    if (found) {
      selectedNewsFlashList.delete(id);
      this.setState({selectedNewsFlashList});
    } else {
      selectedNewsFlashList.add(id);
      this.setState({selectedNewsFlashList});
    }
  }

  _onCancelSelected() {
    this.setState({selectedNewsFlashList: new Set()});
  }

  _onDeletePress(newsFlashIDList: Set<ID>) {
    this.props.deleteNewsFlash(Array.from(newsFlashIDList.values()));
  }
}

const styles = StyleSheet.create({
  newsFlashListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    paddingTop: 20,
  },
  buffer: {
    width: 320,
    padding: 25,
    margin: 20,
    minHeight: 250,
  },
  confirmationButton: {
    borderColor: 'transparent',
  },
});

let mapStateToProps = (state: RootState) => {
  let {cmsState, windowSize} = state;
  let {newsFlashCMS} = cmsState;
  let {newsFlashes, isLoading, error} = newsFlashCMS;
  return {
    windowWidth: windowSize.width,
    newsFlashList: [...newsFlashes.values()],
    isLoading,
    error,
  };
};

let mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchNewsFlashList: () => {
      dispatch({
        type: 'FETCH_NEWS_FLASH_LIST_REQUESTED',
      });
    },
    deleteNewsFlash: (idList: Array<ID>) => {
      dispatch({
        type: 'DELETE_NEWS_FLASH_REQUESTED',
        idList,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsFlashListScene);
