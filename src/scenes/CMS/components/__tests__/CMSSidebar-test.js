// @flow

import React from 'react';
import renderer from 'react-test-renderer';

import {View} from '../../../../general/components/coreUIComponents';
import CMSSidebar from '../CMSSidebar';

jest.mock('../../../../general/components/coreUIComponents', () => ({
  Text: 'Text',
  View: 'View',
}));

it('should render a CMS Sidebar with Correct Children', () => {
  let AddGroupSidebar = View;
  expect(
    renderer
      .create(
        <CMSSidebar isOpen={true} title="Group List">
          <AddGroupSidebar props={{}} />
        </CMSSidebar>
      )
      .toJSON()
  ).toMatchSnapshot();
});
