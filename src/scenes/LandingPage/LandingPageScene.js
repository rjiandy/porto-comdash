// @flow

import React from 'react';
import LandingPageBrandTerritory from './LandingPageBrandTerritory';

type Props = {
  title: string;
};

export default function LandingPageScene(props: Props) {
  // here will the logic to show landing page for (Brand or Territory) or Channel Manager
  return <LandingPageBrandTerritory {...props} />;
}
