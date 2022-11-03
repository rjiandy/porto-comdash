// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';

import {View, Text} from '../../../general/components/coreUIComponents';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import getMonthDescByID from '../../../general/helpers/getMonthDescByID';
import getSalesGrowthShape from '../../../general/helpers/getSalesGrowthShape';

import {
  THEME_COLOR,
  WHITE,
  TABLE_COLOR,
  PLACEHOLDER_ROW,
} from '../../../general/constants/colors';

type SOMGrowthData = {
  product: string;
  somYtd: number;
  somGrowth: number;
  somLastTwoMonth: number;
  somLastMonth: number;
  somThisMonth: number;
  lastUpdate: number;
  sortOrder: number;
  sortOrderTerritory: number;
  sortOrderBrandFamily: number;
};

type Props = {
  data: Array<SOMGrowthData>;
  selectedBrand: string;
};

const MINIMUM_ROW = 4;

export default function SOMGrowthDataTable(props: Props) {
  let {data, selectedBrand} = props;
  let lastUpdate = data.length && data[0].lastUpdate;
  let sortedData = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
  let placeholderRow = [];
  for (let i = sortedData.length; i < MINIMUM_ROW; i++) {
    placeholderRow.push(
      <TableRow
        key={i}
        style={StyleSheet.flatten([
          styles.defaultColumn,
          styles.solidBorderBottom,
          {backgroundColor: PLACEHOLDER_ROW},
        ])}
      >
        <TableRowColumn
          colSpan={6}
          style={{
            height: 28,
          }}
        />
      </TableRow>,
    );
  }
  return (
    <Table
      selectable={false}
      wrapperStyle={{display: 'flex', flexDirection: 'column'}}
      bodyStyle={{flexGrow: 1}}
    >
      <TableHeader
        fixedHeader
        adjustForCheckbox={false}
        displaySelectAll={false}
        style={{backgroundColor: THEME_COLOR}}
      >
        <TableRow style={StyleSheet.flatten(styles.defaultColumn)}>
          <TableHeaderColumn
            style={StyleSheet.flatten([
              styles.defaultColumn,
              styles.nameColumn,
            ])}
          >
            {''}
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text
              customStyle="small"
              style={styles.tableHeaderText}
            >{`YTD ${lastUpdate &&
              getMonthDescByID(String(lastUpdate))}`}</Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              {'vs LY'}
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              {`${lastUpdate && getMonthDescByID(String(lastUpdate - 2))}`}
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              {`${lastUpdate && getMonthDescByID(String(lastUpdate - 1))}`}
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              {`${lastUpdate && getMonthDescByID(String(lastUpdate))}`}
            </Text>
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {selectedBrand && sortedData.length === 0 ? (
          <TableRow>
            <TableRowColumn
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>No data avaiable</Text>
            </TableRowColumn>
          </TableRow>
        ) : null}
        {sortedData.map((datum, index) => {
          return (
            <TableRow
              key={index}
              style={StyleSheet.flatten([
                styles.defaultColumn,
                {
                  backgroundColor:
                    index % 2 ? TABLE_COLOR['even'] : TABLE_COLOR['odd'],
                },
              ])}
            >
              <TableRowColumn
                style={StyleSheet.flatten([
                  styles.defaultColumn,
                  styles.nameColumn,
                ])}
              >
                <View style={{flex: 1}}>
                  <Text customStyle="small" style={styles.productName}>
                    {datum.product}
                  </Text>
                </View>
              </TableRowColumn>
              <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
                <View style={styles.numberContainer}>
                  <Text customStyle="small" style={styles.number}>
                    {datum.somYtd}
                  </Text>
                </View>
              </TableRowColumn>
              <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
                <View style={{alignItems: 'center'}}>
                  <View style={styles.somGrowthColumn}>
                    <View
                      style={
                        !isNaN(datum.somGrowth) &&
                        datum.somGrowth >= 0.3 && {marginTop: -18}
                      }
                    >
                      {!isNaN(datum.somGrowth) &&
                        getSalesGrowthShape(datum.somGrowth)}
                    </View>
                    <Text style={{paddingLeft: 5}} customStyle="small">
                      {(!isNaN(datum.somGrowth) && datum.somGrowth) || ''}
                    </Text>
                  </View>
                </View>
              </TableRowColumn>
              <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
                <View style={styles.numberContainer}>
                  <Text customStyle="small" style={styles.number}>
                    {datum.somThisMonth}
                  </Text>
                </View>
              </TableRowColumn>
              <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
                <View style={styles.numberContainer}>
                  <Text customStyle="small" style={styles.number}>
                    {datum.somLastMonth}
                  </Text>
                </View>
              </TableRowColumn>
              <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
                <View style={styles.numberContainer}>
                  <Text customStyle="small" style={styles.number}>
                    {datum.somLastTwoMonth}
                  </Text>
                </View>
              </TableRowColumn>
            </TableRow>
          );
        })}
        {sortedData.length > 0 ? placeholderRow : null}
      </TableBody>
    </Table>
  );
}

const styles = StyleSheet.create({
  tableHeaderText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  nameColumn: {
    textAlign: 'left',
  },
  defaultColumn: {
    padding: 0,
    textAlign: 'center',
    height: 30,
  },
  somGrowthColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 45,
  },
  productNameContainer: {
    width: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  productName: {
    textAlign: 'left',
    paddingLeft: 10,
  },
  numberContainer: {
    width: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  number: {
    textAlign: 'right',
  },
  solidBorderBottom: {
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    padding: 2,
    height: 'auto',
    width: 'auto',
  },
});
