import './polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './index.css';
import App from './App';

injectTapEventPlugin();
ReactDOM.render(<App />, document.getElementById('root'));
