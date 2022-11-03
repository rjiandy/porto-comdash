// @flow
import React, {Component} from 'react';
import autobind from 'class-autobind';
import {StyleSheet} from 'react-primitives';
import {connect} from 'react-redux';

import {
  View,
  LoadingIndicator,
  Dropdown,
  ErrorComponent,
} from '../../general/components/coreUIComponents';
import {
  Widget,
  PlaceholderView,
} from '../../general/components/UIComponents.js';
import Persist from '../../general/components/Persist';
import {PLACEHOLDER_TEXT_COLOR} from '../../general/constants/colors.js';
import groupDataByKeyToMap from '../../general/helpers/groupDataByKeyToMap';
import SalesGrowthChart from './charts/SalesGrowthChart';
import SKUTable from './charts/SKUTable';

import type {Sales, SalesGrowth, RspWsp} from './LandingPage-types';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type Props = {
  title: string;
  sales: Array<Sales>;
  salesGrowth: Array<SalesGrowth>;
  rspWsp: Array<RspWsp>;
  isLoading: boolean;
  windowWidth: number;
  fetchTerritoryManagerData: () => void;
  access?: string;
  brandAccess: string;
  territoryAccess: string;
  error: ?Error;
};

type State = {
  selectedTerritory: string;
  selectedProduct: string;
  territoryOptions: Array<string>;
  productOptions: Array<string>;
};

const DESKTOP_WIDTH = 1280;
const MINIMUM_ROW_DESKTOP = 5;
const MINIMUM_ROW_IPAD = 4;

class LandingPageBrandTerritory extends Component {
  props: Props;
  state: State;
  _selectedBrandSku: string;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedTerritory: '',
      selectedProduct: '',
      territoryOptions: [],
      productOptions: [],
    };
  }

  componentWillMount() {
    let {sales, fetchTerritoryManagerData} = this.props;
    if (sales.length === 0) {
      fetchTerritoryManagerData();
    } else {
      this._initiateFilters(this.props);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let oldProps = this.props;
    let {sales, territoryAccess, brandAccess} = nextProps;
    let {selectedTerritory, selectedProduct} = this.state;
    if (
      oldProps.sales.length !== sales.length ||
      (oldProps.territoryAccess !== territoryAccess &&
        selectedTerritory !== territoryAccess) ||
      (oldProps.brandAccess !== brandAccess && selectedProduct !== brandAccess)
    ) {
      this._initiateFilters(nextProps);
    }
  }

  _initiateFilters(
    props: Props,
    selectedTerritory?: string,
    selectedProduct?: string,
  ) {
    let {sales, territoryAccess, brandAccess} = props;
    let territoryListArray = [];
    let productListArray = [];
    let forEachFn = ({
      territory,
      brandFamily,
      sortOrderBrandFamily,
      sortOrderTerritory,
    }) => {
      territoryListArray.push({territory, sortOrderTerritory});
      if (brandFamily) {
        productListArray.push({brandFamily, sortOrderBrandFamily});
      }
    };

    sales.forEach(forEachFn);

    let territoryList = new Set(
      territoryListArray
        .sort((a, b) => a.sortOrderTerritory - b.sortOrderTerritory)
        .map(({territory}) => territory),
    );

    let productList = new Set(
      productListArray
        .sort((a, b) => a.sortOrderBrandFamily - b.sortOrderBrandFamily)
        .map(({brandFamily}) => brandFamily),
    );

    let newTerritory;
    let newProduct;
    if (selectedTerritory) {
      newTerritory = selectedTerritory;
    } else {
      newTerritory = this.state.selectedTerritory;
      if (newTerritory !== territoryAccess) {
        newTerritory = territoryAccess;
      }
    }
    if (selectedProduct) {
      newProduct = selectedProduct;
    } else {
      newProduct = this.state.selectedProduct;
      if (newProduct !== brandAccess) {
        newProduct = brandAccess;
      }
    }
    this.setState({
      territoryOptions: [...territoryList],
      productOptions: [...productList],
      selectedTerritory: newTerritory,
      selectedProduct: newProduct,
    });
  }

  render() {
    let {isLoading, error, windowWidth, title, access} = this.props;
    let {selectedTerritory, selectedProduct} = this.state;
    let content;
    if (isLoading) {
      content = <LoadingIndicator />;
    } else if (error) {
      content = (
        <ErrorComponent
          url={'/LandingPageTerritoryBrandData'}
          errorMessage={error.message}
        />
      );
    } else if (!selectedTerritory) {
      content = <PlaceholderView text="Please select Territory" />;
    } else if (!selectedProduct) {
      content = <PlaceholderView text="Please select Product" />;
    } else {
      let tableDataGroup = this._setTableDataGroup();
      if (windowWidth < DESKTOP_WIDTH) {
        content = (
          <View style={styles.container}>
            {this._renderSalesGrowth('upper')}
            <SKUTable
              showRSP
              dataSource={tableDataGroup}
              placeholderRowNumber={MINIMUM_ROW_IPAD}
              access={access}
            />
          </View>
        );
      } else {
        content = (
          <View style={styles.container}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <SKUTable
                showRSP
                dataSource={tableDataGroup}
                showPlaceholderRow
                placeholderRowNumber={MINIMUM_ROW_DESKTOP}
                access={access}
              />
              {this._renderSalesGrowth('side')}
            </View>
          </View>
        );
      }
    }
    return (
      <Widget title={title} filters={this._renderFilterTerritoryAndProduct()}>
        <Persist
          name="landingPageBrandTerritoryState"
          data={{
            state: this.state,
            oldProps: {
              territoryAccess: this.props.territoryAccess,
              brandAccess: this.props.brandAccess,
            },
          }}
          onMount={({state, oldProps}) => {
            let {territoryAccess, brandAccess} = this.props;
            let selectedTerritory = state.selectedTerritory;
            let selectedProduct = state.selectedProduct;
            if (
              territoryAccess !== oldProps.territoryAccess &&
              territoryAccess !== state.selectedTerritory
            ) {
              selectedTerritory = territoryAccess;
            }

            if (
              brandAccess !== oldProps.brandAccess &&
              brandAccess !== state.selectedProduct
            ) {
              selectedProduct = brandAccess;
            }
            this._initiateFilters(
              this.props,
              selectedTerritory,
              selectedProduct,
            );
          }}
        />
        {content}
      </Widget>
    );
  }

  _setTableDataGroup() {
    let {sales, rspWsp, access} = this.props;
    let {selectedTerritory, selectedProduct} = this.state;
    let filteredSalesData = sales.filter(
      ({territory, brandFamily, product, brand}) => {
        let filterValue =
          territory === selectedTerritory &&
          (brandFamily === selectedProduct || product === selectedProduct);

        /*
          Regularly, the data that consist of brand SKU is characterized by double dash (--) in the first index of its name
          But, there is some exception when the product is All Brand, there is no double dash
          So, I put this additional filter and only applied if the value of selectedProduct in local widget filter is not All Brand
        */
        if (access === 'territory' && selectedProduct !== 'HMS') {
          return (
            filterValue &&
            !brand.includes('--') &&
            !brand.includes('-') &&
            brand !== selectedProduct
          ); // only brandSKU
        }
        return filterValue;
      },
    );
    // .map((salesData) => ({
    //   ...salesData,
    //   brand: salesData.brand.replace(/-/g, ''),
    // }));

    let filteredRswpWsp = rspWsp.filter(
      ({territory}) => territory === selectedTerritory,
    );

    let tableDataGroup = new Map();
    for (let [key, value] of groupDataByKeyToMap(
      [...filteredSalesData],
      'brand',
    )) {
      let rspWspData = filteredRswpWsp.filter(
        ({brandSku}) => brandSku.replace(/\s+/, '') === key, // remove empty string from data. TODO: remove this when the data fixed
      );

      tableDataGroup.set(key, {
        salesData: value,
        rspWspData: rspWspData.length > 0 ? rspWspData[0] : null,
      });
    }
    let newFormat = [];
    for (let [key, value] of tableDataGroup) {
      newFormat.push({
        key: key,
        value: value,
      });
    }
    let sortedNewFormat = newFormat.sort((a, b) => {
      let salesDataA = a.value.salesData;
      let salesDataB = b.value.salesData;
      let sumA = 0;
      let sumB = 0;
      for (let salesData of salesDataA) {
        if (salesData.itemType === 'Sales') {
          sumA = salesData.itemValueWeekOne + salesData.itemValueWeekTwo;
        }
      }
      for (let salesData of salesDataB) {
        if (salesData.itemType === 'Sales') {
          sumB = salesData.itemValueWeekOne + salesData.itemValueWeekTwo;
        }
      }
      return sumB - sumA;
    });
    let sortedTableDataGroup = new Map();
    for (let {key, value} of sortedNewFormat) {
      sortedTableDataGroup.set(key, value);
    }
    return sortedTableDataGroup;
  }

  _renderSalesGrowth(location: 'upper' | 'side' = 'side') {
    let {salesGrowth} = this.props;
    let {selectedTerritory, selectedProduct} = this.state;
    let salesGrowthDataSource = salesGrowth.filter(
      ({product, territory, brandFamily}) =>
        territory === selectedTerritory &&
        (product === selectedProduct &&
          (brandFamily === selectedProduct && brandFamily)),
    );
    return (
      <View style={{flex: location === 'upper' ? 1.8 : 1}}>
        <SalesGrowthChart
          dataSource={salesGrowthDataSource[0] || {}}
          location={location}
          territory={selectedTerritory}
        />
      </View>
    );
  }

  _renderFilterTerritoryAndProduct() {
    let {
      selectedTerritory,
      selectedProduct,
      territoryOptions,
      productOptions,
    } = this.state;
    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <Dropdown
            label="Territory"
            options={territoryOptions}
            selectedValue={selectedTerritory}
            onSelect={(selectedTerritory) => this.setState({selectedTerritory})}
            disabled={territoryOptions.length === 0}
          />
        </View>
        <Dropdown
          label="Product"
          selectedValue={selectedProduct}
          onSelect={(newSelectedBrand) =>
            this.setState({selectedProduct: newSelectedBrand})}
          options={productOptions}
          disabled={productOptions.length === 0}
        />
      </View>
    );
  }

  _onBrandSkuSelected(product: string) {
    this.setState({selectedProduct: product});
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingBottom: 20,
  },
  filterItem: {
    marginRight: 15,
  },
  middleChart: {
    margin: 10,
    flex: 6,
    flexDirection: 'row',
  },
  buttomChart: {
    margin: 10,
    flex: 6,
  },
  rightPadding: {
    paddingRight: 15,
  },
  floatingLabelText: {
    fontSize: 8,
    color: PLACEHOLDER_TEXT_COLOR,
    paddingBottom: 7,
  },
});

export function mapStateToProps(state: RootState) {
  let {
    salesData,
    salesGrowthData,
    rspWspData,
    isLoading,
    error,
  } = state.landingPageBrandTerritoryState;
  let {selectedTerritory, selectedBrandFamily} = state.globalFilter;
  let {user} = state.currentUser;
  let filterFn = (item) => true;
  let userPosition = 'territory';
  if (user) {
    let {territories, position} = user;
    userPosition = position.toLowerCase();
    filterFn = (item) =>
      territories.findIndex((el) => el.territory === item.territory) !== -1;
    // brandFamily.findIndex((el) => el.brandFamily === item.brandFamily) !== -1;
  }
  let filteredRspWsp = rspWspData.filter(filterFn);
  let filteredSales = salesData.filter(filterFn);
  let filteredSalesGrowth = salesGrowthData.filter(filterFn);

  return {
    isLoading,
    error,
    access: userPosition,
    sales: filteredSales,
    salesGrowth: filteredSalesGrowth,
    rspWsp: filteredRspWsp,
    windowWidth: state.windowSize.width,
    brandAccess: selectedBrandFamily || '',
    territoryAccess: selectedTerritory || '',
  };
}
export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchTerritoryManagerData() {
      dispatch({type: 'FETCH_LANDING_PAGE_TERRITORY_REQUESTED'});
    },
  };
}

export function mergeProps(
  stateProps: $Shape<Props>,
  dispatchProps: $Shape<Props>,
  ownProps: $Shape<Props>,
) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  LandingPageBrandTerritory,
);
