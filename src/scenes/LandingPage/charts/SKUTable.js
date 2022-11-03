// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {Text, View} from '../../../general/components/coreUIComponents';
import BarChart from '../../../general/components/charts/BarRechart';
import formatChartInput from '../../../general/helpers/formatChartInput';
import commaSeparator from '../../../general/helpers/commaSeparator';
import getWeekNumber from '../helpers/getWeekNumber';

import {
  THEME_COLOR,
  TABLE_COLOR,
  PLACEHOLDER_ROW,
  GROWTH_COLOR,
} from '../../../general/constants/colors';

import type {TableData} from '../LandingPage-types';

type Props = {
  dataSource: Map<string, TableData>;
  placeholderRowNumber: number;
  showRSP?: boolean;
  showPlaceholderRow?: boolean;
};

type State = {
  selectedRow: number;
};

const BAR_CONTAINER_WIDTH = 127;
const RSWSP_KEY = [
  {key: 'distPriceWSP', headerName: `Dist Price ('000)/Bale`},
  {key: 'canvasPrice', headerName: `Canvas`},
  {key: 'wspPrice', headerName: `WSP ('000)/Bale`},
  {key: 'rspPackPrice', headerName: `RSP Pack`},
  {key: 'rspStickPrice', headerName: `RSP Stick`},
];

export default class SKUTable extends Component {
  props: Props;
  state: State;
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {selectedRow: 0};
  }

  render() {
    let {dataSource, showRSP, placeholderRowNumber} = this.props;
    let indexedKey = [];
    let TableContent = [];
    let rowIndex = 0;
    let weekNumber;

    let sortedProductList = Array.from(dataSource.values())
      .map(({salesData}) => {
        let {sortOrderProduct, brand} = salesData[0];
        return {brand, sortOrderProduct};
      })
      .sort((a, b) => a.sortOrderProduct - b.sortOrderProduct)
      .map(({brand}) => brand);

    for (let key of sortedProductList) {
      let data = dataSource.get(key);
      let salesData = [];
      let rspWspData = {};
      if (data) {
        ({salesData, rspWspData} = data);
      }
      weekNumber =
        (rspWspData &&
          rspWspData['timeWeekId'] &&
          getWeekNumber(rspWspData['timeWeekId'].toString())) ||
        '';
      indexedKey.push(key);
      let growthDataKeys = [
        {from: 'volLY', to: 'LY'},
        {from: 'volTY', to: 'TY'},
        {from: 'ob', to: 'OB'},
      ];
      // need to be confirm
      let growthData = formatChartInput(salesData[0], growthDataKeys);
      let rspWspTableColumn = [];
      if (showRSP) {
        RSWSP_KEY.forEach(({key}) => {
          rspWspTableColumn.push(
            rspWspData && rspWspData[key] ? (
              <TableRowColumn
                key={key}
                style={{
                  ...styles.removeHorizontalPadding,
                  justifyContent: 'flex-end',
                }}
              >
                <View
                  style={{width: 50, marginLeft: 'auto', marginRight: 'auto'}}
                >
                  <Text customStyle="small" style={{textAlign: 'right'}}>
                    {commaSeparator(rspWspData[key])}
                  </Text>
                </View>
              </TableRowColumn>
            ) : (
              <TableRowColumn key={key} style={styles.removeHorizontalPadding}>
                <Text customStyle="title">{'-'}</Text>
              </TableRowColumn>
            ),
          );
        });
      }

      TableContent.push(
        <TableRow
          key={key}
          style={{
            ...styles.solidBorderBottom,
            backgroundColor: TABLE_COLOR[rowIndex % 2 === 0 ? 'even' : 'odd'],
          }}
        >
          <TableRowColumn style={styles.removeHorizontalPadding}>
            <Text customStyle="small">{key}</Text>
          </TableRowColumn>
          <TableRowColumn style={styles.removeHorizontalPadding}>
            <Text customStyle="small">
              {commaSeparator(salesData[0].weekToDate)}
            </Text>
          </TableRowColumn>
          <TableRowColumn style={styles.removePadding}>
            {salesData.map((data, index) => (
              <TableRow
                key={index}
                displayBorder={!(index === (salesData && salesData.length - 1))}
                style={styles.rowItemContent}
              >
                <TableRowColumn style={styles.rowItemContent}>
                  <Text customStyle="small">{data['itemType']}</Text>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableRowColumn>
          <TableRowColumn style={styles.removePadding}>
            {salesData.map((data, index) => (
              <TableRow
                key={index}
                displayBorder={!(index === (salesData && salesData.length - 1))}
                style={{...styles.rowItemContent, justifyContent: 'flex-end'}}
              >
                <TableRowColumn style={styles.rowItemContent}>
                  <Text customStyle="small">
                    {commaSeparator(data['itemValueWeekTwo'])}
                  </Text>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableRowColumn>
          <TableRowColumn style={styles.removePadding}>
            {salesData.map((data, index) => (
              <TableRow
                key={index}
                displayBorder={!(index === (salesData && salesData.length - 1))}
                style={{...styles.rowItemContent, justifyContent: 'flex-end'}}
              >
                <TableRowColumn style={styles.rowItemContent}>
                  <Text customStyle="small">
                    {commaSeparator(data['itemValueWeekOne'])}
                  </Text>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableRowColumn>
          <TableRowColumn
            style={{...styles.removePadding, width: BAR_CONTAINER_WIDTH}}
          >
            <View style={styles.objectiveTable}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  height: 13,
                  width: '100%',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    marginLeft: 21,
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      minWidth: 26,
                      color:
                        salesData[0].volGrowth && salesData[0].volGrowth > 0
                          ? GROWTH_COLOR.high
                          : salesData[0].volGrowth < 0
                            ? GROWTH_COLOR.low
                            : 'black',
                    }}
                    customStyle="small"
                  >
                    {salesData[0].volGrowth
                      ? `${salesData[0].volGrowth
                          .toString()
                          .split('-')
                          .pop()}%`
                      : ''}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    marginRight: 21,
                  }}
                >
                  <Text
                    style={{textAlign: 'center', minWidth: 26}}
                    customStyle="small"
                  >
                    {salesData[0].obPct
                      ? `${salesData[0].obPct
                          .toString()
                          .split('-')
                          .pop()}%`
                      : ''}
                  </Text>
                </View>
              </View>
              <BarChart
                data={growthData}
                xAxis="name"
                yAxis="value"
                style={{
                  bar: {
                    data: {fill: THEME_COLOR, width: 30},
                    label: {
                      fontSize: 8,
                    },
                  },
                }}
                extraProps={{
                  barChart: {
                    margin: {
                      top: 5,
                      bottom: 5,
                    },
                  },
                  bar: {
                    labelFormatter: (label) => commaSeparator(label),
                  },
                  tooltip: {
                    valueFormatter: (value) => commaSeparator(value),
                  },
                  xAxis: {
                    hide: true,
                    tick: false,
                  },
                }}
                showLabelValue
                showTooltip
                height={50}
              />
            </View>
          </TableRowColumn>
          {rspWspTableColumn}
        </TableRow>,
      );
      rowIndex++;
    }

    let rspWspTableColumnHeader = [];

    if (showRSP) {
      for (let i = indexedKey.length; i < placeholderRowNumber; i++) {
        TableContent.push(
          <TableRow
            key={i}
            style={{
              ...styles.solidBorderBottom,
              backgroundColor: PLACEHOLDER_ROW,
            }}
          >
            <TableRowColumn
              colSpan={11}
              style={{
                height: 66,
              }}
            />
          </TableRow>,
        );
      }

      RSWSP_KEY.forEach(({headerName}, index) => {
        rspWspTableColumnHeader.push(
          <TableHeaderColumn style={styles.header} key={index}>
            <Text style={styles.headerText}>{headerName}</Text>
          </TableHeaderColumn>,
        );
      });
    }

    return (
      <View style={{flex: 4}}>
        <Table
          fixedHeader
          style={{...styles.solidBorder, ...styles.table}}
          wrapperStyle={{display: 'flex', flexDirection: 'column'}}
          bodyStyle={{flexGrow: 1}}
          selectable={false}
        >
          <TableHeader
            fixedHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow style={styles.headerRow}>
              <TableHeaderColumn style={styles.header}>
                <Text style={styles.headerText}>SKU</Text>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.header}>
                <Text style={styles.headerText}>Week to Date</Text>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.header}>
                <Text style={styles.headerText}>KSI</Text>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.header}>
                <Text style={styles.headerText}>
                  #KPS-{weekNumber && !isNaN(weekNumber) ? weekNumber - 1 : 2}
                  {` ('000)`}
                </Text>
              </TableHeaderColumn>
              <TableHeaderColumn style={styles.header}>
                <Text style={styles.headerText}>
                  #KPS-{weekNumber && !isNaN(weekNumber) ? weekNumber : 1}
                  {` ('000)`}
                </Text>
              </TableHeaderColumn>
              <TableHeaderColumn
                style={{
                  ...styles.header,
                  width: BAR_CONTAINER_WIDTH,
                }}
              >
                <View style={styles.threeColumnHeader}>
                  <Text style={{...styles.headerText}}>LY{`\n`}(Mio)</Text>
                  <Text style={{...styles.headerText}}>TY{`\n`}(Mio)</Text>
                  <Text style={{...styles.headerText}}>OB{`\n`}(Mio)</Text>
                </View>
              </TableHeaderColumn>
              {rspWspTableColumnHeader}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>{TableContent}</TableBody>
        </Table>
      </View>
    );
  }
}

const styles = {
  header: {
    alignItems: 'center',
    backgroundColor: THEME_COLOR,
    color: 'white',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    height: 'auto',
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    width: 'auto',
  },
  headerRow: {
    height: 'auto',
    padding: 0,
    width: 'auto',
  },
  headerText: {
    color: 'white',
    wordWrap: 'break-word',
  },
  flexCentered: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  removePadding: {
    padding: 0,
    height: 'auto',
    width: 'auto',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  solidBorderBottom: {
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    padding: 2,
    height: 'auto',
    width: 'auto',
  },
  solidBorder: {
    border: 'thin solid #E0E0E0',
  },
  rowItemContent: {
    display: 'flex',
    padding: 2,
    height: 'auto',
    margin: 0,
  },
  removeHorizontalPadding: {
    padding: 2,
    height: 'auto',
    textAlign: 'center',
    width: 'auto',
  },
  table: {
    minWidth: 500,
    border: 'thin solid #E0E0E0',
  },
  threeColumnHeader: {
    flex: 1,
    flexDirection: 'row',
    padding: 0,
    height: 'auto',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  objectiveTable: {
    flex: 1,
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowItem: {
    height: 'auto',
    border: '1px solid #999',
    padding: 4,
  },
  rowItemColumn: {
    textAlign: 'center',
    padding: 4,
    height: 'auto',
    width: 'auto',
  },
};
