// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {StyleSheet} from 'react-primitives';
import {connect} from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import Persist from '../../general/components/Persist';

import {
  View,
  ScrollView,
  Text,
  Dropdown,
  LoadingIndicator,
} from '../../general/components/coreUIComponents';
import {Widget, PlaceholderView} from '../../general/components/UIComponents';
import {GREY, LINE_CHART_COLORS} from '../../general/constants/colors';
import {SMALL_FONT_SIZE, TITLE_FONT_SIZE} from '../../general/constants/text';

import type {BrandProductImageryData} from './types/BrandProductImagery-type';
import type {RootState} from '../../general/stores/RootState';

type State = {
  productList: Array<string>;
  smokerProfileList: Array<string>;
  selectedProducts: Array<string>;
  selectedSmokerProfile: string;
  territoryList: Array<string>;
  selectedTerritory: string;
};

type Props = {
  title: string;
  brandProductImageryData: BrandProductImageryData;
  isLoading: boolean;
  error: ?Error;
  selectedTerritory: string;
  fetchBrandProductImageryData: () => void;
};

type Payload = {
  dataKey: string;
  color: string;
  payload: Object;
};

type TooltipProps = {
  active: boolean;
  label: string;
  payload: Array<Payload>;
};

export class BrandProductImageryScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      productList: [],
      smokerProfileList: [],
      selectedProducts: [],
      selectedSmokerProfile: '',
      territoryList: [],
      selectedTerritory: this.props.selectedTerritory,
    };
  }

  componentWillMount() {
    let {
      brandProductImageryData,
      fetchBrandProductImageryData,
      selectedTerritory,
    } = this.props;
    if (brandProductImageryData.length === 0) {
      fetchBrandProductImageryData();
    } else {
      this.setState({
        ...this._populateInitialState(
          brandProductImageryData,
          selectedTerritory,
        ),
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let oldProps = this.props;
    let {brandProductImageryData, selectedTerritory} = nextProps;
    if (
      brandProductImageryData.length !==
        oldProps.brandProductImageryData.length ||
      selectedTerritory !== oldProps.selectedTerritory
    ) {
      let newState = this._populateInitialState(
        brandProductImageryData,
        selectedTerritory,
      );

      this.setState({
        ...this._filteredOldStateWithNewState(newState),
      });
    }
  }

  render() {
    let {title, brandProductImageryData, isLoading, error} = this.props;
    let {
      productList,
      smokerProfileList,
      selectedProducts,
      selectedSmokerProfile,
      selectedTerritory,
      territoryList,
    } = this.state;

    let content;
    if (isLoading) {
      content = <LoadingIndicator />;
    } else if (error) {
      // TODO: display something when error != null
    } else if (!selectedTerritory) {
      content = <PlaceholderView text="Please select territory first" />;
    } else if (smokerProfileList.length > 0 && !selectedSmokerProfile) {
      content = <PlaceholderView text="Please select smoker profile" />;
    } else if (productList.length > 0 && selectedProducts.length === 0) {
      content = <PlaceholderView text="Please select product first" />;
    } else {
      let dataMap = new Map();
      let imageries = [];
      if (
        selectedProducts.length > 0 &&
        selectedTerritory &&
        selectedSmokerProfile
      ) {
        let filtered = brandProductImageryData.filter(
          (datum) =>
            datum.itemType === 'BRAND' &&
            datum.territory === selectedTerritory &&
            datum.smokerProfile === selectedSmokerProfile &&
            selectedProducts.includes(datum.product),
        );
        imageries = [...new Set(filtered.map((datum) => datum.imagery))];
        imageries.forEach((imagery) => {
          dataMap.set(
            imagery,
            filtered
              .filter((datum) => datum.imagery === imagery)
              .map(({product, measure, ...others}) => ({
                product,
                [product + 'Measure']: measure,
                ...others,
              })),
          );
        });
      }
      let groupedData = [...dataMap.values()];
      content = (
        <View style={styles.flex}>
          <Text customStyle="title" style={styles.bottomMargin}>
            {selectedTerritory}
          </Text>
          {groupedData.length === 0 &&
          (smokerProfileList.length === 0 || selectedSmokerProfile) &&
          (productList.length === 0 || selectedProducts.length > 0) ? (
            <PlaceholderView
              text={`No data available for territory ${selectedTerritory}`}
            />
          ) : (
            <ScrollView style={styles.flex}>
              <ResponsiveContainer width="100%" height={800}>
                <LineChart
                  layout="vertical"
                  data={groupedData.map((data) => {
                    let joinedData = {};
                    data.forEach((obj) => {
                      joinedData = {...joinedData, ...obj};
                    });
                    return joinedData;
                  })}
                  margin={{top: 15, right: 0, bottom: 15, left: 70}}
                >
                  <XAxis
                    hide
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={false}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    minTickGap={20}
                  />
                  <YAxis
                    dataKey="imagery"
                    type="category"
                    axisLine={false}
                    tick={{fontSize: SMALL_FONT_SIZE, width: 150}}
                    minTickGap={10}
                  />
                  {groupedData.length && (
                    <Tooltip content={this._GenerateTooltip} />
                  )}
                  {selectedProducts.map((product, index) => (
                    <Line
                      key={index}
                      stroke={LINE_CHART_COLORS[index]}
                      dataKey={product + 'Measure'}
                    />
                  ))}
                  <CartesianGrid strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </ScrollView>
          )}
        </View>
      );
    }
    return (
      <Widget
        title={title}
        filters={
          <View style={styles.filterContainer}>
            <View style={styles.rightMargin}>
              <Dropdown
                label="Territory"
                options={territoryList}
                selectedValue={selectedTerritory}
                onSelect={this._onTerritorySelected}
              />
            </View>
            <Dropdown
              label="Smoker Profile"
              options={smokerProfileList}
              selectedValue={selectedSmokerProfile}
              onSelect={this._onSmokerProfileSelected}
              containerStyle={styles.rightMargin}
            />
            <Dropdown
              multiple
              label="Product"
              options={productList}
              selectedValue={selectedProducts}
              onSelect={this._onProductSelected}
            />
          </View>
        }
      >
        <Persist
          data={{
            state: this.state,
            oldProps: {selectedTerritory: this.props.selectedTerritory},
          }}
          onMount={({state, oldProps}) => {
            let {selectedTerritory} = this.props;
            if (
              selectedTerritory !== oldProps.selectedTerritory &&
              selectedTerritory !== state.selectedTerritory
            ) {
              let {
                territoryList,
                selectedSmokerProfile,
                selectedProducts,
              } = state;
              if (territoryList.indexOf(selectedTerritory) < 0) {
                selectedSmokerProfile = '';
                selectedProducts = [];
              }
              this.setState({
                selectedProducts,
                selectedSmokerProfile,
                selectedTerritory,
              });
            } else {
              this.setState(state);
            }
          }}
          name="brandProductImagerySceneState"
        />
        {content}
      </Widget>
    );
  }

  _populateInitialState(
    data: BrandProductImageryData,
    selectedTerritory: string,
  ) {
    let filtered = data.filter((datum) => datum.territory === selectedTerritory);
    let productList = [...new Set(filtered.map((datum) => datum.product))];
    let smokerProfileList = [
      ...new Set(filtered.map((datum) => datum.smokerProfile)),
    ];
    return {
      productList,
      smokerProfileList,
      selectedTerritory,
      selectedSmokerProfile: '',
      selectedProducts: [],
      territoryList: this._getTerritoryList(data),
    };
  }

  _getTerritoryList(data: BrandProductImageryData) {
    return [...new Set(data.map((datum) => datum.territory))];
  }

  _GenerateTooltip(props: TooltipProps) {
    let {selectedProducts} = this.state;
    let {active, payload, label} = props;
    let [data] = payload;
    if (active) {
      return (
        <View style={styles.tooltipContainer}>
          <Text fontWeight="bold" style={{marginBottom: 10}}>
            {label}
          </Text>
          {selectedProducts.map((product, index) => (
            <Text key={index} style={{color: LINE_CHART_COLORS[index]}}>
              {product}: {data.payload[product + 'Measure']}
            </Text>
          ))}
        </View>
      );
    }
    return null;
  }

  _onTerritorySelected(selectedTerritory: string) {
    let newState = this._populateInitialState(
      this.props.brandProductImageryData,
      selectedTerritory,
    );

    this.setState({
      ...this._filteredOldStateWithNewState(newState),
    });
  }

  _filteredOldStateWithNewState(newState: State) {
    let {smokerProfileList} = newState;
    let {selectedProducts, selectedSmokerProfile} = this.state;
    let newSelectedSmokerProfile = selectedSmokerProfile;
    let newSelectedProducts = selectedProducts.filter(
      (product) => this.state.selectedProducts.indexOf(product) > -1,
    );
    if (smokerProfileList.indexOf(newSelectedSmokerProfile) < 0) {
      newSelectedSmokerProfile = '';
      newSelectedProducts = [];
    }

    return {
      ...newState,
      selectedSmokerProfile: newSelectedSmokerProfile,
      selectedProducts: newSelectedProducts,
    };
  }

  _onProductSelected(selectedProducts: Array<string>) {
    this.setState({selectedProducts});
  }

  _onSmokerProfileSelected(selectedSmokerProfile: string) {
    this.setState({selectedSmokerProfile});
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  rightMargin: {
    marginRight: 15,
  },
  bottomMargin: {
    marginBottom: 15,
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderColor: GREY,
    borderWidth: 0.5,
    padding: 10,
  },
  noDataText: {
    fontSize: TITLE_FONT_SIZE,
  },
});

export function mapStateToProps(state: RootState) {
  let {data, isLoading, error} = state.brandProductImageryState;
  let {selectedTerritory} = state.globalFilter;
  return {
    title: 'Brand Product Imagery',
    brandProductImageryData: data,
    isLoading,
    error,
    selectedTerritory,
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchBrandProductImageryData: () => {
      dispatch({type: 'FETCH_BRAND_PRODUCT_IMAGERY_REQUESTED'});
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  BrandProductImageryScene,
);
