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
  selectedTerritories: Array<string>;
  selectedBrandSku: string;
  territoryList: Array<string>;
  brandSkuList: Array<string>;
  canvasDistPriceData: Map<string, Array<CanvasDistributionPrice>>;
  wspData: Map<string, Wsp>;
};
type Props = {
  title: string;
  isLoading: boolean;
  error: ?Error;
  canvasDistributionPrice: Array<CanvasDistributionPrice>;
  selectedBrandFamily: string;
  wsp: Array<Wsp>;
  accessLevel: 'National' | 'Zone' | 'Region' | 'Area';
};

export default class RspWspScene extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    this.state = {
      selectedSurvey: 'Pack',
      selectedTerritories: [],
      selectedBrandSku: '',
      territoryList: [],
      brandSkuList: [],
      canvasDistPriceData: new Map(),
      wspData: new Map(),
    };
    autobind(this);
  }

  componentWillMount() {
    let {selectedBrandFamily, canvasDistributionPrice, wsp} = this.props;
    this._populateBrandSkuList(
      selectedBrandFamily,
      canvasDistributionPrice,
      wsp,
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    let {selectedBrandFamily, canvasDistributionPrice, wsp} = nextProps;
    if (
      this.props.selectedBrandFamily !== selectedBrandFamily ||
      this.props.wsp.length !== wsp.length
    ) {
      this._populateBrandSkuList(
        selectedBrandFamily,
        canvasDistributionPrice,
        wsp,
      );
    }
  }

  _populateBrandSkuList(
    selectedBrandFamily: string,
    canvasDistributionPrice: Array<CanvasDistributionPrice>,
    wsp: Array<Wsp>,
  ) {
    let filterFn = (data) => {
      if (selectedBrandFamily && selectedBrandFamily !== 'HMS') {
        return data.brandFamily === selectedBrandFamily;
      } else {
        return true;
      }
    };
    let mapFn = ({brandSKU}) => brandSKU.replace(/\s+/, '');
    let brandSkuSet = new Set([
      ...canvasDistributionPrice.filter(filterFn).map(mapFn),
      ...wsp.filter(filterFn).map(mapFn),
    ]);
    this.setState({
      brandSkuList: [...brandSkuSet],
      selectedBrandSku: '',
      ...this._filterTerritoryList(''),
    });
  }

  _filterData(territories: Array<string>, brandSku: string, survey: string) {
    let {canvasDistributionPrice, wsp} = this.props;
    if (territories && brandSku) {
      let canvasDistPriceData = new Map();
      let wspData = new Map();
      let filteredCanvasData = canvasDistributionPrice.filter(
        (data) =>
          territories.includes(data.territory) &&
          brandSku === data.brandSKU.replace(/\s+/, '') &&
          data.survey.includes(survey),
      );
      territories.forEach((territory) => {
        let canvasData = filteredCanvasData
          .filter((datum) => datum.territory === territory)
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
        canvasDistPriceData.set(territory, canvasData);

        let wspDatum = wsp.find(
          (datum) =>
            datum.territory === territory &&
            brandSku === datum.brandSKU.replace(/\s+/, ''),
        );
        if (wspDatum) {
          let territoryWsp = convertObjectValueToNumber(wspDatum, [
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
          ]);
          wspData.set(territory, territoryWsp);
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

  _filterTerritoryList(brandSku: string) {
    let {canvasDistributionPrice, wsp} = this.props;
    let {selectedSurvey, selectedTerritories} = this.state;
    let territorySet = new Set();
    canvasDistributionPrice
      .filter(
        (data) =>
          data.brandSKU === brandSku && data.survey.includes(selectedSurvey),
      )
      .forEach((data) => territorySet.add(data.territory));
    wsp
      .filter((data) => data.brandSKU === brandSku)
      .forEach((data) => territorySet.add(data.territory));
    let newSelectedTerritories = selectedTerritories.filter((territory) =>
      territorySet.has(territory),
    );
    return {
      territoryList: Array.from(territorySet.values()),
      selectedTerritories: newSelectedTerritories,
      ...this._filterData(newSelectedTerritories, brandSku, selectedSurvey),
    };
  }

  _onTerritorySelected(selectedTerritories: Array<string>) {
    let {selectedBrandSku, selectedSurvey} = this.state;
    this.setState({
      selectedTerritories,
      ...this._filterData(
        selectedTerritories,
        selectedBrandSku,
        selectedSurvey,
      ),
    });
  }

  _onProductSelected(selectedBrandSku: string) {
    let {selectedTerritories, selectedSurvey} = this.state;
    this.setState({
      selectedBrandSku,
      ...this._filterTerritoryList(selectedBrandSku),
      ...this._filterData(
        selectedTerritories,
        selectedBrandSku,
        selectedSurvey,
      ),
    });
  }

  _onSurveySelected(selectedSurvey: string) {
    let {selectedTerritories, selectedBrandSku} = this.state;
    this.setState({
      selectedSurvey,
      ...this._filterData(
        selectedTerritories,
        selectedBrandSku,
        selectedSurvey,
      ),
    });
  }

  _processData(
    legendData: Array<{value: number; color: string}>,
    data: Array<CanvasDistributionPrice>,
  ): Array<CanvasDistributionPrice & {fill: string}> {
    return data.sort((a, b) => a.price - b.price).map((datum) => {
      let legend =
        legendData.find((legend) => legend.value === datum.price) || {};
      return {
        ...datum,
        fill: legend.color,
      };
    });
  }

  render() {
    let {title, isLoading, error, accessLevel} = this.props;
    let {
      selectedSurvey,
      selectedTerritories,
      selectedBrandSku,
      territoryList,
      brandSkuList,
      canvasDistPriceData,
      wspData,
    } = this.state;
    let content;
    if (isLoading) {
      content = <LoadingIndicator />;
    } else if (error) {
      content = (
        <ErrorComponent url="/RspWspData" errorMessage={error.message} />
      );
    } else {
      let canvasDistPriceArray = Array.from(canvasDistPriceData.values());
      let wspArray = Array.from(wspData.values());
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
          {brandSkuList.length === 0 && territoryList.length === 0 ? (
            <View style={[styles.flex, styles.placeholderContainer]}>
              <PlaceholderView text="No data available" />
            </View>
          ) : !selectedBrandSku ? (
            <View style={[styles.flex, styles.placeholderContainer]}>
              <PlaceholderView text="Please select Product" />
            </View>
          ) : selectedTerritories.length === 0 ? (
            <View style={[styles.flex, styles.placeholderContainer]}>
              <PlaceholderView text="Please select Territory" />
            </View>
          ) : (
            <View style={styles.flex}>
              <TabBar
                tabList={['Pack', 'Stick']}
                selectedTabName={selectedSurvey}
                onChangeTab={this._onSurveySelected}
              />
              <Text style={styles.centeredText}>
                Canvas Price
                {canvasDistPriceArray.length > 0 && canvasDistPriceArray[0][0]
                  ? `: Rp ${commaSeparator(
                      canvasDistPriceArray[0][0].distPrice,
                    )}`
                  : ''}
              </Text>
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
                      let dataWithFill = this._processData(legendData, data);
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
                            {data[0].territory}
                          </Text>
                          <CanvasPriceStackedBarChart
                            key={selectedTerritories.length}
                            data={dataWithFill}
                            legendData={legendData}
                          />
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
                      <Text style={styles.leftMargin}>
                        {commaSeparator(legend.value)}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
          <View style={styles.flex}>
            <WspTable
              data={wspArray}
              type="territory"
              accessLevel={accessLevel}
              alternativePlaceholderMessage={
                brandSkuList.length === 0 && territoryList.length === 0
                  ? ''
                  : !selectedBrandSku
                    ? 'Please select Product'
                    : selectedTerritories.length === 0
                      ? 'Please select Territory'
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
                selectedValue={selectedTerritories}
                onSelect={this._onTerritorySelected}
                disabled={territoryList.length === 0}
                multiple
              />
            </View>
            <Dropdown
              label="Product"
              options={brandSkuList}
              selectedValue={selectedBrandSku}
              onSelect={this._onProductSelected}
              disabled={brandSkuList.length === 0}
            />
          </View>
        }
      >
        <Persist
          name="RSP WSP Territory"
          data={{selectedBrandSku, selectedSurvey, selectedTerritories}}
          onMount={({selectedBrandSku, selectedSurvey, selectedTerritories}) =>
            this.setState({
              selectedSurvey,
              selectedBrandSku,
              selectedTerritories,
              ...this._filterTerritoryList(selectedBrandSku),
              ...this._filterData(
                selectedTerritories,
                selectedBrandSku,
                selectedSurvey,
              ),
            })}
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
