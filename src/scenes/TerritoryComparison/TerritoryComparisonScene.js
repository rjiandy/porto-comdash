// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {StyleSheet} from 'react-primitives';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {map, uniq, filter} from 'ramda';

import {
  View,
  Text,
  LoadingIndicator,
  Dropdown,
  ErrorComponent,
} from '../../general/components/coreUIComponents';
import Widget from '../../general/components/Widget';
import Persist from '../../general/components/Persist';
import ContentOption from './components/ContentOption';
import {PlaceholderView} from '../../general/components/UIComponents';
import TerritoryComparisonTree from './TerritoryComparisonTreeView';
import commaSeparator from '../../general/helpers/commaSeparator';

import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';
import type {TerritoryComparison} from './types/TerritoryComparison-type';

type State = {
  selectedCategory: string;
  categoryList: Array<string>;
  selectedProduct: string;
  productList: Array<string>;
  selectedZoneMode: string;
  volumeModeList: Array<string>;
  selectedVolumeMode: string;
  sumValueTY: number;
  sumValuePCT: number;
};

type Props = {
  fetchTerritoryComparison: () => void;
  title: string;
  selectedBrandFamily: string;
  territoryComparison: Array<TerritoryComparison>;
  isLoading: boolean;
  error: ?Error;
  access: string;
  zoneModeList: Array<string>;
  screenWidth: number;
  screenHeight: number;
};

class TerritoryComparisonScene extends Component {
  state: State;
  props: Props;
  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedCategory: '',
      categoryList: [],
      selectedProduct: '',
      productList: [],
      selectedZoneMode: '',
      volumeModeList: ['VOL', 'SOM'],
      selectedVolumeMode: 'VOL',
      sumValueTY: 0,
      sumValuePCT: 0,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    let {territoryComparison, selectedBrandFamily} = nextProps;
    let {selectedCategory} = this.state;
    if (territoryComparison.length !== this.props.territoryComparison.length) {
      this.setState({
        productList: this._getProductList(
          selectedCategory,
          selectedBrandFamily,
        ),
        categoryList: this._getCategoryList(territoryComparison),
      });
    }
    if (selectedBrandFamily !== this.props.selectedBrandFamily) {
      this.setState({
        productList: this._getProductList(
          selectedCategory,
          selectedBrandFamily,
        ),
        selectedProduct: '',
        sumValueTY: 0,
        sumValuePCT: 0,
        categoryList: this._getCategoryList(territoryComparison),
      });
    }
  }

  componentWillMount() {
    let {
      territoryComparison,
      zoneModeList,
      fetchTerritoryComparison,
    } = this.props;
    if (territoryComparison.length === 0) {
      fetchTerritoryComparison();
    }
    if (!this.state.selectedZoneMode) {
      this.setState({
        selectedZoneMode: zoneModeList && zoneModeList[0],
      });
    }
  }

  render() {
    let {
      selectedCategory,
      categoryList,
      selectedProduct,
      productList,
    } = this.state;
    let {title} = this.props;
    return (
      <Widget
        title={title}
        filters={
          <View style={styles.filterContentDropDown}>
            <View style={styles.rightPadding}>
              <Dropdown
                label="Category"
                selectedValue={selectedCategory}
                onSelect={this._onCategorySelected}
                options={categoryList}
              />
            </View>
            <View>
              <Dropdown
                label="Product"
                selectedValue={selectedProduct}
                onSelect={this._onProductSelected}
                options={productList}
              />
            </View>
          </View>
        }
      >
        <Persist
          name="territoryComparisonState"
          data={this.state}
          onMount={(data) => this.setState(data)}
        />
        {this._renderContent()}
        {this._renderButtonMenu()}
      </Widget>
    );
  }

  _renderContent() {
    let {selectedCategory, selectedProduct, productList} = this.state;
    let {isLoading, error, territoryComparison} = this.props;
    let territoryData = this._formatTerritoryComparisonData(
      territoryComparison,
    );
    if (isLoading) {
      return <LoadingIndicator />;
    } else if (error) {
      return (
        <ErrorComponent
          errorMessage={error.message}
          url="/TerritoryComparisonData"
        />
      );
    } else if (!selectedCategory && !selectedProduct) {
      return <PlaceholderView text="Please choose Category" />;
    } else if (productList.length === 0) {
      return <PlaceholderView text="Data not available" />;
    } else if (!selectedProduct) {
      return <PlaceholderView text="Please select Product" />;
    } else if (territoryData.length === 0) {
      return <PlaceholderView text="Data not available" />;
    } else {
      return this._renderTreeComparison(territoryData);
    }
  }

  _renderButtonMenu() {
    let {
      selectedZoneMode,
      volumeModeList,
      selectedVolumeMode,
      sumValueTY,
      sumValuePCT,
    } = this.state;
    let {isLoading, error, zoneModeList} = this.props;
    if (isLoading || error) {
      return null;
    }
    return (
      <View style={styles.buttomContent}>
        <View style={[styles.toggleContentContainer, styles.shadowBox]}>
          <ContentOption
            selectedZoneMode={selectedZoneMode}
            zoneModeList={zoneModeList || []}
            onZoneChange={this._onZoneChange}
            selectedVolumeMode={selectedVolumeMode}
            volumeModeList={volumeModeList}
            onVolumeModeChange={this._onVolumeModeChange}
          />
        </View>
        <View
          style={[
            styles.informationBox,
            {marginHorizontal: 10},
            styles.shadowBox,
          ]}
        >
          <Text style={{fontSize: 32}}>{commaSeparator(sumValueTY)}</Text>
          <Text style={{fontSize: 16}}>Mio Stc</Text>
        </View>
        <View style={[styles.informationBox, styles.shadowBox]}>
          <Text style={{fontSize: 32}}>{sumValuePCT}%</Text>
          <Text style={{fontSize: 16}}>Share of Market</Text>
        </View>
      </View>
    );
  }

  _renderTreeComparison(data) {
    let {screenWidth, screenHeight} = this.props;
    return (
      <View style={styles.flex}>
        <View style={[styles.flex, styles.territoryContent, styles.shadowBox]}>
          <TerritoryComparisonTree
            data={data}
            width={screenWidth}
            height={screenHeight}
            dataKey="valueTY"
          />
        </View>
      </View>
    );
  }

  _onZoneChange(selectedZoneMode: string) {
    this.setState({selectedZoneMode});
  }

  _onVolumeModeChange(selectedVolumeMode: string) {
    this.setState({selectedVolumeMode});
  }

  _onCategorySelected(newCategory: string) {
    let {selectedBrandFamily} = this.props;
    this.setState({
      selectedCategory: newCategory,
      productList: this._getProductList(newCategory, selectedBrandFamily),
      selectedProduct: '',
      sumValueTY: 0,
      sumValuePCT: 0,
    });
  }

  _onProductSelected(newProduct: string) {
    let {sumValuePCT, sumValueTY} = this._getSumvalueTYandPCT(newProduct);
    this.setState({
      selectedProduct: newProduct,
      sumValuePCT,
      sumValueTY,
    });
  }

  _getCategoryList(territoryComparisonData: Array<TerritoryComparison>) {
    let categoryList = compose(uniq, map((data) => data.category))(
      territoryComparisonData,
    );

    return categoryList;
  }

  _getProductList(selectedCategory, selectedBrandFamily) {
    let {territoryComparison} = this.props;
    let sortByBrandFamily = (data) => {
      return data.sort(
        (a, b) => a.sortOrderBrandFamily - b.sortOrderBrandFamily,
      );
    };
    let productList = compose(
      uniq,
      map((data) => data.product),
      sortByBrandFamily,
      filter(
        (territoryData) =>
          territoryData.category === selectedCategory &&
          (selectedCategory !== 'BRAND_FAMILY' && selectedCategory !== 'HMS'
            ? !selectedBrandFamily ||
              territoryData.brandFamily === selectedBrandFamily
            : true),
      ),
    )(territoryComparison);
    return productList;
  }

  _formatTerritoryComparisonData(
    territoryComparisonData: Array<TerritoryComparison>,
  ) {
    let {
      selectedCategory,
      selectedProduct,
      selectedZoneMode,
      selectedVolumeMode,
    } = this.state;

    let filterMode = filter(
      (data: TerritoryComparison) =>
        data.category === selectedCategory &&
        data.product === selectedProduct &&
        data.itemType === selectedVolumeMode &&
        data.territoryLevel === selectedZoneMode,
    );

    let mapMode = map((data: TerritoryComparison) => ({
      ...data,
      name: data.territory,
      // valuePCT: Math.abs(data.valuePCT),
      // isNegativePCT: data.valuePCT < 0,
    }));

    let sortData = (data) => data.sort((a, b) => b.valueTY - a.valueTY);

    return compose(sortData, mapMode, filterMode)(territoryComparisonData);
  }

  _getSumvalueTYandPCT(selectedProduct: string) {
    let {territoryComparison} = this.props;
    let {selectedCategory, selectedVolumeMode, selectedZoneMode} = this.state;

    let isDataSelected = (data: TerritoryComparison) =>
      data.category === selectedCategory &&
      data.product === selectedProduct &&
      data.itemType === selectedVolumeMode &&
      data.territoryLevel === selectedZoneMode &&
      data.valuePCT !== 'NULL' &&
      data.valueTY !== 'NULL';

    let computedData = (data: Array<TerritoryComparison>) => {
      let computedObject = {valueTY: 0, valuePCT: 0};
      for (let teritoryDatum of data) {
        if (isDataSelected(teritoryDatum)) {
          computedObject.valueTY += teritoryDatum.valueTY;
          computedObject.valuePCT += teritoryDatum.valuePCT;
        }
      }
      return computedObject;
    };

    let {valueTY, valuePCT} = computedData(territoryComparison);
    return {
      sumValueTY: Number(valueTY.toFixed(0)),
      sumValuePCT: Number(valuePCT.toFixed(0)),
    };
  }
}

let styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  territoryContent: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ecf0f1',
  },

  buttomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  toggleContentContainer: {
    flex: 1,
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: 'center',
    height: 100,
  },
  filterContentView: {},
  informationBoxContainer: {},
  informationBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    minWidth: 100,
    height: 100,
  },
  shadowBox: {
    borderColor: '#ecf0f1',
    borderWidth: 1,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  filterContentDropDown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  rightPadding: {
    paddingRight: 15,
  },
});

function mapStateToProps(state: RootState) {
  let {territoryComparison, isLoading, error} = state.territoryComparisonState;
  let {selectedBrandFamily} = state.globalFilter;
  let {height, width} = state.windowSize;
  let {user} = state.currentUser;
  let zoneModeList =
    user && user.userTerritoryLevel && getZoneMode(user.userTerritoryLevel);
  let access = user && user.position.toLowerCase();
  return {
    selectedBrandFamily,
    territoryComparison,
    isLoading,
    error,
    screenHeight: height,
    screenWidth: width,
    zoneModeList,
    access,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchTerritoryComparison: () => {
      dispatch({type: 'FETCH_TERRITORY_COMPARISON_REQUESTED'});
    },
  };
}

function getZoneMode(userTerritoryLevel) {
  switch (userTerritoryLevel.toUpperCase()) {
    case 'INDONESIA': {
      return ['ZONE', 'REGION', 'AREA'];
    }
    case 'ZONE': {
      return ['REGION', 'AREA'];
    }
    case 'REGION': {
      return ['AREA'];
    }
    default: {
      return [];
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  TerritoryComparisonScene,
);
