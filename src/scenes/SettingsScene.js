// @flow

import React from 'react';
import {Text} from '../general/components/coreUIComponents.js';

import AnimatedWrapper from '../general/helpers/AnimatedWrapper';
import {lipsum4} from '../fixtures/lipsum';

const SettingScene = () => <Text>{lipsum4}</Text>;

export default AnimatedWrapper(SettingScene);
