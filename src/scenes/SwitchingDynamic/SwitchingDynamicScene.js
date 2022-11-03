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

import {
  View,
  Text,
  Dropdown,
  LoadingIndicator,
  ErrorComponent,
} from '../../general/components/coreUIComponents';
import {Widget, PlaceholderView} from '../../general/components/UIComponents';
import Persist from '../../general/components/Persist';
import {TABLE_COLOR, THEME_COLOR, WHITE} from '../../general/constants/colors';
import roundDecimal from '../../general/helpers/roundDecimal';

import SwitchingDynamicStackedBarChart from './charts/SwitchingDynamicStackedBarChart';

import type {
  SwitchingDynamics,
  SwitchingDynamicState,
} from './types/SwitchingDynamic-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type State = {
  territoryList: Array<string>;
  selectedTerritory: string;
  selectedProduct: string;
  selectedProfile: string;
  productList: Array<string>;
  profileList: Array<string>;
  data: SwitchingDynamics;
  maxSwitchValue: number;
  minSwitchValue: number;
};
type Props = SwitchingDynamicState & {
  title: string;
  selectedTerritory: string;
  fetchSwitchingDynamic: () => void;
};

export class SwitchingDynamicScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    this.state = {
      territoryList: [],
      selectedTerritory: this.props.selectedTerritory,
      selectedProduct: '',
      selectedProfile: '',
      productList: [],
      profileList: [],
      data: [],
      maxSwitchValue: 0,
      minSwitchValue: 0,
    };
    autobind(this);
  }

  componentWillMount() {
    let {switchingDynamic, fetchSwitchingDynamic} = this.props;
    let {selectedTerritory} = this.state;
    if (switchingDynamic.length === 0) {
      fetchSwitchingDynamic();
    } else {
      let filtered = switchingDynamic.filter(
        (data) => data.territory === selectedTerritory,
      );
      this.setState({
        selectedTerritory,
        territoryList: this._getTerritoryList(switchingDynamic),
        productList: [...new Set(filtered.map((data) => data.product))],
        profileList: [...new Set(filtered.map((data) => data.smokerProfile))],
        selectedProduct: '',
        selectedProfile: '',
        data: [],
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let oldProps = this.props;
    let {switchingDynamic, selectedTerritory} = nextProps;
    if (
      switchingDynamic.length !== oldProps.switchingDynamic.length ||
      selectedTerritory !== oldProps.selectedTerritory
    ) {
      let filtered = switchingDynamic.filter(
        (data) => data.territory === selectedTerritory,
      );
      let newProductList = [...new Set(filtered.map((data) => data.product))];
      let newProfilelist = [
        ...new Set(filtered.map((data) => data.smokerProfile)),
      ];
      let {selectedProduct, selectedProfile} = this.state;
      if (!newProductList.includes(selectedProduct)) {
        selectedProduct = '';
      }
      if (!newProfilelist.includes(selectedProfile)) {
        selectedProfile = '';
      }
      this.setState({
        selectedTerritory,
        territoryList: this._getTerritoryList(switchingDynamic),
        productList: newProductList,
        profileList: newProfilelist,
        selectedProduct,
        selectedProfile,
        ...this._updateData(
          selectedProduct,
          selectedTerritory,
          selectedProfile,
        ),
      });
    }
  }

  _getTerritoryList(switchingDynamics: SwitchingDynamics) {
    return [...new Set(switchingDynamics.map((data) => data.territory))];
  }

  _onProductSelected(selectedProduct: string) {
    let {selectedTerritory} = this.state;
    this.setState({
      selectedProduct,
      ...this._updateProfileList(selectedProduct, selectedTerritory),
    });
  }

  _onTerritorySelected(selectedTerritory: string) {
    let {switchingDynamic} = this.props;
    let {selectedProduct, selectedProfile} = this.state;
    let filtered = switchingDynamic.filter(
      (data) => data.territory === selectedTerritory,
    );
    this.setState({
      selectedTerritory,
      productList: [...new Set(filtered.map((data) => data.product))],
      profileList: [...new Set(filtered.map((data) => data.smokerProfile))],
      ...this._updateData(selectedProduct, selectedTerritory, selectedProfile),
    });
  }

  _onProfileSelected(selectedProfile: string) {
    let {selectedProduct, selectedTerritory} = this.state;
    this.setState({
      selectedProfile,
      ...this._updateData(selectedProduct, selectedTerritory, selectedProfile),
    });
  }

  _updateProfileList(product: string, territory: string) {
    let data = this.props.switchingDynamic.filter(
      (datum) =>
        (!product || datum.product === product) &&
        datum.territory === territory,
    );
    let profileList = [...new Set(data.map((datum) => datum.smokerProfile))];
    return {
      profileList,
      selectedProfile: !product ? '' : profileList[0],
      ...this._updateData(product, territory, profileList[0]),
    };
  }

  _updateData(product: string, territory: string, profile: string): Object {
    let data = this.props.switchingDynamic.filter(
      (datum) =>
        datum.product === product &&
        datum.territory === territory &&
        datum.smokerProfile === profile,
    );
    let maxSwitchValue = 0;
    let minSwitchValue = 0;
    for (let datum of data) {
      let {switchInValue, switchOutValue} = datum;
      maxSwitchValue =
        maxSwitchValue > switchInValue ? maxSwitchValue : switchInValue;
      minSwitchValue =
        minSwitchValue < switchOutValue ? minSwitchValue : switchOutValue;
    }
    return {data, maxSwitchValue, minSwitchValue};
  }

  render() {
    let {
      selectedProduct,
      selectedProfile,
      productList,
      profileList,
      data,
      maxSwitchValue,
      minSwitchValue,
      selectedTerritory,
      territoryList,
    } = this.state;
    let {title, isLoading, error} = this.props;
    if (isLoading) {
      return (
        <Widget title={title}>
          <LoadingIndicator />
        </Widget>
      );
    }
    if (error) {
      return (
        <ErrorComponent url="/switchingDynamic" errorMessage={error.message} />
      );
    }

    let max =
      maxSwitchValue > minSwitchValue * -1
        ? maxSwitchValue
        : minSwitchValue * -1;
    return (
      <Widget
        title={title}
        filters={
          <View style={[styles.filterContainer, styles.bottomMargin]}>
            <View style={styles.rightMargin}>
              <Dropdown
                label="Territory"
                selectedValue={selectedTerritory}
                options={territoryList}
                onSelect={this._onTerritorySelected}
              />
            </View>
            <View style={styles.rightMargin}>
              <Dropdown
                label="Product"
                selectedValue={selectedProduct}
                options={productList}
                onSelect={this._onProductSelected}
              />
            </View>
            <View>
              <Dropdown
                label="Profile"
                selectedValue={selectedProfile}
                options={profileList}
                onSelect={this._onProfileSelected}
              />
            </View>
          </View>
        }
      >
        <Persist
          name="switchingDynamicsState"
          data={{
            state: this.state,
            oldProps: {
              selectedTerritory: this.props.selectedTerritory,
            },
          }}
          onMount={({state, oldProps}) => {
            let {selectedTerritory, switchingDynamic} = this.props;
            if (
              !selectedTerritory ||
              !oldProps ||
              !oldProps.selectedTerritory
            ) {
              return;
            }
            let newState = {...state};
            if (
              selectedTerritory !== oldProps.selectedTerritory &&
              selectedTerritory !== state.selectedTerritory
            ) {
              newState.selectedTerritory = selectedTerritory;
            }
            let filtered = switchingDynamic.filter(
              (data) => data.territory === newState.selectedTerritory,
            );

            let newProductList = [
              ...new Set(filtered.map((data) => data.product)),
            ];
            let newProfilelist = [
              ...new Set(filtered.map((data) => data.smokerProfile)),
            ];
            let {selectedProduct, selectedProfile} = state;
            if (!newProductList.includes(selectedProduct)) {
              selectedProduct = '';
            }
            if (!newProfilelist.includes(selectedProfile)) {
              selectedProfile = '';
            }
            this.setState({
              selectedTerritory: newState.selectedTerritory,
              territoryList: this._getTerritoryList(switchingDynamic),
              productList: newProductList,
              profileList: newProfilelist,
              selectedProduct,
              selectedProfile,
              ...this._updateData(
                selectedProduct,
                newState.selectedTerritory,
                selectedProfile,
              ),
            });
          }}
        />
        <Table
          fixedHeader
          selectable={false}
          wrapperStyle={{display: 'flex', flexDirection: 'column'}}
          bodyStyle={{flexGrow: 1}}
        >
          <TableHeader
            adjustForCheckbox={false}
            displaySelectAll={false}
            style={StyleSheet.flatten([styles.tableHeader, styles.cellHeight])}
          >
            <TableRow style={StyleSheet.flatten(styles.cellHeight)}>
              <TableHeaderColumn
                style={StyleSheet.flatten([
                  styles.defaultColumn,
                  styles.cellHeight,
                ])}
              />
              <TableHeaderColumn
                style={StyleSheet.flatten([
                  styles.defaultColumn,
                  styles.cellHeight,
                ])}
              >
                <Text customStyle="small" style={styles.tableHeaderText}>
                  Switch Out
                </Text>
              </TableHeaderColumn>
              <TableHeaderColumn
                style={StyleSheet.flatten([
                  styles.defaultColumn,
                  styles.cellHeight,
                  styles.barColumn,
                ])}
              />
              <TableHeaderColumn
                style={StyleSheet.flatten([
                  styles.defaultColumn,
                  styles.cellHeight,
                ])}
              >
                <Text customStyle="small" style={styles.tableHeaderText}>
                  Switch In
                </Text>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {!selectedTerritory ? (
              <TableRow>
                <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
                  <PlaceholderView
                    style={styles.placeholder}
                    text="Please select territory first"
                  />
                </TableRowColumn>
              </TableRow>
            ) : null}
            {productList.length > 0 && !selectedProduct ? (
              <TableRow>
                <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
                  <PlaceholderView
                    style={styles.placeholder}
                    text="Please select product first"
                  />
                </TableRowColumn>
              </TableRow>
            ) : null}
            {selectedProduct && profileList.length > 0 && !selectedProfile ? (
              <TableRow>
                <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
                  <PlaceholderView
                    style={styles.placeholder}
                    text="Please select profile first"
                  />
                </TableRowColumn>
              </TableRow>
            ) : null}
            {selectedTerritory &&
            (productList.length === 0 || selectedProduct) &&
            (profileList.length === 0 || selectedProfile) &&
            data.length === 0 ? (
              <TableRow>
                <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
                  <PlaceholderView
                    style={styles.placeholder}
                    text={`No data available for territory ${selectedTerritory}`}
                  />
                </TableRowColumn>
              </TableRow>
            ) : null}
            {data.map((datum, index) => (
              <TableRow
                key={index}
                style={StyleSheet.flatten([
                  styles.cellHeight,
                  {
                    backgroundColor:
                      index % 2 === 0 ? TABLE_COLOR.even : TABLE_COLOR.odd,
                  },
                ])}
              >
                <TableRowColumn
                  style={StyleSheet.flatten([
                    styles.defaultColumn,
                    styles.cellHeight,
                  ])}
                >
                  <Text customStyle="small">{datum.brand}</Text>
                </TableRowColumn>
                <TableRowColumn
                  style={StyleSheet.flatten([
                    styles.defaultColumn,
                    styles.cellHeight,
                  ])}
                >
                  <Text customStyle="small">
                    {roundDecimal(datum.switchOutValue)}
                  </Text>
                </TableRowColumn>
                <TableRowColumn
                  style={StyleSheet.flatten([
                    styles.defaultColumn,
                    styles.cellHeight,
                    styles.barColumn,
                  ])}
                >
                  <SwitchingDynamicStackedBarChart
                    data={[datum]}
                    maxDomainValue={max}
                  />
                </TableRowColumn>
                <TableRowColumn
                  style={StyleSheet.flatten([
                    styles.defaultColumn,
                    styles.cellHeight,
                  ])}
                >
                  <Text customStyle="small">
                    {roundDecimal(datum.switchInValue)}
                  </Text>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Widget>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  rightMargin: {
    marginRight: 15,
  },
  bottomMargin: {
    marginBottom: 15,
  },
  tableHeader: {
    backgroundColor: THEME_COLOR,
  },
  tableHeaderText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  cellHeight: {
    height: 30,
  },
  defaultColumn: {
    padding: 0,
    textAlign: 'center',
  },
  placeholder: {
    height: '100%',
  },
  noData: {
    height: 150,
    padding: 0,
    margin: 0,
  },
  barColumn: {
    width: 450,
  },
});

export function mapStateToProps(state: RootState) {
  let {switchingDynamicState, globalFilter} = state;
  return {
    ...switchingDynamicState,
    selectedTerritory: globalFilter.selectedTerritory,
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchSwitchingDynamic: () => {
      dispatch({type: 'FETCH_SWITCHING_DYNAMIC_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SwitchingDynamicScene,
);
