// @flow

import React from 'react';
import {Text} from '../general/components/coreUIComponents';

import AnimatedWrapper from '../general/helpers/AnimatedWrapper';
import {lipsum3} from '../fixtures/lipsum';

const HelpScene = () => <Text>{lipsum3}</Text>;

export default AnimatedWrapper(HelpScene);
