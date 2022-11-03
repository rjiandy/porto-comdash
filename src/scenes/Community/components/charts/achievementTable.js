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

import {Text} from '../../../../general/components/coreUIComponents';

import {
  THEME_COLOR,
  WHITE,
  TABLE_COLOR,
} from '../../../../general/constants/colors';

import type {Achievement} from '../../types/Community-type';

type Props = {
  data: Array<$Shape<Achievement>>;
};

export default function AchievementTable(props: Props) {
  let achievements = props.data;

  let achievementTableContent = achievements.map((achievement, id) => {
    return (
      <TableRow
        key={id}
        style={StyleSheet.flatten([
          styles.defaultColumn,
          {
            backgroundColor: id % 2 === 0 ? TABLE_COLOR.even : TABLE_COLOR.odd,
          },
        ])}
      >
        <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
          <Text customStyle="small">
            {achievement.product}
          </Text>
        </TableRowColumn>
        <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
          <Text customStyle="small">
            {achievement.CC}
          </Text>
        </TableRowColumn>
        <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
          <Text customStyle="small">
            {achievement.ECC}
          </Text>
        </TableRowColumn>
        <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
          <Text customStyle="small">
            {achievement.packSold}
          </Text>
        </TableRowColumn>
        <TableRowColumn style={StyleSheet.flatten(styles.defaultColumn)}>
          <Text customStyle="small">
            {achievement.strikeRate}
          </Text>
        </TableRowColumn>
      </TableRow>
    );
  });
  return (
    <Table height="250px" selectable={false}>
      <TableHeader
        fixedHeader
        adjustForCheckbox={false}
        displaySelectAll={false}
        style={StyleSheet.flatten([styles.tableHeader, styles.defaultColumn])}
      >
        <TableRow>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              Audience
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              CC
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              ECC
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              Pack Sold
            </Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={StyleSheet.flatten(styles.defaultColumn)}>
            <Text customStyle="small" style={styles.tableHeaderText}>
              Strike Rate
            </Text>
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {achievements.length === 0
          ? <TableRow>
              <TableRowColumn style={StyleSheet.flatten(styles.noData)}>
                <Text>No data avaiable</Text>
              </TableRowColumn>
            </TableRow>
          : achievementTableContent}
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
  defaultColumn: {
    padding: 0,
    height: 30,
    textAlign: 'center',
  },
  noData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
