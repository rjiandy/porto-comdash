// @flow

import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {Text} from '../../../general/components/coreUIComponents';
import {THEME_COLOR} from '../../../general/constants/colors';

import type {TableData} from '../LandingPage-types';

type Props = {
  dataSource: Map<string, TableData>;
  onRowPress?: (item: Object) => void;
  optionalKey?: string;
};

export default function RspWspTable(props: Props) {
  let {dataSource, onRowPress, optionalKey} = props;
  let BodyContent = [];
  let index = 0;
  for (let [key, {rspWspData}] of dataSource) {
    BodyContent.push(
      <TableRow key={index} style={styles.rowItem}>
        <TableRowColumn style={styles.rowItemColumn}>
          <Text customStyle="small">{key}</Text>
        </TableRowColumn>
        <TableRowColumn style={styles.rowItemColumn}>
          <Text customStyle="small">
            {rspWspData ? rspWspData.distPriceWSP : ''}
          </Text>
        </TableRowColumn>
        <TableRowColumn style={styles.rowItemColumn}>
          <Text customStyle="small">
            {rspWspData ? rspWspData.canvasPrice : ''}
          </Text>
        </TableRowColumn>
        <TableRowColumn style={styles.rowItemColumn}>
          <Text customStyle="small">
            {rspWspData ? rspWspData.wspPrice : ''}
          </Text>
        </TableRowColumn>
        <TableRowColumn style={styles.rowItemColumn}>
          <Text customStyle="small">
            {rspWspData ? rspWspData.rspPackPrice : ''}
          </Text>
        </TableRowColumn>
        <TableRowColumn style={styles.rowItemColumn}>
          <Text customStyle="small">
            {rspWspData ? rspWspData.rspStickPrice : ''}
          </Text>
        </TableRowColumn>
      </TableRow>,
    );
    index++;
  }
  return (
    <Table
      height={150}
      selectable
      style={styles.table}
      onRowSelection={(row) => {
        if (onRowPress && dataSource[row]) {
          if (optionalKey && dataSource[row][optionalKey]) {
            onRowPress(dataSource[row][optionalKey]);
          } else {
            if (dataSource[row].brand) {
              onRowPress(dataSource[row]['brand']);
            }
          }
        }
      }}
    >
      <TableHeader
        displaySelectAll={false}
        selectable
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn style={styles.header}>
            <Text style={styles.headerText}>Brand SKU</Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.header}>
            <Text style={styles.headerText}>{"Dist Price ('000)/Bale"}</Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.header}>
            <Text style={styles.headerText}>Canvas</Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.header}>
            <Text style={styles.headerText}>{"WSP ('000)/Bale"}</Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.header}>
            <Text style={styles.headerText}>RSP Pack</Text>
          </TableHeaderColumn>
          <TableHeaderColumn style={styles.header}>
            <Text style={styles.headerText}>RSP Stick</Text>
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>{BodyContent}</TableBody>
    </Table>
  );
}

const styles = {
  table: {
    minWidth: 500,
    border: '1px solid #999',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    height: 'auto',
    textAlign: 'center',
    color: 'white',
    backgroundColor: THEME_COLOR,
    paddingLeft: 0,
    paddingRight: 0,
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
  },
  headerText: {
    color: 'white',
    wordWrap: 'break-word',
  },
};
