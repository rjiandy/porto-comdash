// @flow

import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';

import autobind from 'class-autobind';

import {
  View,
  Text,
  Dropdown,
  TabBar,
  ScrollView,
  LoadingIndicator,
  ErrorComponent,
} from '../../general/components/coreUIComponents';
import {Rectangle} from '../../general/components/shapesComponent';
import {Widget, PlaceholderView} from '../../general/components/UIComponents';
import {RSP_WSP_COLORS, MEDIUM_GREY} from '../../general/constants/colors';

import CanvasPriceStackedBarChart from './charts/CanvasPriceStackedBarChart';
import WspTable from './charts/WspTable';
import Persist from '../../general/components/Persist';
import convertObjectValueToNumber from '../../general/helpers/convertObjectValueToNumber';
import formatMonthDesc from '../../general/helpers/formatMonthDesc';
import commaSeparator from '../../general/helpers/commaSeparator';
import MAX_CANVAS_CHARTS from './maxCanvasCharts';

import type {CanvasDistributionPrice} from './types/CanvasDistributionPrice-type';
import type {Wsp} from './types/Wsp-type';

type State = {
  selectedSurvey: string;
  selectedBrandSku: Array<string>;
  selectedTerritory: string;
  brandSkuList: Array<string>;
  territoryList: Array<string>;
  canvasDistPriceData: Map<string, Array<CanvasDistributionPrice>>;
  wspData: Map<string, Wsp>;
};
type Props = {
  title: string;
  isLoading: boolean;
  error: ?Error;
  selectedTerritory: string;
  selectedBrandFamily: string;
  canvasDistributionPrice: Array<CanvasDistributionPrice>;
  wsp: Array<Wsp>;
};

export default class RspWspBrand extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    this.state = {
      selectedSurvey: 'Pack',
      selectedBrandSku: [],
      selectedTerritory: '',
      brandSkuList: [],
      territoryList: [],
      canvasDistPriceData: new Map(),
      wspData: new Map(),
    };
    autobind(this);
  }

  componentWillMount() {
    let {
      canvasDistributionPrice,
      wsp,
      selectedTerritory,
      selectedBrandFamily,
    } = this.props;
    this._initiateFilters(canvasDistributionPrice, wsp);
    if (selectedTerritory) {
      this._onTerritorySelected(selectedTerritory, selectedBrandFamily);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    let {
      canvasDistributionPrice,
      wsp,
      selectedTerritory,
      selectedBrandFamily,
    } = nextProps;
    if (this.props.wsp.length !== wsp.length) {
      this._initiateFilters(canvasDistributionPrice, wsp);
    }
    if (this.props.selectedBrandFamily !== selectedBrandFamily) {
      this._onTerritorySelected(
        this.state.selectedTerritory,
        selectedBrandFamily,
      );
    }
    if (
      this.props.selectedTerritory !== selectedTerritory &&
      this.state.selectedTerritory !== selectedTerritory
    ) {
      this._onTerritorySelected(selectedTerritory, selectedBrandFamily);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    let {selectedTerritory} = nextProps;
    if (
      this.props.selectedTerritory !== selectedTerritory &&
      this.state.selectedTerritory === selectedTerritory
    ) {
      return false;
    }
    return true;
  }

  _initiateFilters(
    canvasDistributionPrice: Array<CanvasDistributionPrice>,
    wsp: Array<Wsp>,
  ) {
    let territorySet = new Set([
      ...canvasDistributionPrice.map(({territory}) => territory),
      ...wsp.map(({territory}) => territory),
    ]);
    this.setState({territoryList: [...territorySet]});
  }

  _filterData(territory: string, brandSku: Array<string>, survey: string) {
    let {canvasDistributionPrice, wsp} = this.props;
    if (territory && brandSku) {
      let canvasDistPriceData = new Map();
      let wspData = new Map();
      let filteredCanvasData = canvasDistributionPrice.filter(
        (data) =>
          data.territory === territory &&
          brandSku.includes(data.brandSKU.replace(/\s+/, '')) &&
          data.survey.includes(survey),
      );
      brandSku.forEach((brand) => {
        let canvasData = filteredCanvasData
          .filter((datum) => datum.brandSKU.replace(/\s+/, '') === brand)
          .map((datum) => ({
            ...convertObjectValueToNumber(datum, [
              'timeweekID',
              'monthID',
              'distPrice',
              'price',
              'pricePCT',
            ]),
            monthDesc: formatMonthDesc(datum.monthDesc),
          }));
        canvasDistPriceData.set(brand, canvasData);

        let wspDatum = wsp
          // NOTE: only one data will be filtered
          .filter(
            (datum) =>
              datum.territory === territory &&
              datum.brandSKU.replace(/\s+/, '') === brand,
          )
          .map((datum) =>
            convertObjectValueToNumber(datum, [
              'timeweekID',
              'distPriceWSP',
              'canvasPrice',
              'wspPrice',
              'rspPackPrice',
              'rspStickPrice',
              'wspMinPrice',
              'wspMaxPrice',
              'wspAveragePrice',
              'wspPriceTwo',
              'wspPCTPrice',
              'wspPCTPriceTwo',
            ]),
          )
          .pop();
        if (wspDatum) {
          wspData.set(brand, wspDatum);
        }
      });
      return {canvasDistPriceData, wspData};
    } else {
      return {
        canvasDistPriceData: new Map(),
        wspData: new Map(),
      };
    }
  }

  _filterProductList(territory: string, selectedBrandFamily: string) {
    let {canvasDistributionPrice, wsp} = this.props;
    let {selectedSurvey, selectedBrandSku} = this.state;
    let brandSkuSet = new Set();
    canvasDistributionPrice
      .filter(
        (data) =>
          data.territory === territory &&
          data.survey.includes(selectedSurvey) &&
          (!selectedBrandFamily ||
            (selectedBrandFamily && data.brandFamily === selectedBrandFamily)),
      )
      .forEach((data) => brandSkuSet.add(data.brandSKU.replace(/\s+/, '')));
    wsp
      .filter(
        (data) =>
          data.territory === territory &&
          (!selectedBrandFamily ||
            (selectedBrandFamily && data.brandFamily === selectedBrandFamily)),
      )
      .forEach((data) => brandSkuSet.add(data.brandSKU.replace(/\s+/, '')));
    let newSelectedBrandSku = selectedBrandSku.filter((brandSku) =>
      brandSkuSet.has(brandSku),
    );
    return {
      brandSkuList: [...brandSkuSet],
      selectedBrandSku: newSelectedBrandSku,
      ...this._filterData(territory, newSelectedBrandSku, selectedSurvey),
    };
  }

  _onTerritorySelected(selectedTerritory: string, selectedBrandFamily: string) {
    this.setState({
      selectedTerritory,
      ...this._filterProductList(selectedTerritory, selectedBrandFamily),
    });
  }

  _onProductSelected(selectedBrandSku: Array<string>) {
    let {selectedSurvey, selectedTerritory} = this.state;
    this.setState({
      selectedBrandSku,
      ...this._filterData(selectedTerritory, selectedBrandSku, selectedSurvey),
    });
  }

  _onSurveySelected(selectedSurvey: string) {
    let {selectedBrandSku, selectedTerritory} = this.state;
    this.setState({
      selectedSurvey,
      ...this._filterData(selectedTerritory, selectedBrandSku, selectedSurvey),
    });
  }

  _appendFillToData(
    legendData: Array<{value: number; color: string}>,
    data: Array<CanvasDistributionPrice>,
  ): Array<CanvasDistributionPrice & {fill: string}> {
    return data.sort((a, b) => a.price - b.price).map((datum, index) => {
      let legend =
        legendData.find((legend) => legend.value === datum.price) || {};
      return {
        ...datum,
        fill: legend.color,
      };
    });
  }

  render() {
    let {
      selectedSurvey,
      selectedBrandSku,
      selectedTerritory,
      brandSkuList,
      territoryList,
      canvasDistPriceData,
      wspData,
    } = this.state;
    let {title, isLoading, error} = this.props;
    let content;
    if (isLoading) {
      content = <LoadingIndicator />;
    } else if (error) {
      content = (
        <ErrorComponent url="/RspWspData" errorMessage={error.message} />
      );
    } else {
      let canvasDistPriceArray = [...canvasDistPriceData.values()];
      let wspArray = [...wspData.values()];
      let deduct = canvasDistPriceArray.filter((datum) => datum.length === 0)
        .length;
      let canvasChartBuffer = [];
      while (
        (canvasDistPriceData.size + canvasChartBuffer.length - deduct) %
          MAX_CANVAS_CHARTS !==
        0
      ) {
        canvasChartBuffer.push(
          <View
            // TODO: adjust when screen is small
            style={styles.wideScreenCanvasStackBarContainer}
            key={canvasChartBuffer.length}
          />,
        );
      }
      let legend = new Set();
      for (let data of canvasDistPriceArray) {
        for (let datum of data) {
          legend.add(datum.price);
        }
      }
      let legendData = [...legend].map((price, index) => ({
        value: price,
        color: RSP_WSP_COLORS[index],
      }));
      content = (
        <View style={[styles.flex, styles.rowFlexed]}>
          {brandSkuList.length === 0 ? (
            <View style={[styles.flex, styles.placeholderContainer]}>
              <PlaceholderView text="No data available" />
            </View>
          ) : !selectedTerritory ? (
            <View style={[styles.flex, styles.placeholderContainer]}>
              <PlaceholderView text="Please select Territory on global filter" />
            </View>
          ) : selectedBrandSku.length === 0 ? (
            <View style={[styles.flex, styles.placeholderContainer]}>
              <PlaceholderView text="Please select Product" />
            </View>
          ) : (
            <View style={styles.flex}>
              <TabBar
                tabList={['Pack', 'Stick']}
                selectedTabName={selectedSurvey}
                onChangeTab={this._onSurveySelected}
              />
              <ScrollView style={styles.canvasChartContainer} padding={10}>
                <View
                  style={[
                    styles.rowFlexed,
                    styles.wrapFlexed,
                    styles.spaceAround,
                  ]}
                >
                  {canvasDistPriceArray.map((data, index) => {
                    if (data.length > 0) {
                      let dataWithFill = this._appendFillToData(
                        legendData,
                        data,
                      );
                      let containerStyle = [
                        styles.topMargin,
                        // TODO: adjust when screen is small
                        styles.wideScreenCanvasStackBarContainer,
                        index === canvasDistPriceData.size - 1
                          ? styles.bottomMargin
                          : {},
                      ];
                      return (
                        <View style={containerStyle} key={index}>
                          <Text
                            fontWeight="bold"
                            style={[styles.centeredText, styles.chartHeader]}
                          >
                            {data[0].brandSKU.replace(/\s+/, '')}
                          </Text>
                          <CanvasPriceStackedBarChart
                            key={selectedBrandSku.length}
                            data={dataWithFill}
                            legendData={legendData}
                          />
                          <Text style={styles.centeredText}>
                            Rp {commaSeparator(data[0].distPrice)}
                          </Text>
                        </View>
                      );
                    } else {
                      return null;
                    }
                  })}
                  {canvasChartBuffer}
                </View>
              </ScrollView>
              <View
                style={[
                  styles.rowFlexed,
                  styles.wrapFlexed,
                  styles.spaceAround,
                  styles.rightMargin,
                  styles.legendContainer,
                ]}
              >
                {legendData
                  .sort((a, b) => a.value - b.value)
                  .map((legend, index) => (
                    <View
                      key={index}
                      style={[
                        styles.rowFlexed,
                        styles.centerAligned,
                        styles.legend,
                      ]}
                    >
                      <Rectangle backgroundColor={legend.color} size={1} />
                      <Text style={styles.leftMargin}>{legend.value}</Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
          <View style={styles.flex}>
            <WspTable
              data={wspArray}
              type="brand"
              accessLevel="National"
              alternativePlaceholderMessage={
                brandSkuList.length === 0
                  ? ''
                  : !selectedTerritory
                    ? 'Please select Territory on global filter'
                    : selectedBrandSku.length === 0
                      ? 'Please select Product'
                      : ''
              }
            />
          </View>
        </View>
      );
    }
    return (
      <Widget
        title={title}
        filters={
          <View style={[styles.rowFlexed, styles.filterContainer]}>
            <View style={styles.rightPadding}>
              <Dropdown
                label="Territory"
                options={territoryList}
                selectedValue={selectedTerritory}
                onSelect={(selectedTerritory) =>
                  this._onTerritorySelected(
                    selectedTerritory,
                    this.props.selectedBrandFamily,
                  )}
              />
            </View>
            <Dropdown
              label="Product"
              options={brandSkuList}
              selectedValue={selectedBrandSku}
              onSelect={this._onProductSelected}
              multiple
            />
          </View>
        }
      >
        <Persist
          name="RSP WSP Brand"
          data={{selectedSurvey, selectedBrandSku, selectedTerritory}}
          onMount={({selectedSurvey, selectedBrandSku, selectedTerritory}) => {
            let {
              canvasDistributionPrice,
              wsp,
              selectedBrandFamily,
            } = this.props;
            let brandSkuSet = new Set([
              ...canvasDistributionPrice
                .filter(
                  (data) =>
                    data.territory === selectedTerritory &&
                    data.survey.includes(selectedSurvey) &&
                    (!selectedBrandFamily ||
                      (selectedBrandFamily &&
                        data.brandFamily === selectedBrandFamily)),
                )
                .map((data) => data.brandSKU.replace(/\s+/, '')),
              ...wsp
                .filter(
                  (data) =>
                    data.territory === selectedTerritory &&
                    (!selectedBrandFamily ||
                      (selectedBrandFamily &&
                        data.brandFamily === selectedBrandFamily)),
                )
                .map((data) => data.brandSKU.replace(/\s+/, '')),
            ]);
            this.setState({
              selectedSurvey,
              selectedBrandSku,
              selectedTerritory,
              brandSkuList: [...brandSkuSet],
              ...this._filterData(
                selectedTerritory,
                selectedBrandSku,
                selectedSurvey,
              ),
            });
          }}
        />
        {content}
      </Widget>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  rowFlexed: {
    flexDirection: 'row',
  },
  filterContainer: {
    paddingBottom: 20,
  },
  rightPadding: {
    paddingRight: 15,
  },
  canvasChartContainer: {
    borderColor: MEDIUM_GREY,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 20,
    marginRight: 20,
  },
  legendContainer: {
    borderColor: MEDIUM_GREY,
    borderRadius: 5,
    borderWidth: 1,
    minHeight: 17,
    padding: 10,
  },
  legend: {
    marginHorizontal: 3,
  },
  chartHeader: {
    marginBottom: 5,
  },
  centeredText: {
    textAlign: 'center',
  },
  topMargin: {
    marginTop: 15,
  },
  rightMargin: {
    marginRight: 20,
  },
  bottomMargin: {
    marginBottom: 15,
  },
  biggerBottomMargin: {
    marginBottom: 20,
  },
  canvasStackBarContainer: {
    width: '80%',
  },
  wideScreenCanvasStackBarContainer: {
    width: '50%',
  },
  wrapFlexed: {
    flexWrap: 'wrap',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  centerAligned: {
    alignItems: 'center',
  },
  leftMargin: {
    marginLeft: 5,
  },
  placeholderContainer: {
    paddingRight: 20,
  },
});
