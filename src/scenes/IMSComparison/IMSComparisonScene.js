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

import {
  View,
  Text,
  Dropdown,
  LoadingIndicator,
  ErrorComponent,
} from '../../general/components/coreUIComponents';
import {Widget} from '../../general/components/UIComponents.js';
import {PlaceholderView} from '../../general/components/UIComponents';
import Persist from '../../general/components/Persist';
import commaSeparator from '../../general/helpers/commaSeparator';
import roundDecimal from '../../general/helpers/roundDecimal';

import {LIGHT_GREY} from '../../general/constants/colors';

import type {
  IMSComparisonDatum,
  BrandFilters,
} from './types/IMSComparison-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

import EnhancedText from './helpers/EnhancedText';
import getWeek from '../../general/helpers/getWeek';

import {CORE_BRAND, OTHER_BRAND, NEW_BRAND} from './constants/BrandType';

const BRAND_COLOR = {
  coreBrand: {
    main: '#E5F5F2',
    shade: '#DDEDEA',
  },
  otherBrand: {
    main: '#E3F8E5',
    shade: '#DBF0DD',
  },
  newBrand: {
    main: '#F2F7E6',
    shade: '#EAEFDE',
  },
};

type BrandCategories = 'BRAND' | 'BRAND_FAMILY' | 'BRAND_VARIANT' | 'BRAND_SKU';

type Props = {
  title: string;
  isLoading: boolean;
  error: ?Error;
  fetchIMSComparisonData: () => null;
  data: Array<IMSComparisonDatum>;
  selectedBrandFamily: string;
};
type State = {
  selectedBrandCategory: BrandCategories;
  brandCategories: Array<{value: BrandCategories; text: string}>;
  selectedProduct: string;
  productList: Array<string>;
  selectedTerritories: Array<string>;
  territoryList: Array<string>;
};

export class IMSComparisonScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedBrandCategory: 'BRAND_FAMILY',
      brandCategories: [
        {value: 'BRAND', text: 'Brand'},
        {value: 'BRAND_FAMILY', text: 'Brand Family'},
        {value: 'BRAND_VARIANT', text: 'Brand Variant'},
        {value: 'BRAND_SKU', text: 'Brand SKU'},
      ],
      selectedProduct: '',
      productList: [],
      selectedTerritories: [],
      territoryList: [],
    };
  }

  componentWillMount() {
    let {data, selectedBrandFamily, fetchIMSComparisonData} = this.props;
    if (data.length === 0) {
      fetchIMSComparisonData();
    } else {
      this._initiateFilters(data, selectedBrandFamily);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let oldProps = this.props;
    let {data, selectedBrandFamily} = nextProps;
    if (
      data.length !== oldProps.data.length ||
      selectedBrandFamily !== oldProps.selectedBrandFamily
    ) {
      this._initiateFilters(data, selectedBrandFamily);
    }
  }

  _initiateFilters(
    data: Array<IMSComparisonDatum>,
    selectedBrandFamily: string,
  ) {
    let {selectedBrandCategory} = this.state;
    let filteredByCategory = data.filter(
      ({category}) => selectedBrandCategory === category,
    );
    let sortByCompany = (a, b) => a.sortOrderCompany - b.sortOrderCompany;
    let sortOrderByTerritory = (a, b) =>
      a.sortOrderTerritory - b.sortOrderTerritory;
    let productList = new Set();
    for (let {brandFamily, product} of filteredByCategory.sort(sortByCompany)) {
      if (selectedBrandFamily && selectedBrandCategory !== 'BRAND_FAMILY') {
        if (brandFamily === selectedBrandFamily) {
          productList.add(product);
        }
      } else {
        productList.add(product);
      }
    }
    let selectedProduct = [...productList][0];
    let territoryList = new Set(
      filteredByCategory
        .filter(({product}) => product === selectedProduct)
        .sort(sortOrderByTerritory)
        .map(({territory}) => territory),
    );
    this.setState({
      productList: [...productList],
      selectedProduct,
      territoryList: [...territoryList],
      selectedTerritories: [],
    });
  }

  _getTerritoryList(filterProduct: string, filterCategory: BrandFilters) {
    if (this.props.data.length > 0) {
      let {data} = this.props;
      let filteredData = data.filter(
        ({product, category}) =>
          product === filterProduct && category === filterCategory,
      );
      let territoryList = new Set(
        filteredData
          .sort((a, b) => a.sortOrderTerritory - b.sortOrderTerritory)
          .map(({territory}) => territory),
      );
      return [...territoryList];
    } else {
      return [];
    }
  }
  _getProductList(filterCategory: string) {
    let {data, selectedBrandFamily} = this.props;
    if (data.length > 0) {
      let filteredByCategory = data.filter(
        ({category, brandFamily}) =>
          filterCategory === category &&
          (filterCategory !== 'BRAND_FAMILY'
            ? !selectedBrandFamily || brandFamily === selectedBrandFamily
            : true),
      );
      let productList = new Set(
        filteredByCategory
          .sort((a, b) => a.sortOrderCompany - b.sortOrderCompany)
          .map(({product}) => product),
      );
      return [...productList];
    } else {
      return [];
    }
  }

  _renderPlaceholder() {
    let {selectedBrandCategory, selectedProduct} = this.state;
    let placeholderContent = !selectedBrandCategory
      ? 'Category'
      : !selectedProduct ? 'Product' : 'Territory(es)';
    return <PlaceholderView text={`Please select ${placeholderContent}`} />;
  }

  _renderContent() {
    let currWeek = getWeek(new Date());
    let currYear = new Date().getFullYear();
    let currData = this.props.data
      ? this.props.data.filter(
          ({category}) => this.state.selectedBrandCategory === category,
        )
      : [];
    let {selectedTerritories} = this.state;
    let filteredData = selectedTerritories.map((territory) => {
      return currData.find((data) => data.territory === territory) || {};
    });
    // let totalCount = {
    //   volCurrentWeek: filteredData
    //     .map(({volCurrentWeek}) => volCurrentWeek)
    //     .reduce((total, item) => total + Number(item), 0),
    //   volVariance: filteredData
    //     .map(({volVariance}) => volVariance)
    //     .reduce((total, item) => total + Number(roundDecimal(item)), 0),
    //   volYTD: filteredData
    //     .map(({volYTD}) => volYTD)
    //     .reduce((total, item) => total + Number(item), 0),
    //   volYTDLastYear: filteredData
    //     .map(({volYTDLastYear}) => volYTDLastYear)
    //     .reduce((total, item) => total + Number(item), 0),
    // };

    return (
      <View style={{flex: 1}}>
        <Table selectable={false} bodyStyle={styles.table} style={styles.table}>
          <TableHeader
            displaySelectAll={false}
            selectable
            adjustForCheckbox={false}
          >
            <TableRow style={styles.titleRow}>
              <TableHeaderColumn
                style={{
                  ...styles.titleColumn,
                  // I don't know why paddingLeft nor paddingRight is not working here
                  padding: '0px 24px 0px 24px',
                  width: 100,
                }}
              />
              <TableHeaderColumn
                style={{...styles.titleColumn, paddingTop: 24}}
              >
                <Text style={{fontStyle: 'italic'}}>mio stc</Text>
              </TableHeaderColumn>
              <TableHeaderColumn
                style={{...styles.titleColumn, textAlign: 'center'}}
                colSpan="3"
              >
                <Text fontWeight="bold" customStyle="title">
                  Sales Volume
                </Text>
              </TableHeaderColumn>
            </TableRow>
            <TableRow displayBorder style={{height: 24}}>
              <TableHeaderColumn
                style={{
                  ...styles.header,
                  width: 100,
                }}
              >
                <Text customStyle="small" styles={styles.headerText}>
                  Territory
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
              <TableHeaderColumn style={{...styles.header}}>
                <Text
                  customStyle="small"
                  style={styles.headerText}
                >{`vs YTD ${currYear - 1}`}</Text>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {filteredData.map((item, index) => {
              let backgroundColor =
                item.brandType === CORE_BRAND
                  ? BRAND_COLOR.coreBrand
                  : item.brandType === OTHER_BRAND
                    ? BRAND_COLOR.otherBrand
                    : item.brandType === NEW_BRAND
                      ? BRAND_COLOR.newBrand
                      : {main: '#F5F5F5', shade: '#E7E7E7'};
              return (
                <TableRow
                  style={{
                    height: 20,
                    backgroundColor:
                      index % 2 === 0
                        ? backgroundColor.main
                        : backgroundColor.shade,
                    borderBottom:
                      index === filteredData.length - 1
                        ? '1px solid white'
                        : 'none',
                  }}
                  key={index}
                  displayBorder={index === filteredData.length - 1}
                >
                  <TableRowColumn
                    style={{
                      ...styles.borderHorizontal,
                      width: 100,
                      backgroundColor: '#DEEAF6',
                      borderLeft: '1px solid transparent',
                    }}
                  >
                    <Text customStyle="small">
                      {item ? item.territory : ''}
                    </Text>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontal}>
                    <EnhancedText>
                      {item &&
                      item.volCurrentWeek &&
                      String(item.volCurrentWeek).toLowerCase() !== 'null'
                        ? commaSeparator(item.volCurrentWeek || 0)
                        : '-'}
                    </EnhancedText>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontal}>
                    <EnhancedText>
                      {item &&
                      item.volVariance &&
                      String(item.volVariance).toLowerCase() !== 'null'
                        ? roundDecimal(commaSeparator(item.volVariance || 0))
                        : '-'}
                    </EnhancedText>
                  </TableRowColumn>
                  <TableRowColumn style={styles.borderHorizontal}>
                    <EnhancedText>
                      {item &&
                      item.volYTD &&
                      String(item.volYTD).toLowerCase() !== 'null'
                        ? commaSeparator(item.volYTD || 0)
                        : '-'}
                    </EnhancedText>
                  </TableRowColumn>
                  <TableRowColumn
                    style={{
                      ...styles.borderHorizontal,
                      borderRight: 'none',
                    }}
                  >
                    <EnhancedText>
                      {item &&
                      item.volYTDLastYear &&
                      String(item.volYTDLastYear).toLowerCase() !== 'null'
                        ? commaSeparator(item.volYTDLastYear || 0)
                        : '-'}
                    </EnhancedText>
                  </TableRowColumn>
                </TableRow>
              );
            })}
            {/* NOTE: Total hidden by request from Sampoerna */}
            {/* <TableRow
              displayBorder
              style={{
                height: 24,
                backgroundColor: '#F8F4D1',
              }}
            >
              <TableRowColumn
                style={{
                  ...styles.borderHorizontal,
                  width: 100,
                  borderLeft: '1px solid transparent',
                }}
              >
                <Text fontWeight="bold">Total</Text>
              </TableRowColumn>
              <TableRowColumn style={styles.borderHorizontalTotal}>
                <EnhancedText total fontWeight="bold">
                  {commaSeparator(totalCount.volCurrentWeek || 0)}
                </EnhancedText>
              </TableRowColumn>
              <TableRowColumn style={styles.borderHorizontalTotal}>
                <EnhancedText total fontWeight="bold">
                  {roundDecimal(totalCount.volVariance || 0)}
                </EnhancedText>
              </TableRowColumn>
              <TableRowColumn style={styles.borderHorizontalTotal}>
                <EnhancedText total fontWeight="bold">
                  {commaSeparator(totalCount.volYTD || 0)}
                </EnhancedText>
              </TableRowColumn>
              <TableRowColumn
                style={{
                  ...styles.borderHorizontalTotal,
                  borderRight: 'none',
                }}
              >
                <EnhancedText total fontWeight="bold">
                  {commaSeparator(totalCount.volYTDLastYear || 0)}
                </EnhancedText>
              </TableRowColumn>
            </TableRow> */}
          </TableBody>
        </Table>
      </View>
    );
  }

  _renderViewContent() {
    let {isLoading, error} = this.props;
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (error) {
      return (
        <ErrorComponent url="/ImsComparisonData" errorMessage={error.message} />
      );
    }
    let {selectedTerritories} = this.state;
    let isTerritorySelected = selectedTerritories.length > 0;
    return isTerritorySelected
      ? this._renderContent()
      : this._renderPlaceholder();
  }

  render() {
    let {title} = this.props;
    return (
      <Widget
        title={title}
        filters={
          <View style={{flexDirection: 'row'}}>
            <View style={styles.rightMargin}>
              <Dropdown
                label="Category"
                options={this.state.brandCategories}
                onSelect={this._setBrandFilter}
                selectedValue={this.state.selectedBrandCategory}
                disabled={!this.state.brandCategories.length}
                selectionRenderer={(selectedValue) =>
                  (this.state.brandCategories.find(
                    ({value}) => value === selectedValue,
                  ) || {}
                  ).text}
              />
            </View>
            <View style={styles.rightMargin}>
              <Dropdown
                label="Product"
                options={this.state.productList}
                onSelect={this._setProductFilter}
                selectedValue={this.state.selectedProduct}
                disabled={!this.state.productList.length}
              />
            </View>
            <Dropdown
              label="Territory"
              options={this.state.territoryList}
              onSelect={this._setTerritories}
              multiple
              selectedValue={this.state.selectedTerritories}
              disabled={!this.state.territoryList.length}
            />
          </View>
        }
      >
        <Persist
          name="imsComparisonStateState"
          data={this.state}
          onMount={(data) => this.setState(data)}
        />
        {this._renderViewContent()}
      </Widget>
    );
  }
  _setBrandFilter(value: BrandFilters) {
    let productList = this._getProductList(value);
    let selectedProduct = productList[0];
    this.setState({
      selectedBrandCategory: value,
      selectedTerritories: [],
      productList,
      selectedProduct,
      territoryList: this._getTerritoryList(selectedProduct, value),
    });
  }
  _setProductFilter(value: string) {
    this.setState({
      selectedProduct: value,
      selectedTerritories: [],
      territoryList: this._getTerritoryList(
        value,
        this.state.selectedBrandCategory,
      ),
    });
  }
  _setTerritories(value: Array<string>) {
    this.setState({
      selectedTerritories: value,
    });
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
  dropdownContent: {
    paddingTop: 8,
    paddingLeft: 20,
  },
  dropdownHeader: {
    height: 44,
    backgroundColor: LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    flex: 1,
    minWidth: 700,
    maxHeight: 400,
    backgroundColor: 'transparent',
    borderHorizontal: '1px solid rgba(0, 0, 0, 0.3)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
  },
  borderHorizontal: {
    borderLeft: '1px solid white',
    borderRight: '1px solid white',
    borderBottom: '1px solid transparent',
    textAlign: 'center',
    height: 10,
  },
  borderHorizontalTotal: {
    borderLeft: '1px solid white',
    borderRight: '1px solid white',
    borderBottom: '1px solid transparent',
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    height: 10,
  },
  titleRow: {
    height: 30,
    backgroundColor: 'transparent',
    border: '1px solid transparent',
  },
  titleColumn: {
    height: 20,
    margin: 0,
    padding: 0,
    borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
  },
  headerText: {
    alignSelf: 'center',
  },
  rightMargin: {
    marginRight: 15,
  },
};

function mapStateToProps(state: RootState) {
  let {
    imsComparisonData,
    isImsComparisonWidgetLoading,
    error,
  } = state.imsComparisonState;
  return {
    data: imsComparisonData,
    isLoading: isImsComparisonWidgetLoading,
    error,
    selectedBrandFamily: state.globalFilter.selectedBrandFamily,
  };
}
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchIMSComparisonData() {
      dispatch({type: 'FETCH_IMS_COMPARISON_DATA_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IMSComparisonScene);
