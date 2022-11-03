// @flow

import React from 'react';
import {View, Image} from 'react-primitives';
import {FontIcon, IconButton} from 'material-ui';
import wrapComponent from '../../helpers/wrapComponent';
import {DEFAULT_ICON_SIZE} from '../../constants/size';

import addWidgetBlue from '../../../assets/images/add-widget-blue.svg';
import addWidgetShadeBlue from '../../../assets/images/add-widget-shade-blue.svg';
import backBlue from '../../../assets/images/back-blue.svg';
// import backShadeBlue from '../../../assets/images/back-shade-blue.svg';
import brandBlue from '../../../assets/images/brand-blue.svg';
import calendarBlue from '../../../assets/images/calendar-blue.svg';
import calendarGrey from '../../../assets/images/calendar-grey.png';
import channelBlue from '../../../assets/images/channel-blue.svg';
import channelGrey from '../../../assets/images/channel-grey.png';
import chevronRightBlack from '../../../assets/images/chevron_right_black.svg';
import closeBlue from '../../../assets/images/close-blue.png';
import closeGrey from '../../../assets/images/close-grey.png';
import dragBlue from '../../../assets/images/drag-blue.svg';
import favoriteBlue from '../../../assets/images/favorite-blue.svg';
import favoriteFillBlue from '../../../assets/images/favorite-fill-blue.svg';
// import favoriteShadeBlue from '../../../assets/images/favorite-shade-blue.svg';
import exportBlue from '../../../assets/images/export-blue.svg';
import exportGrey from '../../../assets/images/export-grey.png';
import fileBlue from '../../../assets/images/file-blue.svg';
import fileGrey from '../../../assets/images/file-grey.png';
import filesBlue from '../../../assets/images/files-blue.svg';
import fileShadeBlue from '../../../assets/images/file-shade-blue.svg';
// import filesShadeBlue from '../../../assets/images/files-shade-blue.svg';
import fileWhite from '../../../assets/images/file-white.svg';
import filterBlue from '../../../assets/images/filter-blue.svg';
import folderBlue from '../../../assets/images/folder-blue.svg';
import filterGrey from '../../../assets/images/filter-grey.png';
import groupBlue from '../../../assets/images/group-blue.svg';
import groupShadeBlue from '../../../assets/images/user-group-filled.svg';
import groupGrey from '../../../assets/images/group-grey.png';
import helpBlue from '../../../assets/images/help-blue.svg';
import helpGrey from '../../../assets/images/help-grey.png';
import keyboardArrowDown from '../../../assets/images/keyboard_arrow_down_grey.svg';
import linearScaleBlack from '../../../assets/images/linear_scale_black.svg';
import newsflashBlue from '../../../assets/images/newsflash-blue.svg';
import newsflashGrey from '../../../assets/images/newsflash-grey.png';
import notificationBlue from '../../../assets/images/notification-blue.svg';
import pdf from '../../../assets/images/pdf-icon.svg';
import pinBlue from '../../../assets/images/pin-blue.svg';
import radioButtonCheckedBlack from '../../../assets/images/radio_button_checked_black.svg';
import radioButtonUncheckedBlack from '../../../assets/images/radio_button_unchecked_black.svg';
import rightArrowBlue from '../../../assets/images/right-arrow-blue.png';
import rightArrowGrey from '../../../assets/images/right-arrow-grey.png';
import searchArrowBackBlue from '../../../assets/images/search-arrow-back-blue.svg';
import searchBlue from '../../../assets/images/search-blue.svg';
import leftArrowBlue from '../../../assets/images/left-arrow-blue.svg';
import tagBlue from '../../../assets/images/tag-blue.svg';
import tagGrey from '../../../assets/images/tag-grey.svg';
import territoryBlue from '../../../assets/images/territory-blue.svg';
import territoryGrey from '../../../assets/images/territory-grey.png';
import userBlue from '../../../assets/images/user-blue.svg';
import userGrey from '../../../assets/images/user-grey.png';
import userShadeBlue from '../../../assets/images/user-filled.svg';
import widgetBlue from '../../../assets/images/widget-blue.svg';
import widgetGrey from '../../../assets/images/widget-grey.png';
// TODO ADD GROUP SHADE FROM JORGI
type IconProps = {
  name: ?string;
  color?: | 'blue'
    | 'grey'
    | 'white'
    | 'black'
    | 'fillBlue'
    | 'blueShade'
    | 'shadeBlue';
  style?: StyleSheetTypes;
  // NOTE: iconStyle is necessary because material-ui keeps messing up style props.
  //       specifically Dropdown's SelectField's dropDownMenuProps's iconButton.
  iconStyle?: StyleSheetTypes;
  containerStyle?: StyleSheetTypes;
  onPress?: () => void;
};

type IconButtonProps = {
  name: string;
  style?: StyleSheetTypes;
  iconButtonStyle?: StyleSheetTypes;
  hoverColor?: string;
  onPress?: () => void;
};

export function Icon(props: IconProps) {
  let {
    name,
    color,
    style,
    iconStyle,
    containerStyle,
    onPress,
    ...otherProps
  } = props;
  let imageSource;
  switch (name) {
    case 'add-widget': {
      imageSource = {
        ...imageSource,
        blue: addWidgetBlue,
        shadeBlue: addWidgetShadeBlue,
      };
      break;
    }
    case 'back': {
      imageSource = {
        ...imageSource,
        blue: backBlue,
      };
      break;
    }
    case 'brand': {
      imageSource = {
        ...imageSource,
        blue: brandBlue,
      };
      break;
    }
    case 'calendar': {
      imageSource = {
        ...imageSource,
        blue: calendarBlue,
        grey: calendarGrey,
      };
      break;
    }
    case 'channel': {
      imageSource = {
        ...imageSource,
        blue: channelBlue,
        grey: channelGrey,
      };
      break;
    }
    case 'close': {
      imageSource = {
        ...imageSource,
        blue: closeBlue,
        grey: closeGrey,
      };
      break;
    }
    case 'drag': {
      imageSource = {
        ...imageSource,
        blue: dragBlue,
      };
      break;
    }
    case 'export': {
      imageSource = {
        ...imageSource,
        blue: exportBlue,
        grey: exportGrey,
      };
      break;
    }
    case 'favorite': {
      imageSource = {
        ...imageSource,
        blue: favoriteBlue,
        fillBlue: favoriteFillBlue,
      };
      break;
    }
    case 'file': {
      imageSource = {
        ...imageSource,
        blue: fileBlue,
        grey: fileGrey,
        white: fileWhite,
        shadeBlue: fileShadeBlue,
      };
      break;
    }
    case 'files': {
      imageSource = {
        ...imageSource,
        blue: filesBlue,
      };
      break;
    }
    case 'filter': {
      imageSource = {
        ...imageSource,
        blue: filterBlue,
        grey: filterGrey,
      };
      break;
    }
    case 'folder': {
      imageSource = {
        ...imageSource,
        blue: folderBlue,
      };
      break;
    }
    case 'territory': {
      imageSource = {
        ...imageSource,
        blue: territoryBlue,
        grey: territoryGrey,
      };
      break;
    }
    case 'group': {
      imageSource = {
        ...imageSource,
        blue: groupBlue,
        grey: groupGrey,
        blueShade: groupShadeBlue,
      };
      break;
    }
    case 'help': {
      imageSource = {
        ...imageSource,
        blue: helpBlue,
        grey: helpGrey,
      };
      break;
    }
    case 'left-arrow': {
      imageSource = {
        ...imageSource,
        blue: leftArrowBlue,
      };
      break;
    }
    case 'newsflash': {
      imageSource = {
        ...imageSource,
        blue: newsflashBlue,
        grey: newsflashGrey,
      };
      break;
    }
    case 'notification': {
      imageSource = {
        ...imageSource,
        blue: notificationBlue,
      };
      break;
    }
    case 'pdf': {
      imageSource = {
        ...imageSource,
        blue: pdf,
      };
      break;
    }
    case 'pin': {
      imageSource = {
        ...imageSource,
        blue: pinBlue,
      };
      break;
    }
    case 'right-arrow': {
      imageSource = {
        ...imageSource,
        blue: rightArrowBlue,
        grey: rightArrowGrey,
      };
      break;
    }
    case 'search': {
      imageSource = {
        ...imageSource,
        blue: searchBlue,
      };
      break;
    }
    case 'search-arrow-back': {
      imageSource = {
        ...imageSource,
        blue: searchArrowBackBlue,
      };
      break;
    }
    case 'tag': {
      imageSource = {
        ...imageSource,
        blue: tagBlue,
        grey: tagGrey,
      };
      break;
    }
    case 'user': {
      imageSource = {
        ...imageSource,
        blue: userBlue,
        grey: userGrey,
        blueShade: userShadeBlue,
      };
      break;
    }
    case 'widget': {
      imageSource = {
        ...imageSource,
        blue: widgetBlue,
        grey: widgetGrey,
      };
      break;
    }
    case 'keyboard-arrow-down': {
      imageSource = {
        ...imageSource,
        grey: keyboardArrowDown,
      };
      break;
    }
    case 'chevron-right-black': {
      imageSource = {
        ...imageSource,
        black: chevronRightBlack,
      };
      break;
    }
    case 'linear-scale-black': {
      imageSource = {
        ...imageSource,
        black: linearScaleBlack,
      };
      break;
    }
    case 'radio-button-checked-black': {
      imageSource = {
        ...imageSource,
        black: radioButtonCheckedBlack,
      };
      break;
    }
    case 'radio-button-unchecked-black': {
      imageSource = {
        ...imageSource,
        black: radioButtonUncheckedBlack,
      };
      break;
    }
    default: {
      imageSource = {
        ...imageSource,
        blue: helpBlue,
      };
    }
  }
  let iconComponent = (
    <View style={containerStyle}>
      <Image
        source={(color && imageSource[color]) || imageSource.blue}
        style={[
          {height: DEFAULT_ICON_SIZE, width: DEFAULT_ICON_SIZE},
          style,
          iconStyle,
        ]}
        resizeMode="contain"
      />
    </View>
  );
  if (onPress) {
    return (
      <IconButton onTouchTap={onPress} style={containerStyle} {...otherProps}>
        {iconComponent}
      </IconButton>
    );
  }
  return iconComponent;
}

function MaterialIcon(props: IconButtonProps) {
  let {
    name,
    style,
    iconButtonStyle,
    onPress,
    hoverColor,
    ...otherProps
  } = props;
  let snakeCaseName = name.split('-').join('_');
  let iconComponent = (
    <FontIcon
      className="material-icons"
      hoverColor={hoverColor}
      style={style}
      {...otherProps}
    >
      {snakeCaseName}
    </FontIcon>
  );
  if (onPress) {
    return (
      <IconButton
        onTouchTap={onPress}
        iconStyle={!hoverColor && style}
        style={iconButtonStyle}
        {...otherProps}
      >
        {iconComponent}
      </IconButton>
    );
  }
  return iconComponent;
}

export default wrapComponent(MaterialIcon);
