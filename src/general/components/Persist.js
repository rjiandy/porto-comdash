// @flow

import {Component} from 'react';
import autobind from 'class-autobind';
import isEqual from 'ramda/src/equals';
import debounce from 'lodash/debounce';

type Props = {
  name: string;
  data: Object;
  onMount: (data: any) => void;
  debounce?: number;
};

class Persist extends Component {
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
  }

  _onPersist = debounce((data: Object) => {
    let {name} = this.props;
    let cachedData = btoa(JSON.stringify(data));
    sessionStorage.setItem(btoa(name), cachedData);
  }, 500);

  componentWillReceiveProps(nextProps: Props) {
    if (!isEqual(nextProps.data, this.props.data)) {
      this._onPersist(nextProps.data);
    }
  }

  componentDidMount() {
    let {name, onMount} = this.props;
    const data = sessionStorage.getItem(btoa(name));
    if (data) {
      onMount(JSON.parse(atob(data)));
    }
  }

  render() {
    return null;
  }
}

export default Persist;
