// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import commaSeparator from '../../general/helpers/commaSeparator';
import PieChart from '../../general/components/charts/PieChart.js';
import Persist from '../../general/components/Persist.js';

import {Widget, PlaceholderView} from '../../general/components/UIComponents';
import {
  View,
  Text,
  LoadingIndicator,
  Dropdown,
  ErrorComponent,
} from '../../general/components/coreUIComponents';
import {
  THEME_COLOR,
  DARK_GREY,
  MEDIUM_GREY,
  TABLE_COLOR,
} from '../../general/constants/colors';
import {TITLE_FONT_SIZE} from '../../general/constants/text';

import type {EventState} from './types/Event-type';
import type {RootState} from '../../general/stores/RootState.js';
import type {Dispatch} from '../../general/stores/Action.js';

type Props = EventState & {
  selectedTerritory: string;
  selectedBrandFamily: string;
  title: string;
  fetchEventData: () => void;
};

type State = {
  brandOptions: Array<string>;
  territoryOptions: Array<string>;
  selectedBrand: string;
  selectedTerritory: string;
};

export class EventScene extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      brandOptions: [],
      territoryOptions: [],
      selectedBrand: '',
      selectedTerritory: '',
    };
  }

  componentWillMount() {
    let {eventAchievements, fetchEventData} = this.props;
    if (eventAchievements.length === 0) {
      fetchEventData();
    } else {
      this._initiateFilters(this.props);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let {eventAchievements, selectedTerritory, selectedBrandFamily} = nextProps;
    if (eventAchievements.length !== this.props.eventAchievements.length) {
      this._initiateFilters(nextProps);
    } else {
      let newBrand = this.state.selectedBrand;
      let newTerritory = this.state.selectedTerritory;
      if (
        selectedBrandFamily !== this.props.selectedBrandFamily &&
        selectedBrandFamily !== this.state.selectedBrand
      ) {
        newBrand = selectedBrandFamily;
      }
      if (
        selectedTerritory !== this.props.selectedTerritory &&
        selectedTerritory !== this.state.selectedTerritory
      ) {
        newTerritory = selectedTerritory;
      }
      this.setState({
        selectedBrand: newBrand,
        selectedTerritory: newTerritory,
      });
    }
  }

  _initiateFilters(props: Props) {
    let {eventAchievements, selectedBrandFamily, selectedTerritory} = props;
    let brandSet = new Set(eventAchievements.map(({product}) => product));
    let territorySet = new Set(
      eventAchievements.map(({territory}) => territory),
    );
    this.setState({
      brandOptions: [...brandSet],
      territoryOptions: [...territorySet],
      selectedBrand: selectedBrandFamily,
      selectedTerritory,
    });
    // this._onBrandSelected(selectedBrandFamily);
  }

  // _onBrandSelected(selectedBrand: string) {
  //   let {eventAchievements} = this.props;
  //   let {selectedTerritory} = this.state;
  //   let territorySet = new Set(
  //     eventAchievements
  //       .filter(({product}) => !selectedBrand || product === selectedBrand)
  //       .map(({territory}) => territory),
  //   );
  //   let territoryOptions = [...territorySet];
  //   this.setState({
  //     selectedBrand,
  //     territoryOptions,
  //     selectedTerritory: territorySet.has(selectedTerritory)
  //       ? selectedTerritory
  //       : territoryOptions[0],
  //   });
  // }

  render() {
    let {title, isLoading, error, eventAchievements} = this.props;
    let {selectedBrand, selectedTerritory} = this.state;

    let content;
    if (isLoading) {
      content = <LoadingIndicator />;
    } else if (error) {
      content = (
        <ErrorComponent url="/EventAchData" errorMessage={error.message} />
      );
    } else {
      let filteredData = eventAchievements.filter(
        ({product, territory}) =>
          product === selectedBrand && territory === selectedTerritory,
      );

      let mappedData = new Map();
      for (let datum of filteredData) {
        let existingData = mappedData.get(datum.itemType) || [];
        let newData = [...existingData];
        newData.push(datum);
        mappedData.set(datum.itemType, newData);
      }

      let eventDays =
        ((mappedData.get('EVENT_DAYS') || [])[0] || {}).measure || 0;
      let audiences =
        ((mappedData.get('AUDIENCES') || [])[0] || {}).measure || 0;
      let pieData = mappedData.get('PIE_EVENT') || [];
      let tableData = mappedData.get('TABLE_AUDIENCE') || [];

      let dataExistForBrand =
        eventAchievements.filter(({product}) => product === selectedBrand)
          .length > 0;

      content = (
        <View style={styles.flex}>
          <View style={styles.rowFlexed}>
            <View style={[styles.flex, eventDays && styles.blueBorder]}>
              {eventDays ? (
                <Text style={styles.topData}>
                  {commaSeparator(eventDays)} Event Days
                </Text>
              ) : (
                <PlaceholderView
                  style={styles.tenPadding}
                  text={
                    !dataExistForBrand
                      ? `No data available for ${selectedBrand}`
                      : `No data available for ${selectedTerritory}`
                  }
                />
              )}
            </View>
            <View style={styles.rightMargin} />
            <View style={[styles.flex, audiences && styles.blueBorder]}>
              {audiences ? (
                <Text style={styles.topData}>
                  {commaSeparator(audiences)} Audiences
                </Text>
              ) : (
                <PlaceholderView
                  style={styles.tenPadding}
                  text={
                    !dataExistForBrand
                      ? `No data available for ${selectedBrand}`
                      : `No data available for ${selectedTerritory}`
                  }
                />
              )}
            </View>
          </View>
          <View style={[styles.flex, styles.rowFlexed, styles.topMargin]}>
            <View
              style={[
                styles.pieContainer,
                pieData.length > 0 && styles.pieBorder,
              ]}
            >
              {pieData.length > 0 ? (
                <PieChart
                  data={pieData}
                  width={340}
                  xAxis="label"
                  yAxis="measure"
                  extraProps={{
                    legend: {
                      iconSize: 10,
                    },
                  }}
                  showTooltip
                  showLegend
                />
              ) : (
                <PlaceholderView
                  text={
                    !dataExistForBrand
                      ? `No data available for ${selectedBrand}`
                      : `No data available for ${selectedTerritory}`
                  }
                />
              )}
            </View>
            <Table
              wrapperStyle={{display: 'flex', flexDirection: 'column'}}
              bodyStyle={{flexGrow: 1}}
              selectable={false}
            >
              <TableHeader
                fixedHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
              >
                <TableRow style={StyleSheet.flatten(styles.headerRow)}>
                  <TableHeaderColumn
                    style={StyleSheet.flatten(styles.headerCell)}
                  >
                    <Text style={StyleSheet.flatten(styles.headerText)}>
                      Product
                    </Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    style={StyleSheet.flatten(styles.headerCell)}
                  >
                    <Text style={StyleSheet.flatten(styles.headerText)}>
                      Audience
                    </Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    style={StyleSheet.flatten(styles.headerCell)}
                  >
                    <Text style={StyleSheet.flatten(styles.headerText)}>
                      CC
                    </Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    style={StyleSheet.flatten(styles.headerCell)}
                  >
                    <Text style={StyleSheet.flatten(styles.headerText)}>
                      ECC
                    </Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    style={StyleSheet.flatten(styles.headerCell)}
                  >
                    <Text style={StyleSheet.flatten(styles.headerText)}>
                      Engagement Participant
                    </Text>
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {tableData.length === 0 ? (
                  <TableRow>
                    <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
                      <Text customStyle="small">
                        {!dataExistForBrand
                          ? `No data available for ${selectedBrand}`
                          : `No data available for ${selectedTerritory}`}
                      </Text>
                    </TableRowColumn>
                  </TableRow>
                ) : (
                  tableData.map((data, index) => (
                    <TableRow
                      key={index}
                      style={StyleSheet.flatten([
                        styles.bodyRow,
                        {
                          backgroundColor:
                            TABLE_COLOR[index % 2 === 0 ? 'even' : 'odd'],
                        },
                      ])}
                    >
                      <TableRowColumn
                        style={StyleSheet.flatten(styles.bodyCell)}
                      >
                        <Text customStyle="small">{data.label}</Text>
                      </TableRowColumn>
                      <TableRowColumn
                        style={StyleSheet.flatten(styles.bodyCell)}
                      >
                        <View style={styles.numberText}>
                          <Text customStyle="small">
                            {commaSeparator(data.audience || 0)}
                          </Text>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn
                        style={StyleSheet.flatten(styles.bodyCell)}
                      >
                        <View style={styles.numberText}>
                          <Text customStyle="small">
                            {commaSeparator(data.cc || 0)}
                          </Text>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn
                        style={StyleSheet.flatten(styles.bodyCell)}
                      >
                        <View style={styles.numberText}>
                          <Text customStyle="small">
                            {commaSeparator(data.ecc || 0)}
                          </Text>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn
                        style={StyleSheet.flatten(styles.bodyCell)}
                      >
                        <View style={styles.numberText}>
                          <Text customStyle="small">
                            {commaSeparator(data.participant || 0)}
                          </Text>
                        </View>
                      </TableRowColumn>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </View>
        </View>
      );
    }

    return (
      <Widget title={title} filters={this._renderFilters()}>
        <Persist
          name="eventWidget"
          data={{
            state: this.state,
            oldProps: {
              selectedTerritory: this.props.selectedTerritory,
              selectedBrandFamily: this.props.selectedBrandFamily,
            },
          }}
          onMount={({state, oldProps}) => {
            let {selectedBrandFamily, selectedTerritory} = this.props;
            let newBrand = state.selectedBrand;
            let newTerritory = state.selectedTerritory;
            if (
              oldProps.selectedBrandFamily !== selectedBrandFamily &&
              newBrand !== selectedBrandFamily
            ) {
              newBrand = selectedBrandFamily;
            }
            if (
              oldProps.selectedTerritory !== selectedTerritory &&
              newTerritory !== selectedTerritory
            ) {
              newTerritory = selectedTerritory;
            }
            this.setState({
              ...state,
              selectedBrand: newBrand,
              selectedTerritory: newTerritory,
            });
          }}
        />
        {content}
      </Widget>
    );
  }

  _renderFilters() {
    let {
      brandOptions,
      territoryOptions,
      selectedBrand,
      selectedTerritory,
    } = this.state;
    return (
      <View style={styles.filterContainer}>
        <Dropdown
          label="Brand"
          options={brandOptions}
          selectedValue={selectedBrand}
          onSelect={(selectedBrand) => this.setState({selectedBrand})}
          containerStyle={styles.rightMargin}
        />
        <Dropdown
          label="Territory"
          options={territoryOptions}
          selectedValue={selectedTerritory}
          onSelect={(selectedTerritory) => this.setState({selectedTerritory})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  rowFlexed: {
    flexDirection: 'row',
  },
  blueBorder: {
    borderColor: THEME_COLOR,
    borderWidth: 2,
  },
  rightMargin: {
    marginRight: 15,
  },
  topMargin: {
    marginTop: 15,
  },
  tenPadding: {
    padding: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  topData: {
    color: DARK_GREY,
    fontSize: TITLE_FONT_SIZE,
    padding: 10,
    textAlign: 'center',
  },
  headerCell: {
    backgroundColor: THEME_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 0, // NOTE: can't use paddingHorizontal because Material
    paddingRight: 0,
    textAlign: 'center',
    height: 'auto',
    width: 'auto',
  },
  headerRow: {
    height: 45,
    padding: 0,
    width: 'auto',
  },
  headerText: {
    color: 'white',
    wordWrap: 'break-word',
  },
  noData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  bodyRow: {
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    padding: 2,
    height: 30,
    width: 'auto',
  },
  bodyCell: {
    padding: 2,
    height: 'auto',
    width: 'auto',
  },
  numberText: {
    marginHorizontal: 'auto',
    textAlign: 'right',
    width: 50,
  },
  pieContainer: {
    width: 340,
    marginRight: 15,
    justifyContent: 'center',
  },
  pieBorder: {
    borderColor: MEDIUM_GREY,
    borderWidth: 1,
  },
});

function mapStateToProps(state: RootState) {
  return {
    ...state.eventState,
    ...state.globalFilter,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchEventData: () => {
      dispatch({type: 'FETCH_EVENT_ACHIEVEMENT_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventScene);
