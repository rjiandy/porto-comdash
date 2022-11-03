// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {StyleSheet} from 'react-primitives';
import {connect} from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import domtoimage from 'dom-to-image';
import jspdf from 'jspdf';
import {saveAs} from 'file-saver';
import json2csv from 'json2csv';
import Zip from 'jszip';
import {HMS_HEADER} from '../general/constants/HMSLogo';

import {
  View,
  ScrollView,
  Text,
  Icon,
  MaterialIcon,
  Button,
  FixedRatioView,
  Dropdown,
} from '../general/components/coreUIComponents';
import {
  THEME_COLOR,
  WHITE,
  GREY,
  PALE_GREEN,
} from '../general/constants/colors';

import widgets from '../routes/widgets';
import WidgetThumbnail from './WidgetThumbnail';

import type {RootState} from '../general/stores/RootState';

type DataShape = {
  [key: string]: {
    title: string;
    dataSource: $Shape<RootState>;
  };
};

type ExportWidgetProps = {
  onToggleExportDialog: () => void;
  data: DataShape;
  globalFilter: {
    selectedTerritory: string;
    selectedBrandFamily: string;
  };
};

type Key = string;
type ExportType = 'PDF' | 'EXCEL' | 'IMAGE';

type ExportWidgetState = {
  selectedItems: Array<Key>;
  exportTo: ExportType;
  isExport: boolean;
};

class ExportWidget extends Component {
  props: ExportWidgetProps;
  state: ExportWidgetState;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      selectedItems: [],
      exportTo: 'PDF',
      isExport: false,
    };
  }

  render() {
    let {selectedItems, isExport} = this.state;
    let {onToggleExportDialog} = this.props;
    let isWidgetSelected = (widget) => selectedItems.includes(widget.key);
    let lists = widgets.filter(isWidgetSelected);
    return (
      <View style={styles.exportContainer}>
        <SidebarMenu>
          <SidebarHeader
            description="Select format and widget(s) to export"
            onClose={onToggleExportDialog}
          >
            <Dropdown
              options={['PDF', 'IMAGE', 'EXCEL']}
              selectedValue={this.state.exportTo}
              containerStyle={{alignSelf: 'center'}}
              onSelect={this._onExportTypeSelected}
            />
          </SidebarHeader>
          <View style={styles.breakLine} />
          <SidebarList>
            {widgets.map((widget) => {
              return (
                <SidebarItem
                  key={widget.key}
                  id={widget.key}
                  selectedItems={selectedItems}
                  onSelect={this._onItemSelected}
                >
                  <WidgetThumbnail
                    widget={widget}
                    isSelected={isWidgetSelected(widget)}
                  />
                </SidebarItem>
              );
            })}
          </SidebarList>
          {this.state.selectedItems.length > 0 ? (
            <View
              style={[styles.justifyCenter, styles.alignCenter, {margin: 20}]}
            >
              <Button
                primary
                disabled={isExport}
                onPress={this._printDocument}
                label={isExport ? 'Exporting...' : 'Export'}
              />
            </View>
          ) : null}
        </SidebarMenu>
        <View style={styles.preview}>
          <ScrollView>
            <View id="printedNode">
              {lists.map(({Component, key, title}) => (
                <FixedRatioView ratio={16 / 9} key={key} style={{margin: 10}}>
                  <View style={{margin: 0, flex: 1}} id={key}>
                    <Component title={title} />
                  </View>
                </FixedRatioView>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  async _printDocument() {
    let {exportTo} = this.state;
    this.setState({isExport: true});
    if (this.state.exportTo === 'IMAGE') {
      let element = document.getElementById('printedNode');
      let image = await domtoimage.toBlob(element);
      saveAs(image, `Widget Summary ${new Date().getTime()}.png`);
    } else if (exportTo === 'PDF') {
      let list = widgets.filter((widget) =>
        this.state.selectedItems.includes(widget.key),
      );
      // genterate new pdf that has landscape, dimension, paper, and compression to true
      // please check https://github.com/MrRio/jsPDF/blob/ddbfc0f0250ca908f8061a72fa057116b7613e78/jspdf.js#L146
      let pdf = new jspdf('l', 'mm', 'a4', true);
      let currentPage = 1;
      for (let widget of list) {
        let {key} = widget;
        let element = document.getElementById(key);
        let image = await domtoimage.toPng(element);
        pdf.setFont('times');
        pdf.setFontType('italic');
        pdf.setFontSize(16);
        pdf.setTextColor(150);
        pdf.text(200, 200, 'Confidential, internal use only');
        // To make it render with the same ratio as widget. I set it to 16 x 9 ratio
        // and made the margin static, 10 left and 20 top
        pdf.addImage(HMS_HEADER, 'JPEG', -10, 5, 100, 30);
        pdf.setDrawColor(255, 0, 0); // d
        pdf.setLineWidth(0.7);
        pdf.line(10, 30, 280, 30);
        pdf.addImage(image, 'PNG', 10, 35, 270, 152);
        if (currentPage !== list.length) {
          // this will make page break. I make one image per page.
          pdf.addPage();
          currentPage += 1;
        }
      }
      pdf.save(`Widget Summary ${new Date().getTime()}.pdf`);
    } else if (exportTo === 'EXCEL') {
      this._exportToExcel();
    }
    this.setState({isExport: false});
  }

  _exportToExcel() {
    let {selectedItems} = this.state;
    let {data, globalFilter} = this.props;
    let {selectedTerritory, selectedBrandFamily} = globalFilter;
    let zip = new Zip();
    Object.keys(data).forEach((key) => {
      let found = selectedItems.includes(key);
      if (found) {
        let csv = zip.folder(key);
        let dataSource = data[key]['dataSource'];
        Object.keys(dataSource).forEach((property) => {
          if (
            property !== 'territory' &&
            property !== 'isLoading' &&
            property !== 'error'
          ) {
            let selectedData = dataSource[property];
            let filteredData = [];
            if (Array.isArray(selectedData)) {
              filteredData = selectedData.filter((datum) => {
                return datum.territory && datum.brandFamily
                  ? datum.territory === selectedTerritory &&
                      datum.brandFamily === selectedBrandFamily
                  : datum.territory === selectedTerritory;
              });
            }
            if (filteredData.length !== 0) {
              let csvFile = json2csv({data: filteredData});
              csv.file(`${property}.csv`, csvFile);
            } else {
              let safeSelectedData = selectedData[0]
                ? selectedData[0]
                : {data: ''};
              if (typeof safeSelectedData !== 'string') {
                let emptyData = Object.keys(
                  safeSelectedData,
                ).reduce((empty, data) => {
                  empty[data] = '';
                  return empty;
                }, {});
                let csvFile = json2csv({data: [emptyData]});
                csv.file(`${property}.csv`, csvFile);
              }
            }
          }
        });
      }
    });
    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, 'summary.zip');
    });
  }

  _onExportTypeSelected(value: ExportType) {
    this.setState({exportTo: value});
  }

  _onItemSelected(key: string) {
    let {selectedItems} = this.state;
    let found = selectedItems.includes(key);
    if (found) {
      this.setState({
        selectedItems: selectedItems.filter((item) => item !== key),
      });
    } else {
      this.setState({selectedItems: [...selectedItems, key]});
    }
  }
}

type SidebarMenuProps = {
  children: ReactNode;
  style?: StyleSheetTypes;
};

function SidebarMenu(props: SidebarMenuProps) {
  let {children, style} = props;
  return <View style={[styles.sidebar, style]}>{children}</View>;
}

type SidebarHeaderProps = {
  description?: string;
  containerStyle?: StyleSheet.styles;
  onClose?: () => void;
  textStyle?: StyleSheet.styles;
  children?: ReactNode;
};

function SidebarHeader(props: SidebarHeaderProps) {
  let {description, children, containerStyle, onClose, textStyle} = props;
  return (
    <View
      style={[
        styles.justifyCenter,
        styles.alignCenter,
        styles.padding,
        containerStyle,
      ]}
    >
      {onClose && (
        <View style={{position: 'absolute', top: -12, right: -11}}>
          <Icon
            name="close"
            color="blue"
            onPress={onClose}
            style={{width: 15, height: 15}}
          />
        </View>
      )}
      <Text style={[styles.textCenter, textStyle, {fontSize: 14}]}>
        {description}
      </Text>
      {children}
    </View>
  );
}

type SidebarListProps = {
  children: ReactNode;
};

function SidebarList(props: SidebarListProps) {
  let {children} = props;
  return <ScrollView style={{paddingHorizontal: 10}}>{children}</ScrollView>;
}

type SidebarItemProps = {
  children: ReactNode;
  id: string;
  selectedItems: Array<string>;
  onSelect: (title: string) => void;
};

class SidebarItem extends Component {
  props: SidebarItemProps;
  render() {
    let {children, id, onSelect, selectedItems} = this.props;
    return (
      <View style={styles.sidebarContainer}>
        <View style={styles.sidebarItemIcon}>
          <Checkbox
            uncheckedIcon={
              <MaterialIcon name="check-box-outline-blank" color={PALE_GREEN} />
            }
            checkedIcon={
              <MaterialIcon name="check-box" style={{color: PALE_GREEN}} />
            }
            checked={selectedItems.includes(id)}
            onCheck={() => onSelect(id)}
            style={{color: THEME_COLOR, width: 20}}
          />
        </View>
        {children}
      </View>
    );
  }
}

function mapStateToProps(state: RootState) {
  let data = {
    landingPageTerritory: {
      title: 'Landing Page (Territory)',
      dataSource: state.landingPageBrandTerritoryState,
    },
    landingPageBrand: {
      title: 'Landing Page (Brand)',
      dataSource: state.landingPageBrandTerritoryState,
    },
    marketUpdateTerritory: {
      title: 'Market Update (Territory)',
      dataSource: state.marketUpdateState,
    },
    marketUpdateBrand: {
      title: 'Market Update (Brand)',
      dataSource: state.marketUpdateState,
    },
    industryUpdate: {
      title: 'Industry Update',
      dataSource: state.industryUpdateState,
    },
    somTrendComparisonTerritory: {
      title: 'SOM Trend Comparison (Territory)',
      dataSource: state.somTrendComparisonState,
    },
    somTrendComparisonBrand: {
      title: 'SOM Trend Comparison (Brand)',
      dataSource: state.somTrendComparisonState,
    },
    distributionPerformanceSOM: {
      title: 'Distribution Performance SOM',
      dataSource: state.distributionPerformanceSomState,
    },
    salesPerformance: {
      title: 'Sales Performance',
      dataSource: state.imsComparisonState,
    },
    imsComparison: {
      title: 'IMS Comparison',
      dataSource: state.imsComparisonState,
    },
    rspWspTerritory: {
      title: 'RSP & WSP (Territory)',
      dataSource: state.rspWspState,
    },
    rspWspBrand: {
      title: 'RSP & WSP (Brand)',
      dataSource: state.rspWspState,
    },
    territoryComparison: {
      title: 'Territory Comparison',
      dataSource: state.territoryComparisonState,
    },
    dst: {
      title: 'DST',
      dataSource: state.dstState,
    },
    consumerProfile: {
      title: 'Consumer Profile',
      dataSource: state.consumerProfileState,
    },
    smokerProfile: {
      title: 'Adult Smoker Profile',
      dataSource: state.adultSmokerProfileState,
    },
    segmentPerformance: {
      title: 'Segment Performance',
      dataSource: state.segmentPerformanceState,
    },
    brandProductImagery: {
      title: 'Brand Product Imagery',
      dataSource: state.brandProductImageryState,
    },
    lampHop: {
      title: 'Lamp HOP',
      dataSource: state.lampHOPState,
    },
    switchingDynamic: {
      title: 'Switching Dynamic',
      dataSource: state.switchingDynamicState,
    },
    brandFunnel: {
      title: 'Brand Funnel',
      dataSource: state.brandFunnelState,
    },
    ooh: {
      title: 'OOH',
      dataSource: state.oohState,
    },
  };
  return {
    data,
    globalFilter: state.globalFilter,
  };
}

let styles = StyleSheet.create({
  sidebarContainer: {
    margin: 10,
    position: 'relative',
    float: 'right',
    top: 0,
    right: 0,
  },
  breakLine: {
    borderWidth: 1,
    borderColor: THEME_COLOR,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  previewContainer: {
    margin: 10,
    minHeight: '80vh',
    padding: 10,
  },
  textCenter: {
    textAlign: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  alignCenter: {
    alignItems: 'center',
  },
  padding: {
    padding: 20,
    paddingTop: 40,
  },
  exportContainer: {
    flexDirection: 'row',
    top: 88,
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 88px)', //TODO: 'change it when using routes rather than pop-up'
    position: 'absolute',
    zIndex: 2,
    backgroundColor: WHITE,
  },
  sidebar: {
    maxWidth: '18%',
    flex: 1,
    opacity: 1,
    backgroundColor: WHITE,
  },
  preview: {
    backgroundColor: GREY,
    flex: 1,
    padding: 30,
  },
  sidebarItemIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 3,
    backgroundColor: WHITE,
    padding: 0,
    maxWidth: 25,
  },
});

export default connect(mapStateToProps)(ExportWidget);
