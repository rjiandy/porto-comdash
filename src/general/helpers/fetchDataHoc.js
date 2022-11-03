// @flow
import React, {Component} from 'react';
import {StyleSheet} from 'react-primitives';
import {View, ErrorComponent} from '../components/coreUIComponents.js';
import autobind from 'class-autobind';
import fetchJSON from './fetchJSON';
import CircularProgress from 'material-ui/CircularProgress';
import {PALE_RED, LIGHT_GREY} from '../constants/colors.js';

type State = {
  [key: string]: mixed;
  errorMessage: ?string;
  isLoading: boolean;
};

type Props = {
  [keys: string]: mixed;
};

function fetchDataHoc(url: string): ReactClass<*> {
  return (WrappedComponent: ReactClass<*>) => {
    return class FechData extends Component {
      state: State;
      props: Props;
      constructor() {
        super(...arguments);
        autobind(this);
        this.state = {
          isLoading: true,
          errorMessage: null,
        };
      }
      componentDidMount() {
        fetchJSON(url, {})
          .then(
            (data) =>
              Array.isArray(data)
                ? this.setState({data, isLoading: false})
                : this.setState({...data, isLoading: false})
          )
          .catch((error: Error) => {
            this.setState({isLoading: false, errorMessage: error.message});
          });
      }

      render() {
        let {isLoading, errorMessage} = this.state;
        if (isLoading) {
          return <LoadingComponent />;
        } else if (errorMessage) {
          return <ErrorComponent errorMessage={errorMessage} url={url} />;
        } else {
          return <WrappedComponent {...this.props} {...this.state} />;
        }
      }
    };
  };
}

function LoadingComponent() {
  return (
    <View style={styles.container}>
      <CircularProgress />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: LIGHT_GREY,
    borderRadius: 4,
  },
  title: {
    color: PALE_RED,
    marginVertical: 15,
    flexWrap: 'wrap',
  },
  errorMessage: {
    flexWrap: 'wrap',
  },
});

export default fetchDataHoc;
