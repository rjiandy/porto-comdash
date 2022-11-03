// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {StyleSheet} from 'react-primitives';

import {
  View,
  // LoadingIndicator,
  // ErrorComponent,
  Dropdown,
  Text,
} from '../../general/components/coreUIComponents';
import {Widget} from '../../general/components/UIComponents';
import {
  LIGHT_GREY,
  PALE_GREY,
  THEME_COLOR,
} from '../../general/constants/colors';

// import Persist from '../../general/components/Persist';
// import {connect} from 'react-redux';

// import type {RootState} from '../../general/stores/RootState';
// import type {Dispatch} from '../../general/stores/Action';
// import type {TradeInvestmentState} from './types/TradeInvestment-type';

type Props = {
  title: string;
  selectedTerritory: string;
  selectedBrandFamily: string;
  access: 'territory' | 'brand';
};

type State = {
  selectedFilters: {
    year: string;
    cycle: string;
  };
  selectedPOSM: string;
  territoryList: Array<string>;
};

const tradeInvestmentDropdowns = [
  {
    label: 'year',
    options: ['2011', '2012', '2017'],
  },
  {
    label: 'cycle',
    options: ['cycle A', 'cycle B', 'cycle C'],
  },
];

export default class TradeInvestmentScene extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    this.state = {
      selectedFilters: {
        year: '2017',
        cycle: 'cycle A',
      },
      selectedPOSM: 'a',
      territoryList: ['Jakarta', 'Jakarta Inner', 'Jakarta Outer'],
    };
    autobind(this);
  }

  // componentWillMount() {}

  // componentWillReceiveProps(nextProps: Props) {
  //   let oldProps = this.props;
  //   let {} = nextProps;
  // }

  render() {
    let {title, selectedTerritory} = this.props;
    let {territoryList} = this.state;
    // if (isLoading) {
    //   content = <LoadingIndicator />;
    // } else if (error) {
    //   content = (
    //     <ErrorComponent url="/TradeInvestmentData" errorMessage={error.message} />
    //   );
    // } else {
    // }

    return (
      <Widget
        title={title}
        filters={
          <View style={{marginRight: 10}}>
            <Dropdown
              label="Territory"
              options={territoryList}
              selectedValue={selectedTerritory}
              onSelect={() => {}}
              disabled={false}
            />
          </View>
        }
      >
        <View style={{flex: 1}}>
          <View
            style={[
              styles.rowContainer,
              {justifyContent: 'flex-end', paddingHorizontal: 10},
            ]}
          >
            {tradeInvestmentDropdowns.map((dropdown) => {
              // 5 Filters
              let {label, options} = dropdown;
              let selectedFilters = {...this.state.selectedFilters};
              let selectedFilter = selectedFilters[label];
              return (
                <Dropdown
                  key={label}
                  label={label === 'outletType' ? 'outlet type' : label}
                  options={options}
                  selectedValue={selectedFilter}
                  onSelect={(selectedFilter) =>
                    this.setState({
                      selectedFilters: {
                        ...selectedFilters,
                        [label]: selectedFilter,
                      },
                    })}
                  disabled={options.length === 0}
                  containerStyle={{marginLeft: 10}}
                />
              );
            })}
          </View>
          <View style={[styles.rowContainer, {flex: 1, marginTop: 20}]}>
            {this._renderCoverageOverView('POSM')}
            {this._renderCoverageOverView('Trade Program')}
          </View>
        </View>
      </Widget>
    );
  }

  _renderCoverageOverView(title: string) {
    let {selectedPOSM} = this.state;
    return (
      <View style={styles.coverageOverview}>
        <View
          style={[
            styles.rowContainer,
            {alignItems: 'center', marginBottom: 10},
          ]}
        >
          <Text customStyle="title" style={{flex: 1, marginLeft: 10}}>
            {title}
          </Text>
          <Dropdown
            label={title === 'POSM' ? 'POSM type' : 'Brand name'}
            options={['a', 'b']}
            selectedValue={selectedPOSM}
            onSelect={(selectedPOSM) =>
              this.setState({
                selectedPOSM,
              })}
            disabled={false}
          />
        </View>
        <View style={styles.coverageOverviewItemContainer}>
          <View style={[styles.rowContainer, {flex: 1, marginBottom: 10}]}>
            {this._renderCoverageOverViewItem(title, 'Optimize', {
              marginRight: 10,
            })}
            {this._renderCoverageOverViewItem(title, 'Invest')}
          </View>
          <View style={[styles.rowContainer, {flex: 1, marginBottom: 10}]}>
            {this._renderCoverageOverViewItem(title, 'Defend', {
              marginRight: 10,
            })}
            {this._renderCoverageOverViewItem(title, 'Explore')}
          </View>
          <View style={[styles.rowContainer, {flex: 0.9}]}>
            {this._renderCoverageOverViewItem(title, 'Minimize')}
          </View>
        </View>
      </View>
    );
  }

  _renderCoverageOverViewItem(
    overviewType: string,
    title: string,
    style?: StyleSheetTypes,
  ) {
    return (
      <View style={[styles.coverageOverviewItem, style]}>
        <Text
          customStyle="title"
          fontWeight="bold"
          style={{color: THEME_COLOR, marginBottom: 5}}
        >
          {title}
        </Text>
        <View style={styles.rowContainer}>
          <View style={[styles.itemLabelValue, {marginRight: 10}]}>
            <Text>
              {overviewType === 'POSM' ? 'Coverage' : 'Program Covg.'}
            </Text>
            <Text>Total Store</Text>
            <Text>
              {overviewType === 'POSM' ? 'vs Coverage' : 'Store with program'}
            </Text>
            {overviewType === 'POSM' && title !== 'Minimize' ? (
              <Text>Total PPOSM</Text>
            ) : null}
          </View>
          <View style={styles.itemLabelValue}>
            <Text>0.6%</Text>
            <Text>10000</Text>
            <Text>{overviewType === 'POSM' ? '12%' : '40565'}</Text>
            {overviewType === 'POSM' && title !== 'Minimize' ? (
              <Text>19384</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  coverageOverview: {
    flex: 1,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginHorizontal: 10,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  coverageOverviewItemContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  coverageOverviewItem: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: PALE_GREY,
    borderRadius: 4,
  },
  itemLabelValue: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});

// export function mapStateToProps(state: RootState) {
//   let {} = state;
//   return {};
// }

// export function mapDispatchToProps(dispatch: Dispatch) {
//   return {};
// }

// export default connect(mapStateToProps, mapDispatchToProps, )(
//   TradeInvestmentScene,
// );
