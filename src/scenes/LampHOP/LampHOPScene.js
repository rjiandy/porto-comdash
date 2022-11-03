// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';

import {connect} from 'react-redux';
import {StyleSheet} from 'react-primitives';

import Persist from '../../general/components/Persist';
import commaSeparator from '../../general/helpers/commaSeparator';
import convertObjectValueToNumber from '../../general/helpers/convertObjectValueToNumber';
import {Widget} from '../../general/components/UIComponents';
import {
  View,
  Text,
  LoadingIndicator,
  Dropdown,
} from '../../general/components/coreUIComponents';
import LampHOPPieChart from './charts/LampHOPPieChart';

import {THEME_COLOR, LIGHT_GREY} from '../../general/constants/colors';

import type {LampHOP, LampHOPData} from './types/lampHOP-type';
import type {RootState} from '../../general/stores/RootState';
import type {Dispatch} from '../../general/stores/Action';

type Props = {
  title: string;
  data: LampHOPData;
  selectedTerritory: string;
  isLoading: boolean;
  error: ?Error;
  fetchLampHOPData: () => void;
};

type State = {
  selectedBrand: string;
  brandList: Array<string>;
  territoryList: Array<string>;
  selectedTerritory: string;
};

const PIE_CHART_PRODUCT_ITEMTYPE = 'PIE_PRODUCT';
const PIE_CHART_TYPE_ITEMTYPE = 'PIE_TYPE';
const PIE_CHART_SEGMENT_ITEMTYPE = 'PIE_SEGMENT';
const ACTIVATION_ITEMTYPE = 'ACTIVATION';
const AUDIENCE_ITEMTYPE = 'AUDIENCE';
const HOP_ITEMTYPE = 'HOP';
const LAMP_ITEMTYPE = 'LAMP';
const CONSUMER_CONTACT_ITEMTYPE = 'CC';
const EFFECTIVE_CONSUMER_CONTACT_ITEMTYPE = 'ECC';

export class LampHopScene extends Component {
  props: Props;
  state: State;
  _groupedData: Map<string, LampHOPData> = new Map();

  constructor() {
    super(...arguments);
    autobind(this);

    let {selectedTerritory} = this.props;
    this.state = {
      brandList: [],
      selectedBrand: '',
      territoryList: [],
      selectedTerritory,
    };
  }

  componentWillMount() {
    let {data, selectedTerritory, fetchLampHOPData} = this.props;
    if (data.length === 0) {
      fetchLampHOPData();
    } else {
      this._groupedData = this._groupData(data);
      let newBrandList = this._getBrandFilterOptions(data, selectedTerritory);
      let newSelectedBrand = this.state.selectedBrand;
      if (!newBrandList.includes(newSelectedBrand)) {
        newSelectedBrand = '';
      }
      this.setState({
        territoryList: this._getTerritoryFilterOptions(data),
        brandList: this._getBrandFilterOptions(data, selectedTerritory),
        selectedTerritory,
        selectedBrand: newSelectedBrand,
      });
    }
  }

  componentWillReceiveProps(newProps: Props) {
    let oldProps = this.props;
    if (
      oldProps.data.length !== newProps.data.length ||
      oldProps.selectedTerritory !== newProps.selectedTerritory
    ) {
      let {data, selectedTerritory} = newProps;
      this._groupedData = this._groupData(data);
      this.setState({
        territoryList: this._getTerritoryFilterOptions(data),
        brandList: this._getBrandFilterOptions(data, selectedTerritory),
        selectedTerritory,
      });
    }
  }

  _getTerritoryFilterOptions(data: LampHOPData) {
    return [...new Set(data.map((datum) => datum.territory))];
  }

  render() {
    let {title, isLoading} = this.props;
    let {territoryList, selectedTerritory, selectedBrand} = this.state;
    if (isLoading) {
      return (
        <Widget title={title}>
          <LoadingIndicator />
        </Widget>
      );
    }

    let pieProductDataList = this._groupedData.get(PIE_CHART_PRODUCT_ITEMTYPE);
    let pieProductData = [];
    if (pieProductDataList) {
      pieProductData = this._filter(pieProductDataList);
    }

    let pieTypeDataList = this._groupedData.get(PIE_CHART_TYPE_ITEMTYPE);
    let pieTypeData = [];
    if (pieTypeDataList) {
      pieTypeData = this._filter(pieTypeDataList);
    }

    let pieSegmentDataList = this._groupedData.get(PIE_CHART_SEGMENT_ITEMTYPE);
    let pieSegmentData = [];
    if (pieSegmentDataList) {
      pieSegmentData = this._filter(pieSegmentDataList);
    }

    let activationData = this._filter(
      this._groupedData.get(ACTIVATION_ITEMTYPE) || [],
    );
    let activationMeasurement = 0;
    if (activationData.length > 0) {
      activationMeasurement = activationData[0].measure;
    }

    let lampData = this._filter(this._groupedData.get(LAMP_ITEMTYPE) || []);
    let lampMeasurement = 0;
    if (lampData.length > 0) {
      lampMeasurement = lampData[0].measure;
    }

    let hopData = this._filter(this._groupedData.get(HOP_ITEMTYPE) || []);
    let hopMeasurement = 0;
    if (hopData.length > 0) {
      hopMeasurement = hopData[0].measure;
    }

    let audienceData = this._filter(
      this._groupedData.get(AUDIENCE_ITEMTYPE) || [],
    );
    let audienceMeasurement = 0;
    if (audienceData.length > 0) {
      audienceMeasurement = audienceData[0].measure;
    }

    let ccData = this._filter(
      this._groupedData.get(CONSUMER_CONTACT_ITEMTYPE) || [],
    );
    let ccMeasurement = 0;
    if (ccData.length > 0) {
      ccMeasurement = ccData[0].measure;
    }

    let eccData = this._filter(
      this._groupedData.get(EFFECTIVE_CONSUMER_CONTACT_ITEMTYPE) || [],
    );
    let eccMeasurement = 0;
    if (eccData.length > 0) {
      eccMeasurement = eccData[0].measure;
    }

    return (
      <Widget title={title} filters={this._renderFilterTerritoryAndBrand()}>
        <Persist
          name="lampHOPState"
          data={{
            state: this.state,
            oldProps: {
              selectedTerritory: this.props.selectedTerritory,
            },
          }}
          onMount={({state, oldProps}) => {
            let {selectedTerritory, data} = this.props;
            let newState = {...state};
            if (
              selectedTerritory !== oldProps.selectedTerritory &&
              selectedTerritory !== state.selectedTerritory
            ) {
              newState = {
                ...newState,
                selectedTerritory,
              };
            }

            let newBrandList = this._getBrandFilterOptions(
              data,
              newState.selectedTerritory,
            );
            let newSelectedBrand = newState.selectedBrand;
            if (!newBrandList.includes(newSelectedBrand)) {
              newSelectedBrand = '';
            }
            this.setState({
              territoryList: this._getTerritoryFilterOptions(data),
              brandList: newBrandList,
              selectedTerritory: newState.selectedTerritory,
              selectedBrand: newSelectedBrand,
            });
          }}
        />
        <View style={{flex: 1}}>
          <View style={styles.upperSummary}>
            <View>
              <Text style={styles.upperSummaryItemText}>
                {commaSeparator(lampMeasurement)} LAMP
              </Text>
            </View>
            <View>
              <Text style={styles.upperSummaryItemText}>
                {commaSeparator(hopMeasurement)} HOP
              </Text>
            </View>
            <View>
              <Text style={styles.upperSummaryItemText}>
                {commaSeparator(activationMeasurement)} Activation
              </Text>
            </View>
          </View>
          <View style={styles.pieChartContainer}>
            <LampHOPPieChart
              data={pieProductData}
              type="product"
              selectedTerritory={selectedTerritory}
              selectedBrand={selectedBrand}
              territoryList={territoryList}
            />
            <LampHOPPieChart
              data={pieSegmentData}
              type="segment"
              selectedTerritory={selectedTerritory}
              selectedBrand={selectedBrand}
              territoryList={territoryList}
            />
            <LampHOPPieChart
              data={pieTypeData}
              type="type"
              selectedTerritory={selectedTerritory}
              selectedBrand={selectedBrand}
              territoryList={territoryList}
            />
          </View>
          <View style={styles.footerSummary}>
            <View style={styles.footerSummaryItem}>
              <Text style={styles.footerSummaryKey}>Audience</Text>
              <Text style={styles.footerSummaryValue}>
                {commaSeparator(audienceMeasurement)}
              </Text>
            </View>
            <View style={styles.footerSummaryItem}>
              <Text style={styles.footerSummaryKey}>Consumer Contact</Text>
              <Text style={styles.footerSummaryValue}>
                {commaSeparator(ccMeasurement)}
              </Text>
            </View>
            <View style={styles.footerSummaryItem}>
              <Text style={styles.footerSummaryKey}>
                Effective Consumer Contact
              </Text>
              <Text style={styles.footerSummaryValue}>
                {commaSeparator(eccMeasurement)}
              </Text>
            </View>
          </View>
        </View>
      </Widget>
    );
  }

  _groupData(data: LampHOPData) {
    let groupedData = new Map();
    data.forEach((datum) => {
      let convertedDatum = convertObjectValueToNumber(datum, ['measure']);
      let itemTypeData = groupedData.get(convertedDatum.itemType);
      if (itemTypeData) {
        let newListData = [...itemTypeData, convertedDatum];
        groupedData.set(convertedDatum.itemType, newListData);
      } else {
        groupedData.set(convertedDatum.itemType, [convertedDatum]);
      }
    });
    return groupedData;
  }

  _filter(data: Array<LampHOP>) {
    let {selectedBrand, selectedTerritory} = this.state;
    return data.filter(
      (datum) =>
        datum.territory === selectedTerritory &&
        datum.product === (selectedBrand || 'All Brand'), // TODO: maybe HMS?
    );
  }

  _renderFilterTerritoryAndBrand() {
    let {
      selectedTerritory,
      territoryList,
      selectedBrand,
      brandList,
    } = this.state;
    return (
      <View style={styles.filterContainer}>
        <View style={styles.rightPadding}>
          <Dropdown
            label="Territory"
            selectedValue={selectedTerritory}
            onSelect={(selectedTerritory) => {
              let newBrandList = this._getBrandFilterOptions(
                this.props.data,
                selectedTerritory,
              );
              let newSelectedBrand = selectedBrand;
              if (!newBrandList.includes(selectedBrand)) {
                newSelectedBrand = '';
              }
              this.setState({
                selectedTerritory,
                brandList: newBrandList,
                selectedBrand: newSelectedBrand,
              });
            }}
            options={territoryList}
          />
        </View>
        <Dropdown
          label="Product"
          selectedValue={selectedBrand}
          onSelect={(newSelectedBrand) =>
            this.setState({selectedBrand: newSelectedBrand})}
          options={brandList}
        />
      </View>
    );
  }

  _getBrandFilterOptions(lampHopData: LampHOPData, selectedTerritory: string) {
    return [
      ...new Set([
        ...lampHopData
          .filter(
            (data) =>
              data.territory === selectedTerritory &&
              data.product.toLowerCase() !== 'all brand', // TODO: maybe HMS?
          )
          .map((data) => data.product),
      ]),
    ];
  }
}

const styles = StyleSheet.create({
  upperSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 100,
    borderWidth: 5,
    borderColor: THEME_COLOR,
    paddingVertical: 10,
  },
  upperSummaryItemText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  pieChartContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  margin: {
    margin: 5,
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  footerSummaryItem: {
    flex: 1,
    paddingLeft: 30,
  },
  footerSummaryKey: {
    fontSize: 20,
  },
  footerSummaryValue: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  rightPadding: {
    paddingRight: 15,
  },
  noData: {
    flex: 1,
    backgroundColor: LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function mapStateToProps(state: RootState) {
  let {lampHOPState: {data, isLoading, error}, windowSize} = state;
  let {selectedTerritory} = state.globalFilter;
  return {
    data,
    selectedTerritory,
    isLoading,
    error,
    windowWidth: windowSize.width,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    fetchLampHOPData: () => {
      dispatch({
        type: 'FETCH_LAMPHOP_REQUESTED',
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LampHopScene);
