// @flow

import {StyleSheet} from 'react-primitives';

export const MAIN_BLUE = '#4A90E2';
export const LIGHT_BLUE = '#AAD0F2';
export const PALE_BLUE = '#EDF4FB';
export const PALE_RED = '#CE6262';
export const PALE_GREEN = 'yellowgreen';
export const ORANGE = '#FF9800';
export const DARKER_BLUE = '#2A70C2';
export const WHITE = '#FFFFFF';
export const ALMOST_WHITE = '#FBFCFD';
export const ALTERNATIVE_GREY = '#EBEBEB';
export const LIGHT_GREY = '#E4EBE6';
export const PALE_GREY = '#EDF0F4';
export const MEDIUM_GREY = '#CCC';
export const GREY = '#7F7F7F';
export const SHADOW_GREY = '#868686';
export const DARK_GREY = '#474F58';

export const TRANSPARENT = '#0000';
export const DARK_DIM = '#2221';
export const DEFAULT_GRADIENT = [
  'transparent',
  'transparent',
  'transparent',
  'rgba(0, 0, 0, 0.4)',
  'rgba(0, 0, 0, 0.6)',
  'rgba(0, 0, 0, 0.8)',
];

export const BACKGROUND = '#F6F7FB';
export const THEME_COLOR = MAIN_BLUE;
export const TEXT_COLOR = DARK_GREY;
export const PLACEHOLDER_TEXT_COLOR = '#BBB';
export const TITLE_TEXT_COLOR = DARK_GREY;

// MenuBar
export const ICON_COLOR = THEME_COLOR;
export const MENUBAR_BACKGROUND_COLOR = WHITE;

// Line chart company level
export const HMS = '#FF0000';
export const GUDANG_GARAM = '#990001';
export const DJARUM = '#663300';
export const BAT = '#000099';
export const NOJORONO = '#0099FF';
export const OTHERS = GREY;

// Bar chart
export const HMS_BRAND = '#FF0000';
export const NON_HMS_BRAND = GREY;

// SKU
export const BRAND_FAMILY_COLOR = {
  'sampoerna a': '#FF0000',
  'sampoerna a mild': '#FF0000',
  'dss kretek': '#94A028',
  magnum: '#4D4D4D',
  'sampoerna kretek': '#009901',
  'u mild': '#0166FF',
  malboro: '#AE1202',
  'malboro red': '#AE1202',
  'a mild menthol': '#01B050',
  avolution: '#777777',
  'dss super premium': '#000000',
  panamas: '#FFC001',
  'magnum mild': '#000166',
  'u bold': '#FF0166',
  'malboro filter black': '#7E0D01',
  'malboro lights': '#FFFF02',
  'malboro black menthol': '#2A4F1D',
  'malboro ice blast': '#46CBF6',
};

// SOM and Volume Growth
export const GROWTH_COLOR = {
  low: '#af2a2a',
  middle: '#e8c725',
  high: '#418728',
  default: GREY,
};

// DST
export const CC = GREY;
export const ECC = PALE_RED;
export const STRIKE_RATE = SHADOW_GREY;
export const TARGET_CC = '#9E9E9E';
export const TARGET_ECC = PALE_RED;
export const TARGET_PS = MAIN_BLUE;
export const PACKSOLD = DARKER_BLUE;

export const colorStyles = StyleSheet.create({
  thinShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9,
  },
  thickShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
});

export const TABLE_COLOR = {
  odd: PALE_GREY,
  even: WHITE,
};

export const LINE_CHART_COLORS = [
  'coral', // #FF7F50
  'mediumturquoise', // #48D1CC
  'darkseagreen', // #8FBC8F
  'crimson', // #DC143C
  'deepskyblue', // #00BFFF
  'forestgreen', // #228B22
  'palevioletred', // #DB7093
  'steelblue', // #4682B4
  'yellowgreen', // #9ACD32
  'peru', // #CD853F
];

export const RSP_WSP_COLORS = [
  THEME_COLOR,
  PALE_RED,
  PALE_GREEN,
  'salmon', // #FA8072
  'goldenrod', // #DAA520
  'darksalmon', // #E9967A
  'thistle', // #D8BFD8
  'teal', // #008080
  'plum', // #DDA0DD
  GREY,
];

export const AGE_COLORS = [
  '#4682B4', // LA-24
  '#FFB6C1', // 25-29
  '#008B8B', // 30-34
  '#FF8C00', // 35-44
  '#008000', // 45+
];

export const GAUGE_CHART_COLOR = {
  red: '#FF1E3C',
  yellow: '#FFD700',
  green: '#63A500',
  needle: '#474747',
};

export const PLACEHOLDER_ROW = '#EEEEEE';
