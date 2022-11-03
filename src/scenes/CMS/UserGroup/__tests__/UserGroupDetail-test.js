import React from 'react';
import renderer from 'react-test-renderer';
import {UserGroupDetail} from '../UserGroupDetail';

jest.mock('../../../../general/components/coreUIComponents', () => ({
  View: 'View',
  Form: 'Form',
  Button: 'Button',
}));

jest.mock('../../../../general/components/UIComponents', () => ({
  Widget: 'Widget',
}));

jest.mock('../inputFields', () => ({
  MembersField: 'MembersField',
  TitleField: 'TitleField',
  AssignedNewsFlashField: 'AssignedNewsFlashField',
  AssignedReportField: 'AssignedReportField',
  AssignedHelpLinkField: 'AssignedHelpLinkField',
}));

jest.mock('../../components/CMSSidebar', () => 'CMSSidebar');
jest.mock(
  '../../components/MultiSelectItemSidebar',
  () => 'MultiSelectItemSidebar'
);

let userList = new Map();
let newsFlashList = new Map();
let reportList = new Map();
let helpLinkList = new Map();

// TODO: Fix this test.
it.skip('should render UserGroupDetail that match snapshot', () => {
  expect(
    renderer.create(
      <UserGroupDetail
        userList={userList}
        newsFlashList={newsFlashList}
        reportList={reportList}
        helpLinkList={helpLinkList}
        values={{}}
        touched={{}}
        errors={{}}
        dirty={false}
        isSubmitting={false}
        sendForm={() => {}}
        handleChange={() => {}}
        handleBlur={() => {}}
        handleSubmit={() => {}}
        handleReset={() => {}}
        setFieldValue={() => {}}
        setFieldTouched={() => {}}
        setFieldError={() => {}}
      />
    )
  ).toMatchSnapshot();
});
