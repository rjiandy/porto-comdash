// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {StyleSheet} from 'react-primitives';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {connect} from 'react-redux';

import {Widget} from '../../general/components/UIComponents';
import {
  View,
  Text,
  Dropdown,
  Icon,
} from '../../general/components/coreUIComponents';
import {GROWTH_COLOR} from '../../general/constants/colors';
import Persist from '../../general/components/Persist';

import type {BrandFunnels} from './types/BrandFunnel-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type State = {
  smokerProfileList: Array<string>;
  productList: Array<string>;
  selectedSmokerProfile: string;
  selectedProducts: Array<string>;
};

type Props = {
  title: string;
  data: BrandFunnels;
  fetchBrandFunnelData: () => void;
};

export class BrandFunnelScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      smokerProfileList: [],
      productList: [],
      selectedSmokerProfile: '',
      selectedProducts: [],
    };
  }

  componentWillMount() {
    let {data, fetchBrandFunnelData} = this.props;
    if (data.length === 0) {
      fetchBrandFunnelData();
    } else {
      this._populateLists(data);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let {data} = nextProps;
    this._populateLists(data);
  }

  _populateLists(data: BrandFunnels) {
    if (data.length > 0) {
      let smokerProfileList = new Set();
      let productList = new Set();
      for (let datum of data) {
        smokerProfileList.add(datum.smokerProfile);
        productList.add(datum.product);
      }
      this.setState({
        smokerProfileList: [...smokerProfileList],
        productList: [...productList],
      });
    }
  }

  _getBackgroundColor(value: number): string {
    if (value > 1) {
      return GROWTH_COLOR.high;
    }
    if (value >= -1) {
      return GROWTH_COLOR.middle;
    }
    return GROWTH_COLOR.low;
  }

  _onSmokerProfileSelected(selectedSmokerProfile: string) {
    let {data} = this.props;
    let {selectedProducts} = this.state;
    let productList = [
      ...new Set(
        data
          .filter((datum) => datum.smokerProfile === selectedSmokerProfile)
          .map((datum) => datum.product),
      ),
    ];
    this.setState({
      selectedSmokerProfile,
      productList,
      selectedProducts: selectedProducts.filter((product) =>
        productList.includes(product),
      ),
    });
  }

  render() {
    let {data, title} = this.props;
    let {
      smokerProfileList,
      productList,
      selectedSmokerProfile,
      selectedProducts,
    } = this.state;
    let filtered = data.filter(
      (datum) => datum.smokerProfile === selectedSmokerProfile,
    );
    let tableData = [];
    for (let product of selectedProducts) {
      let data = filtered.find((datum) => datum.product === product);
      if (data) {
        tableData.push(data);
      }
    }
    return (
      <Widget
        title={title}
        filters={
          <View style={styles.rowFlexed}>
            <View style={styles.rightPadding}>
              <Dropdown
                label="Smoker Profile"
                selectedValue={selectedSmokerProfile}
                onSelect={this._onSmokerProfileSelected}
                options={smokerProfileList}
              />
            </View>
            <Dropdown
              label="Product"
              selectedValue={selectedProducts}
              onSelect={(selectedProducts) => this.setState({selectedProducts})}
              options={productList}
              multiple
            />
          </View>
        }
      >
        <Persist
          name="brandFunnelState"
          data={this.state}
          onMount={(data) => this.setState(data)}
        />
        <View style={[styles.flex, styles.topPadding]}>
          <Table
            wrapperStyle={{display: 'flex', flexDirection: 'column'}}
            bodyStyle={{flexGrow: 1}}
            selectable={false}
          >
            <TableHeader
              fixedHeader
              adjustForCheckbox={false}
              displaySelectAll={false}
              style={StyleSheet.flatten([
                styles.tableHeader,
                styles.defaultColumn,
                {borderRight: '1px solid #e0e0e0'},
              ])}
            >
              <TableRow>
                <TableHeaderColumn
                  style={StyleSheet.flatten([
                    styles.defaultColumn,
                    styles.rightBorder,
                    {borderRight: '1px solid #e0e0e0'},
                  ])}
                />
                <TableHeaderColumn
                  style={StyleSheet.flatten(styles.defaultColumn)}
                >
                  <View style={[styles.rowFlexed, styles.centerAligned]}>
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={[styles.flex, styles.tableHeaderText]}
                    >
                      Spont. Awareness
                    </Text>
                    <Icon
                      name="chevron-right-black"
                      color="black"
                      style={{height: 25, width: 25}}
                    />
                  </View>
                </TableHeaderColumn>
                <TableHeaderColumn
                  style={StyleSheet.flatten(styles.defaultColumn)}
                >
                  <View style={[styles.rowFlexed, styles.centerAligned]}>
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={[styles.flex, styles.tableHeaderText]}
                    >
                      Trial
                    </Text>
                    <Icon
                      name="chevron-right-black"
                      color="black"
                      style={{height: 25, width: 25}}
                    />
                  </View>
                </TableHeaderColumn>
                <TableHeaderColumn
                  style={StyleSheet.flatten(styles.defaultColumn)}
                >
                  <View style={[styles.rowFlexed, styles.centerAligned]}>
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={[styles.flex, styles.tableHeaderText]}
                    >
                      Purchase
                    </Text>
                    <Icon
                      name="chevron-right-black"
                      color="black"
                      style={{height: 25, width: 25}}
                    />
                  </View>
                </TableHeaderColumn>
                <TableHeaderColumn
                  style={StyleSheet.flatten(styles.defaultColumn)}
                >
                  <View style={[styles.rowFlexed, styles.centerAligned]}>
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={[styles.flex, styles.tableHeaderText]}
                    >
                      Penetration
                    </Text>
                    <Icon
                      name="chevron-right-black"
                      color="black"
                      style={{height: 25, width: 25}}
                    />
                  </View>
                </TableHeaderColumn>
                <TableHeaderColumn
                  style={StyleSheet.flatten(styles.defaultColumn)}
                >
                  <Text
                    customStyle="small"
                    fontWeight="bold"
                    style={styles.tableHeaderText}
                  >
                    Main Smoker
                  </Text>
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {tableData.length === 0
                ? <TableRow>
                    <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
                      <Text customStyle="small">No data avaiable</Text>
                    </TableRowColumn>
                  </TableRow>
                : null}
              {tableData.map((datum, index) =>
                <TableRow key={index}>
                  <TableRowColumn
                    style={StyleSheet.flatten([
                      styles.defaultColumn,
                      {borderRight: '1px solid #e0e0e0'},
                    ])}
                  >
                    <View style={styles.textContainer}>
                      <Text
                        customStyle="small"
                        fontWeight="bold"
                        style={styles.text}
                      >
                        {datum.product}
                      </Text>
                    </View>
                  </TableRowColumn>
                  <TableRowColumn
                    style={StyleSheet.flatten([
                      styles.defaultColumn,
                      {
                        backgroundColor: this._getBackgroundColor(
                          datum.spontValDelta || 0,
                        ),
                      },
                    ])}
                  >
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={styles.number}
                    >
                      {datum.spontVal + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {(datum.spontValDelta == null
                        ? '-'
                        : datum.spontValDelta) + '\n '}
                      {/* NOTE: the empty space is crucial! or the new line will not be printed */}
                    </Text>
                  </TableRowColumn>
                  <TableRowColumn
                    style={StyleSheet.flatten([
                      styles.defaultColumn,
                      {
                        backgroundColor: this._getBackgroundColor(
                          datum.trialValDelta || 0,
                        ),
                      },
                    ])}
                  >
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={styles.number}
                    >
                      {datum.trialVal + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {(datum.trialValDelta == null
                        ? '-'
                        : datum.trialValDelta) + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {datum.trialValPCT == null
                        ? '-'
                        : `${datum.trialValPCT}%`}
                    </Text>
                  </TableRowColumn>
                  <TableRowColumn
                    style={StyleSheet.flatten([
                      styles.defaultColumn,
                      {
                        backgroundColor: this._getBackgroundColor(
                          datum.purchaseValDelta || 0,
                        ),
                      },
                    ])}
                  >
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={styles.number}
                    >
                      {datum.purchaseVal + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {(datum.purchaseValDelta == null
                        ? '-'
                        : datum.purchaseValDelta) + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {datum.purchaseValPCT == null
                        ? '-'
                        : `${datum.purchaseValPCT}%`}
                    </Text>
                  </TableRowColumn>
                  <TableRowColumn
                    style={StyleSheet.flatten([
                      styles.defaultColumn,
                      {
                        backgroundColor: this._getBackgroundColor(
                          datum.penetrationValDelta || 0,
                        ),
                      },
                    ])}
                  >
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={styles.number}
                    >
                      {datum.penetrationVal + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {(datum.penetrationValDelta == null
                        ? '-'
                        : datum.penetrationValDelta) + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {datum.penetrationValPCT == null
                        ? '-'
                        : `${datum.penetrationValPCT}%`}
                    </Text>
                  </TableRowColumn>
                  <TableRowColumn
                    style={StyleSheet.flatten([
                      styles.defaultColumn,
                      {
                        backgroundColor: this._getBackgroundColor(
                          datum.mainSmokerValDelta || 0,
                        ),
                        borderRight: '1px solid #e0e0e0',
                      },
                    ])}
                  >
                    <Text
                      customStyle="small"
                      fontWeight="bold"
                      style={styles.number}
                    >
                      {datum.mainSmokerVal + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {(datum.mainSmokerValDelta == null
                        ? '-'
                        : datum.mainSmokerValDelta) + '\n'}
                    </Text>
                    <Text customStyle="small" style={styles.number}>
                      {datum.mainSmokerValPCT == null
                        ? '-'
                        : `${datum.mainSmokerValPCT}%`}
                    </Text>
                  </TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </View>
      </Widget>
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
  centerAligned: {
    alignItems: 'center',
  },
  rightPadding: {
    paddingRight: 15,
  },
  topPadding: {
    paddingTop: 15,
  },
  defaultColumn: {
    padding: 0,
    height: 30,
    textAlign: 'center',
  },
  rightBorder: {
    borderRightWidth: 1,
    borderColor: '#000',
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  text: {
    textAlign: 'left',
  },
  noData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    textAlign: 'right',
  },
});

export function mapStateToProps(state: RootState) {
  let {data} = state.brandFunnelState;
  return {
    data,
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchBrandFunnelData: () => {
      dispatch({type: 'FETCH_BRAND_FUNNEL_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandFunnelScene);
