// @flow
import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';
import {Route} from 'react-router-dom';

import widgets from '../routes/widgets';
import {View} from '../general/components/coreUIComponents';

type Props = {
  style?: StyleSheetTypes;
};

class WidgetDisplay extends Component {
  props: Props;

  render() {
    let {style, ...otherProps} = this.props;
    return (
      <View style={[styles.container, style]} {...otherProps}>
        {widgets.map(({key, Component, title, otherProps}) => (
          <Route
            key={key}
            path={`/dashboard/${key}`}
            component={() => <Component title={title} {...otherProps} />}
            title={title}
          />
        ))}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default WidgetDisplay;
