// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {StyleSheet, Animated} from 'react-primitives';
import {Transition, TransitionGroup} from 'react-transition-group';
import {Dialog, Checkbox} from 'material-ui';

import HelpLinkItem from './HelpLinkItem';
import HelpLinkDetailCMS from './HelpLinkDetailCMS';
import {
  View,
  Button,
  Text,
  LoadingIndicator,
  ScrollView,
  MaterialIcon,
} from '../../../general/components/coreUIComponents';
import {
  DataLabel,
  Widget,
  MultipleSelectBar,
  SearchTextField,
} from '../../../general/components/UIComponents';
import {
  PALE_GREY,
  MEDIUM_GREY,
  MAIN_BLUE,
  LIGHT_GREY,
} from '../../../general/constants/colors';

import type {ID, HelpLink} from './HelpLink-type';

import type {RootState} from '../../../general/stores/RootState';
import type {Dispatch} from '../../../general/stores/Action';

type Props = {
  helpLinkList: Array<HelpLink>;
  windowWidth: number;
  fetchHelpLinkList: () => void;
  deleteHelpLink: (idList: Array<ID>) => void;
  isLoading: boolean;
  error: ?Error;
};

type State = {
  selectedHelpLink: Set<ID>;
  openedHelpLink: ?HelpLink;
  settingHelpLink: ID;
  animations: Array<Animated.Value>;
  isCMSOpened: boolean;
  isDeleteDialogOpened: boolean;
  tickableHelpLinkList: Array<ID>;
  filterText: string;
};

const ITEMS_PER_ROW = 5;
const ITEMS_PER_ROW_IPAD_LANDSCAPE = 4;
const ITEMS_PER_ROW_IPAD_PORTRAIT = 3;

export class HelpLinkList extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);

    this.state = {
      selectedHelpLink: new Set(),
      settingHelpLink: -1,
      animations: [],
      isCMSOpened: false,
      isDeleteDialogOpened: false,
      openedHelpLink: null,
      tickableHelpLinkList: [],
      filterText: '',
    };
  }
  componentWillMount() {
    this.props.fetchHelpLinkList();
    if (this.props.helpLinkList.length > 0) {
      // TODO: Do Access Logic Here
      this.setState({
        tickableHelpLinkList: this.props.helpLinkList.map(({id}) => id),
      });
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.helpLinkList.length > 0) {
      this._initiateAnimation();
    }
  }

  _isAllTicked() {
    let {selectedHelpLink, tickableHelpLinkList} = this.state;
    if (tickableHelpLinkList.length === 0) {
      return false;
    }
    for (let id of tickableHelpLinkList) {
      if (!selectedHelpLink.has(id)) {
        return false;
      }
    }
    return true;
  }

  _tickAll() {
    let {tickableHelpLinkList, selectedHelpLink} = this.state;
    if (this._isAllTicked()) {
      this.setState({
        selectedHelpLink: new Set(
          [...selectedHelpLink].filter(
            (id) => !tickableHelpLinkList.includes(id),
          ),
        ),
      });
    } else {
      this.setState({
        selectedHelpLink: new Set([
          ...[...selectedHelpLink],
          ...tickableHelpLinkList,
        ]),
      });
    }
  }

  render() {
    let {
      selectedHelpLink,
      settingHelpLink,
      isCMSOpened,
      isDeleteDialogOpened,
      openedHelpLink,
      filterText,
    } = this.state;
    let {helpLinkList, windowWidth, isLoading} = this.props;

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
    if (helpLinkList.length % max) {
      for (let i = 0; i < max - helpLinkList.length % max; i++) {
        buffer.push(<View style={styles.buffer} />);
      }
    }

    let content = (
      <Widget>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            marginBottom: 20,
          }}
        >
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <DataLabel style={{paddingHorizontal: 10}}>
              <Checkbox
                style={{width: 40}}
                checkedIcon={
                  <MaterialIcon name="check-box" style={{color: MAIN_BLUE}} />
                }
                uncheckedIcon={
                  <MaterialIcon
                    name="check-box-outline-blank"
                    style={{color: MEDIUM_GREY}}
                  />
                }
                checked={this._isAllTicked()}
                onCheck={this._tickAll}
              />
              <Text>All</Text>
            </DataLabel>
            <SearchTextField
              value={filterText}
              onTextChange={(filterText) =>
                this.setState({
                  filterText,
                  tickableHelpLinkList: helpLinkList
                    .filter(({name}) =>
                      name.toLowerCase().includes(filterText.toLowerCase()),
                    )
                    .map(({id}) => id),
                })}
              icon="search"
              renderTextField={true}
              placeholder="Search help links"
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
            label="Add Help Link"
            icon="add"
            onPress={() => this.setState({isCMSOpened: true})}
            style={{marginBottom: 10}}
          />
        </View>
        <ScrollView>
          <TransitionGroup>
            <View style={styles.helpLinkListContainer}>
              {helpLinkList
                .filter(({name}) =>
                  name.toLowerCase().includes(filterText.toLowerCase()),
                )
                .map((helpLink, index) => (
                  <Transition key={index}>
                    <Animated.View>
                      <HelpLinkItem
                        helpLink={helpLink}
                        selected={selectedHelpLink.has(helpLink.id)}
                        moreOpened={settingHelpLink === helpLink.id}
                        hideMore={selectedHelpLink.size > 0}
                        onCheck={(evt, isChecked) =>
                          this._onHelpLinkCheck(helpLink.id, isChecked)}
                        onPress={() => this._onHelpLinkPress(helpLink)}
                        onMorePress={() => this._onMorePress(helpLink.id)}
                        onDeletePress={(id: ID) =>
                          this._onDeletePress(new Set([id]))}
                      />
                    </Animated.View>
                  </Transition>
                ))}
              {buffer}
            </View>
          </TransitionGroup>
        </ScrollView>
        <MultipleSelectBar
          selectedItemsQty={selectedHelpLink.size}
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
        />
        <Dialog
          title="Delete Confirmation"
          actions={[
            <Button
              secondary
              key="cancel"
              label="Cancel"
              style={styles.confirmationButton}
              onPress={() => this.setState({isDeleteDialogOpened: false})}
            />,
            <Button
              secondary
              key="delete"
              label="Delete"
              style={styles.confirmationButton}
              onPress={() => this._onDeletePress(selectedHelpLink)}
            />,
          ]}
          modal={false}
          open={isDeleteDialogOpened}
          onRequestClose={() => {
            this.setState({isDeleteDialogOpened: false});
          }}
        >
          <Text>Are you sure want to delete these items?</Text>
        </Dialog>
      </Widget>
    );

    return isCMSOpened ? (
      <HelpLinkDetailCMS
        id={openedHelpLink && openedHelpLink.id}
        initialValue={openedHelpLink}
        onClose={() =>
          this.setState({isCMSOpened: false, openedHelpLink: null})}
      />
    ) : (
      content
    );
  }

  _initiateAnimation(extraSetStates?: {[key: string]: any}) {
    let {helpLinkList} = this.props;
    let animations = helpLinkList.map(() => new Animated.Value(0));
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

  _onDeletePress(helpLinkIDList: Set<ID>) {
    this.props.deleteHelpLink([...helpLinkIDList.values()]);
    this.setState({
      isDeleteDialogOpened: false,
      selectedHelpLink: new Set(),
      settingHelpLink: -1,
    });
  }

  _onMorePress(helpLinkID: ID) {
    let {settingHelpLink} = this.state;
    if (settingHelpLink === helpLinkID) {
      this.setState({settingHelpLink: -1});
    } else {
      this.setState({settingHelpLink: helpLinkID});
    }
  }

  _onHelpLinkPress(helpLink: HelpLink) {
    this.setState({isCMSOpened: true, openedHelpLink: helpLink});
  }

  _onSnackbarDeletePress() {
    this.setState({isDeleteDialogOpened: true});
  }

  _onSnackbarCancelPress() {
    this.setState({
      selectedHelpLink: new Set(),
    });
  }

  _onHelpLinkCheck(helpLinkID: ID, isChecked: boolean) {
    let {selectedHelpLink} = this.state;
    let newSelectedHelpLink = new Set(selectedHelpLink);
    if (isChecked) {
      newSelectedHelpLink.add(helpLinkID);
    } else {
      newSelectedHelpLink.delete(helpLinkID);
    }
    this.setState({
      selectedHelpLink: newSelectedHelpLink,
      settingHelpLink: -1,
    });
  }
}

const styles = StyleSheet.create({
  helpLinkListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buffer: {
    margin: 10,
    minHeight: 150,
    width: 200,
  },
  snackbar: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: PALE_GREY,
    height: 46,
  },
  snackbarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  snackbarButton: {
    height: 26,
    lineHeight: 0,
  },
  confirmationButton: {
    borderColor: 'transparent',
  },
});

export function mapStateToProps(state: RootState) {
  let {cmsState, windowSize} = state;
  let {helpLinkCMS} = cmsState;
  let {helpLinks, isLoading, error} = helpLinkCMS;
  return {
    windowWidth: windowSize.width,
    helpLinkList: [...helpLinks.values()],
    isLoading,
    error,
  };
}

let mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchHelpLinkList: () => {
      dispatch({
        type: 'FETCH_HELP_LINK_LIST_REQUESTED',
      });
    },
    deleteHelpLink: (idList: Array<ID>) => {
      dispatch({
        type: 'DELETE_HELP_LINK_REQUESTED',
        idList,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HelpLinkList);
