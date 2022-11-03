// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {View, Text} from '../../../general/components/coreUIComponents';

import getSalesGrowthShape from '../../../general/helpers/getSalesGrowthShape';

import {
  THEME_COLOR,
  WHITE,
  TABLE_COLOR,
} from '../../../general/constants/colors';

type Props = {
  data: Array<Object>;
  compare: 'product' | 'territory';
};

export default function Vs3MMATable(props: Props) {
  let {data, compare} = props;
  return (
    <Table height="180px" selectable={false}>
      <TableHeader
        fixedHeader
        adjustForCheckbox={false}
        displaySelectAll={false}
        style={{backgroundColor: THEME_COLOR}}
      >
        <TableRow style={StyleSheet.flatten(styles.tableCell)}>
          <TableHeaderColumn style={StyleSheet.flatten(styles.tableCell)}>
            <Text
              customStyle="small"
              style={StyleSheet.flatten(styles.tableHeaderText)}
            >
              {compare === 'product' ? 'Brand' : 'Territory'}
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.tableCell)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              VS Last 3 MMA
            </Text>
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {data.length === 0 ? (
          <TableRow style={StyleSheet.flatten(styles.tableCell)}>
            <TableRowColumn
              style={StyleSheet.flatten([
                styles.emptyTableText,
                styles.tableCell,
              ])}
            >
              <Text>No data avaiable</Text>
            </TableRowColumn>
          </TableRow>
        ) : null}
        {data.map((datum, index) => (
          <TableRow
            key={index}
            style={StyleSheet.flatten([
              styles.tableCell,
              {
                backgroundColor:
                  index % 2 === 0 ? TABLE_COLOR.even : TABLE_COLOR.odd,
              },
            ])}
          >
            <TableRowColumn style={StyleSheet.flatten(styles.tableCell)}>
              <View style={styles.textContainer}>
                <Text customStyle="small" style={styles.text}>
                  {datum[compare]}
                </Text>
              </View>
            </TableRowColumn>
            <TableRowColumn style={StyleSheet.flatten(styles.tableCell)}>
              <View style={{alignItems: 'center'}}>
                <View style={styles.somGrowthColumn}>
                  {!isNaN(datum.somGrowth) &&
                    getSalesGrowthShape(datum.somGrowth)}
                  <Text style={{paddingLeft: 5}} customStyle="small">
                    {(!isNaN(datum.somGrowth) && `${datum.somGrowth}%`) || ''}
                  </Text>
                </View>
              </View>
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const styles = StyleSheet.create({
  tableHeaderText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  somGrowthColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 45,
    justifyContent: 'space-between',
  },
  emptyTableText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCell: {
    padding: 0,
    height: 30,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    width: 100,
    marginHorizontal: 'auto',
  },
  text: {
    textAlign: 'left',
  },
});
