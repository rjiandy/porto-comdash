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

import commaSeparator from '../../../general/helpers/commaSeparator';
import roundDecimal from '../../../general/helpers/roundDecimal';

import {
  THEME_COLOR,
  WHITE,
  TABLE_COLOR,
} from '../../../general/constants/colors';

import type {Wsp} from '../types/Wsp-type';

type Props = {
  data: Array<Wsp>;
  type: 'brand' | 'territory';
  accessLevel: 'National' | 'Zone' | 'Region' | 'Area';
  alternativePlaceholderMessage?: string;
};

export function formatThousands(num: number): string {
  if (Number.isNaN(num)) {
    return '0';
  }
  return commaSeparator(Number(num / 1000).toFixed());
}

export function getTerritoryHeader(
  accessLevel: 'National' | 'Zone' | 'Region' | 'Area'
) {
  switch (accessLevel) {
    case 'National':
      return 'Zone';
    case 'Zone':
      return 'Region';
    case 'Region':
      return 'Area';
    default:
      return '';
  }
}

export default function WspTable(props: Props) {
  let {data, type, accessLevel, alternativePlaceholderMessage} = props;
  return (
    <Table
      wrapperStyle={{display: 'flex', flexDirection: 'column'}}
      bodyStyle={{flexGrow: 1}}
      selectable={false}
    >
      <TableHeader
        fixedHeader
        adjustForCheckbox={false}
        displaySelectAll={false}
        style={StyleSheet.flatten([styles.tableHeader, styles.defaultColumn])}
      >
        <TableRow>
          <TableHeaderColumn
            style={StyleSheet.flatten([
              styles.defaultColumn,
              styles.nameColumn,
            ])}
          >
            <Text customStyle="small" style={styles.tableHeaderText}>
              {type === 'brand' ? 'Brand' : getTerritoryHeader(accessLevel)}
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn
            style={StyleSheet.flatten([styles.defaultColumn, {width: 56}])}
          >
            <Text customStyle="small" style={styles.tableHeaderText}>
              {`Dist Price ('000)/Bale`}
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              Min Price
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              Max Price
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              Mode 1 Price
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              % Mode 1 Price
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              Mode 2 Price
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              % Mode 2 Price
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              Average Price
            </Text>
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {alternativePlaceholderMessage ? (
          <TableRow>
            <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
              <Text>{alternativePlaceholderMessage}</Text>
            </TableRowColumn>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
              <Text>No data avaiable</Text>
            </TableRowColumn>
          </TableRow>
        ) : null}
        {data.map((datum, index) => datum && (
          <TableRow
            key={index}
            style={StyleSheet.flatten([
              styles.defaultColumn,
              {
                backgroundColor:
                  index % 2 === 0 ? TABLE_COLOR.even : TABLE_COLOR.odd,
              },
            ])}
          >
            <TableRowColumn
              style={StyleSheet.flatten([
                styles.defaultColumn,
                styles.nameColumn,
              ])}
            >
              <View style={styles.textContainer}>
                <Text customStyle="small" style={styles.text}>
                  {type === 'brand' ? datum.brandSKU : datum.territory}
                </Text>
              </View>
            </TableRowColumn>
            <TableRowColumn
              style={StyleSheet.flatten([styles.defaultColumn, {width: 56}])}
            >
              <View style={styles.numberContainer}>
                <Text customStyle="small" style={styles.number}>
                  {datum.distPriceWSP !== 'NULL' &&
                  !isNaN(Number(datum.distPriceWSP)) ? (
                    commaSeparator(datum.distPriceWSP)
                  ) : (
                    '-'
                  )}
                </Text>
              </View>
            </TableRowColumn>
            <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
              <View style={styles.numberContainer}>
                {datum.wspMinPrice !== 'NULL' &&
                !isNaN(Number(datum.wspMinPrice)) ? (
                  <Text customStyle="small" style={styles.number}>
                    {commaSeparator(datum.wspMinPrice)}
                  </Text>
                ) : (
                  <Text customStyle="small">-</Text>
                )}
              </View>
            </TableRowColumn>
            <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
              <View style={styles.numberContainer}>
                {datum.wspMaxPrice !== 'NULL' &&
                !isNaN(Number(datum.wspMaxPrice)) ? (
                  <Text customStyle="small" style={styles.number}>
                    {commaSeparator(datum.wspMaxPrice)}
                  </Text>
                ) : (
                  <Text customStyle="small">-</Text>
                )}
              </View>
            </TableRowColumn>
            <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
              <View style={styles.numberContainer}>
                {datum.wspPrice !== 'NULL' && !isNaN(Number(datum.wspPrice)) ? (
                  <Text customStyle="small" style={styles.number}>
                    {commaSeparator(datum.wspPrice)}
                  </Text>
                ) : (
                  <Text customStyle="small" style={styles.number}>
                    -
                  </Text>
                )}
              </View>
            </TableRowColumn>
            <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
              <View style={styles.numberContainer}>
                {datum.wspPCTPrice !== 'NULL' &&
                !isNaN(Number(datum.wspPCTPrice)) ? (
                  <Text customStyle="small" style={styles.number}>
                    {roundDecimal(datum.wspPCTPrice)}
                  </Text>
                ) : (
                  <Text customStyle="small">-</Text>
                )}
              </View>
            </TableRowColumn>
            <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
              <View style={styles.numberContainer}>
                {datum.wspPriceTwo !== 'NULL' &&
                !isNaN(Number(datum.wspPriceTwo)) ? (
                  <Text customStyle="small" style={styles.number}>
                    {commaSeparator(datum.wspPriceTwo)}
                  </Text>
                ) : (
                  <Text customStyle="small">-</Text>
                )}
              </View>
            </TableRowColumn>
            <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
              <View style={styles.numberContainer}>
                {datum.wspPCTPriceTwo !== 'NULL' &&
                !isNaN(Number(datum.wspPCTPriceTwo)) ? (
                  <Text customStyle="small" style={styles.number}>
                    {roundDecimal(datum.wspPCTPriceTwo)}
                  </Text>
                ) : (
                  <Text customStyle="small">-</Text>
                )}
              </View>
            </TableRowColumn>
            <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
              <View style={styles.numberContainer}>
                {datum.wspAveragePrice !== 'NULL' &&
                !isNaN(Number(datum.wspAveragePrice)) ? (
                  <Text customStyle="small" style={styles.number}>
                    {commaSeparator(datum.wspAveragePrice)}
                  </Text>
                ) : (
                  <Text customStyle="small">-</Text>
                )}
              </View>
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    backgroundColor: THEME_COLOR,
  },
  tableHeaderText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  nameColumn: {
    width: 70,
  },
  defaultColumn: {
    padding: 0,
    height: 30,
    textAlign: 'center',
  },
  numberContainer: {
    width: 30,
    marginHorizontal: 'auto',
  },
  number: {
    textAlign: 'right',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 3,
  },
  text: {
    textAlign: 'left',
  },
  noData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
