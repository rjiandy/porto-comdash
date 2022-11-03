// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {Animated} from 'react-primitives';

import ReportItem from './ReportItem';
import Stepper from '../../../general/components/Stepper';
// import reportList from '../../../fixtures/reports';

import {
  View,
  LoadingIndicator,
  ScrollView,
} from '../../../general/components/coreUIComponents';
import {
  PlaceholderView,
  SearchTextField,
} from '../../../general/components/UIComponents';
import {LIGHT_GREY} from '../../../general/constants/colors';

import type {Dispatch} from '../../../general/stores/Action';
import type {RootState} from '../../../general/stores/RootState';
import type {
  ReportFolder,
  ReportFile,
  ReportFolderID,
  ReportFileID,
} from '../../../scenes/CMS/Report/Report-type';

const SEARCH_ANIMATION = 500;

type State = {
  reportIdSteps: Array<number>;
  displayFavorites: boolean;
  searchText: string;
  displaySearch: boolean;
};

type Props = {
  reports: {
    reportFolders: Map<ReportFolderID, ReportFolder>;
    reportFiles: Map<ReportFileID, ReportFile>;
    searchableFiles: Array<ReportFile>;
    activeFolder: ?ReportFolderID;
    isLoading: boolean;
  };
  favorites: Array<ReportFile>;
  fetchMyReports: () => void;
  onActiveFolderChange: (folderID: ReportFolderID) => void;
  onFavorite: () => void;
  onUnfavorite: () => void;
  isBelowBreakpoint: boolean;
};

export class BrowseReport extends Component {
  state: State;
  props: Props;
  _animatedSearchValue: Animated.Value;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      reportIdSteps: [0],
      displayFavorites: false,
      displaySearch: false,
      searchText: '',
    };

    this._animatedSearchValue = new Animated.Value(0);
  }

  componentWillMount() {
    this.props.fetchMyReports();
  }

  render() {
    let {
      reportIdSteps,
      displayFavorites,
      searchText,
      displaySearch,
    } = this.state;
    let {
      reports: {reportFolders, isLoading, searchableFiles},
      isBelowBreakpoint,
    } = this.props;
    if (isLoading) {
      return (
        <View>
          <LoadingIndicator />
        </View>
      );
    }
    let reportSteps = reportIdSteps.map((reportId) => {
      let report = reportFolders.get(reportId);
      if (report && report.name) {
        return report.name;
      }
      return 'Root';
    });

    let otherButtonOpacity = this._animatedSearchValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    let otherButtonWidth = this._animatedSearchValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['70%', '0%'],
    });
    let otherButtonMargin = this._animatedSearchValue.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 0],
    });
    let translateX = this._animatedSearchValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -300],
    });

    let content;
    if (displayFavorites) {
      content = this._renderFavorites();
    } else if (displaySearch) {
      let filtered = searchableFiles
        .filter((file) => {
          return file.name.toLowerCase().includes(searchText.toLowerCase());
        })
        .map((file) => (
          <ReportItem
            key={file.id}
            icon="file"
            text={file.name}
            onPress={() => {
              this._onPressFile(file.linkUrl);
            }}
          />
        ));
      content = (
        <View style={{flex: 1, height: 400}}>
          {filtered.length > 0 ? (
            filtered
          ) : (
            <PlaceholderView text={`No file found with name ${searchText}`} />
          )}
        </View>
      );
    } else {
      content = this._renderCurrentFolderContent();
    }

    return (
      <View>
        <Stepper
          steps={reportSteps}
          onStepPress={displayFavorites ? () => {} : this._goToStep}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'space-around',
          }}
        >
          <Animated.View
            style={{
              opacity: otherButtonOpacity,
              transform: [{translateX}],
              width: otherButtonWidth,
              marginRight: otherButtonMargin,
            }}
          >
            <ReportItem
              icon="favorite"
              text={isBelowBreakpoint ? '' : 'Favorite'}
              onPress={() => this.setState({displayFavorites: true})}
              disabled={displayFavorites}
            />
          </Animated.View>
          <SearchTextField
            containerStyle={{
              borderWidth: 0.5,
              borderColor: LIGHT_GREY,
              borderRadius: 4,
              marginVertical: 9,
            }}
            placeholder="Search file name..."
            onTextChange={(searchText: string) => {
              this.setState({searchText});
            }}
            value={this.state.searchText}
            renderTextField={displaySearch}
            icon={displaySearch ? 'search-arrow-back' : 'search'}
            onIconPress={() => {
              !displayFavorites && this._onSearchPress();
            }}
          />
        </View>
        <ScrollView>{content}</ScrollView>
      </View>
    );
  }

  _onSearchPress() {
    let {displaySearch} = this.state;
    if (displaySearch) {
      this.setState({displaySearch: !displaySearch, searchText: ''}, () => {
        Animated.timing(this._animatedSearchValue, {
          toValue: 0,
          duration: SEARCH_ANIMATION,
        }).start();
      });
    } else {
      Animated.timing(this._animatedSearchValue, {
        toValue: 1,
        duration: SEARCH_ANIMATION,
      }).start(() => {
        this.setState({displaySearch: !displaySearch, searchText: ''});
      });
    }
  }

  _renderFavorites() {
    let {favorites, isBelowBreakpoint} = this.props;
    let favoritesComponent = favorites.map((report) => (
      <ReportItem
        key={report.id}
        icon="file"
        text={report.name}
        onPress={() => this._onPressFile(report.linkUrl)}
        onFavoritePress={this.props.onUnfavorite}
        favorited
      />
    ));

    let back = (
      <ReportItem
        icon="back"
        text={isBelowBreakpoint ? '' : 'back'}
        onPress={this._onPressBack}
      />
    );

    return [back, ...favoritesComponent];
  }

  _renderCurrentFolderContent() {
    // defining current folder
    let {
      reports: {reportFolders, reportFiles, activeFolder},
      isBelowBreakpoint,
    } = this.props;
    let {reportIdSteps, displayFavorites} = this.state;

    // setting up current folder content
    let content = [];
    if (activeFolder == null) {
      let reportFolderComponents = Array.from(
        reportFolders.values(),
      ).map((folder) => {
        return (
          <ReportItem
            key={folder.id}
            icon="folder"
            text={folder.name}
            onPress={() => {
              this._onPressFolder(folder.id);
            }}
          />
        );
      });

      let reportFileComponents = Array.from(reportFiles.values()).map((file) => {
        return (
          <ReportItem
            key={file.id}
            icon="file"
            text={file.name}
            onPress={() => {
              this._onPressFile(file.linkUrl);
            }}
          />
        );
      });
      content = [...reportFolderComponents, ...reportFileComponents];
    } else {
      let currentFolderContent = reportFolders.get(activeFolder);
      if (currentFolderContent) {
        let reportFolderComponents = currentFolderContent.folders.map(
          (folder) => {
            return (
              <ReportItem
                key={folder.id}
                icon="folder"
                text={folder.name}
                onPress={() => {
                  this._onPressFolder(folder.id);
                }}
              />
            );
          },
        );

        let reportFileComponents = currentFolderContent.files.map((file) => {
          return (
            <ReportItem
              key={file.id}
              icon="file"
              text={file.name}
              onPress={() => {
                this._onPressFile(file.linkUrl);
              }}
            />
          );
        });

        let back;
        if (reportIdSteps.length > 1 || displayFavorites) {
          back = (
            <ReportItem
              icon="back"
              text={isBelowBreakpoint ? '' : 'back'}
              onPress={this._onPressBack}
            />
          );
        }
        content = [back, ...reportFolderComponents, ...reportFileComponents];
      }
    }
    return content;
  }

  _goToStep(stepIndex: number) {
    let {reportIdSteps} = this.state;

    if (stepIndex < reportIdSteps.length - 1) {
      let repeat = stepIndex + 1;
      let newSteps = [];
      while (repeat > 0) {
        newSteps.push(reportIdSteps.shift());
        repeat -= 1;
      }
      let folderID = newSteps[newSteps.length - 1];
      if (folderID === 0) {
        this.props.fetchMyReports();
      } else {
        this.props.onActiveFolderChange(folderID);
      }
      this.setState({reportIdSteps: newSteps});
    }
  }

  _onPressBack() {
    let {reportIdSteps, displayFavorites} = this.state;
    if (displayFavorites) {
      this.setState({displayFavorites: false});
    } else {
      let newSteps = [...reportIdSteps];
      newSteps.pop();
      let lastID = newSteps[newSteps.length - 1];
      if (lastID === 0) {
        this.props.fetchMyReports();
      } else {
        this.props.onActiveFolderChange(lastID);
      }
      this.setState({reportIdSteps: newSteps});
    }
  }

  _onPressFolder(folderID: number) {
    let {reportIdSteps} = this.state;
    reportIdSteps.push(folderID);
    this.props.onActiveFolderChange(folderID);
    this.setState({reportIdSteps});
  }

  _onPressFile(reportLink: string) {
    // TODO: do something useful
    window.open(reportLink, '_blank');
  }
}

export function mapStateToProps(state: RootState) {
  // TODO: return actual data
  let {currentUser} = state;
  let reports = {
    reportFolders: new Map(),
    reportFiles: new Map(),
    searchableFiles: [],
    activeFolder: null,
  };
  if (currentUser.user) {
    ({reports} = currentUser.user);
  }
  return {
    reports,
    favorites: [
      {title: 'Report XY, June 2017', url: 'http://www.microsoft.com/'},
      {title: 'Report Blue, July 2017', url: 'http://www.bing.com/'},
    ],
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchMyReports: () => {
      dispatch({
        type: 'FETCH_MY_REPORTS_REQUESTED',
      });
    },
    onActiveFolderChange: (folderID: number) => {
      dispatch({
        type: 'FETCH_MY_REPORTS_FOLDER_BY_ID_REQUESTED',
        folderID,
      });
      dispatch({
        type: 'MY_REPORT_ACTIVE_FOLDER_CHANGED',
        activeFolder: folderID,
      });
    },
    onFavorite: () => {
      // TODO: dispatch favorite report
    },
    onUnfavorite: () => {
      // TODO: dispatch unfavorite report
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BrowseReport);
