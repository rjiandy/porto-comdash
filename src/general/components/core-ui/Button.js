// @flow

import React from 'react';
import MaterialIcon, {Icon} from './Icon';
import {FlatButton, RaisedButton} from 'material-ui';
import {THEME_COLOR, DARKER_BLUE} from '../../constants/colors';
import {ALTERNATIVE_FONT_FAMILY, SMALL_FONT_SIZE} from '../../constants/text';
import wrapComponent from '../../helpers/wrapComponent';

type Props = {
  label?: string;
  labelStyle?: {[key: string]: string | number};
  onPress: () => void;
  raised?: boolean;
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: {[key: string]: string | number};
  icon?: string;
  iconSvg?: string;
  svgContainerStyle?: {[key: string]: string | number};
  iconStyle?: {[key: string]: string | number};
  iconPosition?: 'left' | 'right';
};

const DEFAULT_PRIMARY_BUTTON_PROPS = {
  backgroundColor: THEME_COLOR,
  hoverColor: DARKER_BLUE,
};

const DEFAULT_SECONDARY_BUTTON_PROPS = {
  backgroundColor: 'white',
};

export function Button(props: Props) {
  let {
    onPress,
    icon,
    iconSvg,
    svgContainerStyle,
    primary,
    secondary,
    iconPosition,
    iconStyle,
    raised,
    style,
    labelStyle,
    disabled,
    ...otherProps
  } = props;

  let defaultProps = {};
  let composedButtonStyle = {};
  let composedLabelStyle = {};
  let composedIconStyle = {};

  if (primary) {
    Object.assign(defaultProps, DEFAULT_PRIMARY_BUTTON_PROPS);
    Object.assign(composedButtonStyle, styles.primaryButton);
    Object.assign(
      composedLabelStyle,
      styles.primaryLabel,
      styles.font,
      labelStyle,
    );
    Object.assign(composedIconStyle, styles.primaryIcon, iconStyle);
  } else if (secondary) {
    Object.assign(defaultProps, DEFAULT_SECONDARY_BUTTON_PROPS);
    Object.assign(composedButtonStyle, styles.secondaryButton);
    Object.assign(
      composedLabelStyle,
      styles.secondaryLabel,
      styles.font,
      labelStyle,
    );
    Object.assign(composedIconStyle, styles.secondaryIcon, iconStyle);
  } else {
    Object.assign(composedButtonStyle, styles.defaultButton);
    Object.assign(composedLabelStyle, styles.font, labelStyle);
    Object.assign(composedIconStyle, iconStyle);
  }

  let ButtonComponent;
  let buttonStyle = {};
  if (raised) {
    ButtonComponent = RaisedButton;
    buttonStyle = {
      disabledBackgroundColor: 'grey',
      style: Object.assign({}, styles.defaultButton, style),
      buttonStyle: {
        ...composedButtonStyle,
        cursor: disabled && 'not-allowed',
      },
      labelStyle: composedLabelStyle,
    };
  } else {
    ButtonComponent = FlatButton;
    buttonStyle = {
      style: {
        cursor: disabled && 'not-allowed',
        ...composedButtonStyle,
        ...style,
      },
      labelStyle: composedLabelStyle,
    };
  }

  let iconComponent;
  let iconPositionInButton;

  if (icon) {
    iconComponent = <MaterialIcon name={icon} style={composedIconStyle} />;
  }
  if (iconSvg) {
    iconComponent = (
      <Icon
        name={iconSvg}
        style={composedIconStyle}
        containerStyle={svgContainerStyle}
      />
    );
  }
  if (iconPosition && iconPosition === 'right') {
    iconPositionInButton = {labelPosition: 'before'};
  } else {
    iconPositionInButton = {labelPosition: 'after'};
  }
  // TODO set up background color for disabled
  return (
    <ButtonComponent
      onTouchTap={onPress}
      icon={iconComponent}
      backgroundColor={disabled && 'grey'}
      disabled={disabled}
      {...iconPositionInButton}
      {...buttonStyle}
      {...defaultProps}
      {...otherProps}
    />
  );
}

const styles = {
  defaultButton: {
    borderRadius: 3,
  },
  primaryButton: {
    borderRadius: 3,
    flexDirection: 'row',
  },
  secondaryButton: {
    border: `1px solid ${THEME_COLOR}`,
    borderRadius: 3,
    flexDirection: 'row',
  },
  font: {
    fontFamily: ALTERNATIVE_FONT_FAMILY,
    fontSize: SMALL_FONT_SIZE,
    fontWeight: '200',
  },
  primaryLabel: {
    color: 'white',
  },
  secondaryLabel: {
    color: THEME_COLOR,
  },
  primaryIcon: {
    color: 'white',
  },
  secondaryIcon: {
    color: THEME_COLOR,
  },
};

export default wrapComponent(Button);
