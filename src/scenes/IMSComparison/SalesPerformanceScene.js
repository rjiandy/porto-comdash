// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import {
  View,
  Text,
  Icon,
  Dropdown,
  LoadingIndicator,
} from '../../general/components/coreUIComponents';
import {Widget} from '../../general/components/UIComponents.js';
import Persist from '../../general/components/Persist';
import {
  LIGHT_GREY,
  PLACEHOLDER_ROW,
} from '../../general/constants/colors';
import roundDecimal from '../../general/helpers/roundDecimal';

import type {
  IMSComparisonDatum,
  BrandFilters,
} from './types/IMSComparison-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

import EnhancedText from './helpers/EnhancedText';
import getWeek from '../../general/helpers/getWeek';
import commaSeparator from '../../general/helpers/commaSeparator';
import formatMillion from './helpers/formatMillion';

import {CORE_BRAND, OTHER_BRAND, NEW_BRAND} from './constants/BrandType';

type Props = {
  title: string;
  isLoading: boolean;
  fetchIMSComparisonData: () => null;
  data: Array<IMSComparisonDatum>;
  territory: string;
};
type State = {
  brandFilter: 'BRAND' | 'BRAND_FAMILY' | 'BRAND_VARIANT' | 'BRAND_SKU';
  selectedTerritory: Array<string>;
};

const NO_VALUE_PLACEHOLDER = '-';
const PLAHOLDER_ROW_NUMBER = 15;
const RADIO_BUTTON_ITEMS = [
  {
    value: 'BRAND_FAMILY',
    label: 'Brand Family',
  },
  {
    value: 'BRAND',
    label: 'Brand',
  },
  {
    value: 'BRAND_VARIANT',
    label: 'Brand Variant',
  },
  {
    value: 'BRAND_SKU',
    label: 'Brand SKU',
  },
];

export class SalesPerformanceScene extends Component {
  state: State;
  props: Props;
  _dropdownOptions: Array<string>;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      brandFilter: 'BRAND_FAMILY',
      selectedTerritory: [],
    };
    this._dropdownOptions = [];
  }

  componentWillMount() {
    let {data, fetchIMSComparisonData} = this.props;
    if (data.length === 0) {
      fetchIMSComparisonData();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data.length !== 0) {
      this._dropdownOptions = Array.from(
        new Set(nextProps.data.map(({territory}) => territory))
      );
    }
  }

  render() {
    let {title, isLoading} = this.props;
    if (isLoading) {
      return (
        <Widget title={title}>
          <LoadingIndicator />
        </Widget>
      );
    }
    let currWeek = getWeek(new Date());
    let currYear = new Date().getFullYear();
    let currData = this.props.data
      ? this.props.data.filter(
          ({category, territory}) =>
            this.state.brandFilter === category &&
            this.state.selectedTerritory.includes(territory)
        )
      : [];
    let coreBrands = currData.filter(({brandType}) => brandType === CORE_BRAND);
    let otherBrands = currData.filter(
      ({brandType}) => brandType === OTHER_BRAND
    );
    let newBrands = currData.filter(({brandType}) => brandType === NEW_BRAND);
    let totalCount = {
      volCurrentWeek: currData
        .map((item) => (item.volCurrentWeek !== 'NULL' ? item.volCurrentWeek : 0))
        .reduce((total, item) => total + Number(item), 0),
      volVariance: currData
        .map((item) => (item.volVariance !== 'NULL' ? item.volVariance : 0))
        .reduce((total, item) => total + Number(item), 0),
      volYTD: currData
        .map((item) => (item.volYTD !== 'NULL' ? item.volYTD : 0))
        .reduce((total, item) => total + Number(item), 0),
      volYTDLastYear: currData
        .map((item) => (item.volYTDLastYear !== 'NULL' ? item.volYTDLastYear : 0))
        .reduce((total, item) => total + Number(item), 0),
      objectiveYTD: currData
        .map((item) => (item.objectiveYTD !== 'NULL' ? item.objectiveYTD : 0))
        .reduce((total, item) => total + Number(item), 0),
      objectiveAchievement: currData
        .map(
          (item) =>
            item.objectiveAchievement === 'NULL' ? 0 : item.objectiveAchievement
        )
        .reduce((total, item) => total + Number(item || 0), 0),
    };

    let coreBrandRowColors = {
      odd: '#DDEDEA',
      even: '#E5F5F2',
    };
    let otherBrandRowColors = coreBrandRowColors;
    let newBrandRowColors = coreBrandRowColors;

    if (this.state.brandFilter === 'BRAND_SKU') {
      otherBrandRowColors = {
        odd: '#E3F8E5',
        even: '#DBF0DD',
      };
      newBrandRowColors = {
        odd: '#EAEFDE',
        even: '#F2F7E6',
      };
    }

    let index = 0;

    let placeholderRow = [];
    if (!coreBrands.length && !newBrands.length && !otherBrands.length) {
      for (let i = 0; i < PLAHOLDER_ROW_NUMBER; i++) {
        placeholderRow.push(
          <TableRow
            key={i}
            style={{
              ...styles.tableRow,
              backgroundColor: PLACEHOLDER_ROW,
            }}
          >
            <TableRowColumn colSpan={7} style={styles.tableRow} />
          </TableRow>
        );
      }
    }

    return (
      <Widget
        title={title}
        filters={
          <Dropdown
            multiple
            label="Territory"
            options={this._dropdownOptions}
            selectedValue={this.state.selectedTerritory}
            onSelect={(selectedTerritories) =>
              this.setState({selectedTerritory: selectedTerritories})}
          />
        }
      >
        <Persist
          name="SalesPerformanceSceneState"
          data={this.state}
          onMount={(data) => this.setState(data)}
        />
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 4}}>
            <Table
              fixedHeader
              selectable={false}
              style={styles.table}
              wrapperStyle={{display: 'flex', flexDirection: 'column'}}
              bodyStyle={{flexGrow: 1}}
            >
              <TableHeader
                selectable
                displaySelectAll={false}
                adjustForCheckbox={false}
              >
                <TableRow style={styles.titleRow}>
                  <TableHeaderColumn
                    style={{
                      ...styles.titleColumn,
                    }}
                  />
                  <TableHeaderColumn style={{...styles.titleColumn}}>
                    <Text style={{fontStyle: 'italic'}}>in mio stc</Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    style={{...styles.titleColumn, textAlign: 'center'}}
                    colSpan="5"
                  >
                    <Text fontWeight="bold" customStyle="title">
                      Sales Volume
                    </Text>
                  </TableHeaderColumn>
                </TableRow>
                <TableRow
                  style={{
                    height: 24,
                    paddingHorizontal: 2,
                    borderLeft: '1px solid rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <TableHeaderColumn style={styles.header}>
                    <Text customStyle="small" style={styles.headerText}>
                      Brand
                    </Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={styles.header}>
                    <Text customStyle="small" style={styles.headerText}>
                      {'Week ' + currWeek}
                    </Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={styles.header}>
                    <Text customStyle="small" style={styles.headerText}>
                      Var vs. Last 4 Wk
                    </Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={styles.header}>
                    <Text
                      customStyle="small"
                      style={styles.headerText}
                    >{`YTD Wk ${currWeek} - ${currYear}`}</Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={styles.header}>
                    <Text
                      customStyle="small"
                      style={styles.headerText}
                    >{`vs YTD ${currYear - 1}`}</Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={styles.header}>
                    <Text
                      customStyle="small"
                      style={styles.headerText}
                    >{`vs YTD OB ${currYear}`}</Text>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={styles.header}>
                    <Text customStyle="small" style={styles.headerText}>
                      % OB Achv
                    </Text>
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {placeholderRow}
                {coreBrands.map((item, coreBrandIndex) => {
                  index++;
                  return (
                    <TableRow
                      style={{
                        ...styles.tableRow,
                        backgroundColor:
                          index % 2 === 0
                            ? coreBrandRowColors.even
                            : coreBrandRowColors.odd,
                        borderBottom:
                          coreBrandIndex === coreBrands.length - 1
                            ? '1px solid white'
                            : 'none',
                      }}
                      key={index}
                      displayBorder={coreBrandIndex === coreBrands.length - 1}
                    >
                      <TableRowColumn style={{...styles.borderHorizontal}}>
                        <View style={styles.productNameContainer}>
                          <Text customStyle="small" style={styles.productName}>
                            {item ? item.product : ''}
                          </Text>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volCurrentWeek &&
                            String(item.volCurrentWeek).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.volCurrentWeek) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volVariance &&
                            String(item.volVariance).toLowerCase() !==
                              'null' ? (
                              commaSeparator(roundDecimal(item.volVariance))
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volYTD &&
                            String(item.volYTD).toLowerCase() !== 'null' ? (
                              commaSeparator(formatMillion(item.volYTD) || 0)
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volYTDLastYear &&
                            String(item.volYTDLastYear).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.volYTDLastYear) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.objectiveYTD &&
                            String(item.objectiveYTD).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.objectiveYTD) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.objectiveAchievement &&
                            String(item.objectiveAchievement).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.objectiveAchievement) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                    </TableRow>
                  );
                })}
                {otherBrands.map((item, otherBrandIndex) => {
                  index++;
                  let backgroundColor =
                    index % 2 === 0
                      ? otherBrandRowColors.even
                      : otherBrandRowColors.odd;
                  return (
                    <TableRow
                      style={{
                        ...styles.tableRow,
                        backgroundColor,
                        borderBottom:
                          otherBrandIndex === otherBrands.length - 1
                            ? '1px solid white'
                            : 'none',
                      }}
                      key={index}
                      displayBorder={otherBrandIndex === otherBrands.length - 1}
                    >
                      <TableRowColumn
                        style={{...styles.borderHorizontal, width: 100}}
                      >
                        <View style={styles.productNameContainer}>
                          <Text customStyle="small" style={styles.productName}>
                            {item ? item.product : ''}
                          </Text>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volCurrentWeek &&
                            String(item.volCurrentWeek).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.volCurrentWeek) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volVariance &&
                            String(item.volVariance).toLowerCase() !==
                              'null' ? (
                              commaSeparator(roundDecimal(item.volVariance))
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volYTD &&
                            String(item.volYTD).toLowerCase() !== 'null' ? (
                              commaSeparator(formatMillion(item.volYTD) || 0)
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volYTDLastYear &&
                            String(item.volYTDLastYear).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.volYTDLastYear) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.objectiveYTD &&
                            String(item.objectiveYTD).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.objectiveYTD) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.objectiveAchievement &&
                            String(item.objectiveAchievement).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.objectiveAchievement) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                    </TableRow>
                  );
                })}
                {newBrands.map((item, newBrandIndex) => {
                  index++;
                  let backgroundColor =
                    index % 2 === 0
                      ? newBrandRowColors.even
                      : newBrandRowColors.odd;
                  return (
                    <TableRow
                      style={{
                        ...styles.tableRow,
                        backgroundColor,
                        borderBottom:
                          newBrandIndex === newBrands.length - 1
                            ? '1px solid white'
                            : 'none',
                      }}
                      key={index}
                      displayBorder={newBrandIndex === newBrands.length - 1}
                    >
                      <TableRowColumn
                        style={{...styles.borderHorizontal, width: 100}}
                      >
                        <View style={styles.productNameContainer}>
                          <Text customStyle="small" style={styles.productName}>
                            {item ? item.product : ''}
                          </Text>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volCurrentWeek &&
                            String(item.volCurrentWeek).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.volCurrentWeek) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volVariance &&
                            String(item.volVariance).toLowerCase() !==
                              'null' ? (
                              commaSeparator(roundDecimal(item.volVariance))
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volYTD &&
                            String(item.volYTD).toLowerCase() !== 'null' ? (
                              commaSeparator(formatMillion(item.volYTD) || 0)
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.volYTDLastYear &&
                            String(item.volYTDLastYear).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.volYTDLastYear) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.objectiveYTD &&
                            String(item.objectiveYTD).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.objectiveYTD) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                      <TableRowColumn style={styles.borderHorizontal}>
                        <View style={styles.numberContainer}>
                          <EnhancedText style={styles.number}>
                            {item &&
                            item.objectiveAchievement &&
                            String(item.objectiveAchievement).toLowerCase() !==
                              'null' ? (
                              commaSeparator(
                                formatMillion(item.objectiveAchievement) || 0
                              )
                            ) : (
                              NO_VALUE_PLACEHOLDER
                            )}
                          </EnhancedText>
                        </View>
                      </TableRowColumn>
                    </TableRow>
                  );
                })}
                <TableRow
                  displayBorder
                  style={{
                    height: 24,
                    backgroundColor: '#F8F4D1',
                    borderBottom: '1px solid transparent',
                    borderLeft: 0,
                    borderRight: 0,
                  }}
                >
                  <TableRowColumn style={styles.borderHorizontalTotal}>
                    <View style={styles.productNameContainer}>
                      <Text fontWeight="bold" style={styles.productName}>
                        Total
                      </Text>
                    </View>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontalTotal}>
                    <EnhancedText total fontWeight="bold">
                      {commaSeparator(
                        formatMillion(totalCount.volCurrentWeek) || 0
                      )}
                    </EnhancedText>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontalTotal}>
                    <EnhancedText total fontWeight="bold">
                      {commaSeparator(roundDecimal(totalCount.volVariance))}
                    </EnhancedText>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontalTotal}>
                    <EnhancedText total fontWeight="bold">
                      {commaSeparator(formatMillion(totalCount.volYTD) || 0)}
                    </EnhancedText>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontalTotal}>
                    <EnhancedText total fontWeight="bold">
                      {commaSeparator(
                        formatMillion(totalCount.volYTDLastYear) || 0
                      )}
                    </EnhancedText>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontalTotal}>
                    <EnhancedText total fontWeight="bold">
                      {commaSeparator(
                        formatMillion(totalCount.objectiveYTD) || 0
                      )}
                    </EnhancedText>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontalTotal}>
                    <EnhancedText total fontWeight="bold">
                      {commaSeparator(
                        formatMillion(totalCount.objectiveAchievement) || 0
                      )}
                    </EnhancedText>
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </View>
          <View style={{flex: 1}}>
            <View style={styles.dropdownContainer}>
              <View style={styles.dropdownHeader}>
                <Text fontWeight="bold">Category</Text>
              </View>
              <View style={styles.dropdownContent}>
                <RadioButtonGroup
                  defaultSelected="BRAND_FAMILY"
                  onChange={this._setBrandFilter}
                >
                  {RADIO_BUTTON_ITEMS.map((item) => this._radioButtonItem(item))}
                </RadioButtonGroup>
              </View>
            </View>
          </View>
        </View>
      </Widget>
    );
  }
  _setBrandFilter(event: Event, value: BrandFilters) {
    this.setState({
      brandFilter: value,
    });
  }

  _radioButtonItem(item: {value: string; label: string}) {
    let {value, label} = item;
    return (
      <RadioButton
        checkedIcon={
          <Icon
            name="radio-button-checked-black"
            color="black"
            style={{height: 25, width: 25}}
          />
        }
        uncheckedIcon={
          <Icon
            name="radio-button-unchecked-black"
            color="black"
            style={{height: 25, width: 25}}
          />
        }
        value={value}
        label={<Text>{label}</Text>}
      />
    );
  }
}

const styles = {
  header: {
    border: '1px solid white',
    marginTop: 1,
    backgroundColor: LIGHT_GREY,
    textAlign: 'center',
    height: 8,
  },
  dropdownContainer: {
    marginLeft: 30,
    borderTop: '2px solid rgba(0, 0, 0, 0.3)',
    borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
  },
  dropdownContent: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
  },
  dropdownHeader: {
    height: 30,
    backgroundColor: LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
  },
  table: {
    flex: 1,
    minWidth: 700,
    backgroundColor: 'transparent',
    borderLeft: '1px solid rgba(0, 0, 0, 0.0)',
    borderRight: '1px solid rgba(0, 0, 0, 0.0)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
  },
  tableRow: {
    height: 20,
  },
  borderHorizontal: {
    borderLeft: '1px solid white',
    borderRight: '1px solid white',
    textAlign: 'center',
    height: 10,
  },
  borderHorizontalTotal: {
    borderLeft: '1px solid white',
    borderRight: '1px solid white',
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    height: 10,
  },
  titleRow: {
    height: 'auto',
    padding: 0,
    backgroundColor: 'transparent',
    border: '1px solid transparent',
  },
  titleColumn: {
    height: 'auto',
    margin: 0,
    padding: 0,
    borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
  },
  headerText: {
    alignSelf: 'center',
  },
  productNameContainer: {
    width: 90,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  productName: {
    textAlign: 'left',
  },
  numberContainer: {
    width: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  number: {
    textAlign: 'right',
  },
};

function mapStateToProps(state: RootState) {
  return {
    data: state.imsComparisonState.imsComparisonData,
    isLoading: state.imsComparisonState.isImsComparisonWidgetLoading,
    // territory: 'National', // TODO: GET THIS FROM STATE AND IT'S SHOULD BE Indonesia not National
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchIMSComparisonData() {
      dispatch({type: 'FETCH_IMS_COMPARISON_DATA_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SalesPerformanceScene
);
