// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import Yup from 'yup';
import {StyleSheet} from 'react-primitives';
import Dialog from 'material-ui/Dialog';

import {
  View,
  Form,
  ScrollView,
  Button,
  Text,
} from '../../../general/components/coreUIComponents';
import {colorStyles} from '../../../general/constants/colors.js';

import {NameField, LinkField, TargetUserGroupField} from './inputFields';

import validationMessage from './validationMessage';
import CMSSidebar from '../components/CMSSidebar';
import MultiSelectItemSidebar from '../components/MultiSelectItemSidebar';

import type {ID, HelpLink} from './HelpLink-type';
import type {Group, GroupMetadata} from '../CMS-type';
import type {RootState} from '../../../general/stores/RootState';
import type {Dispatch} from '../../../general/stores/Action';

type State = {
  isGroupSidebarShown: boolean;
  isCancelDialogOpened: boolean;
};

type Props = {
  userGroupList: Map<number, Group | GroupMetadata>;
  id: ?string;
  values: HelpLink;
  initialValue?: HelpLink;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  dirty: boolean;
  isSubmitting: boolean;
  addReport: (values: HelpLink) => void;
  editReport: (id: ?string, values: HelpLink) => void;
  handleChange: (newValue: mixed) => void;
  handleBlur: () => void;
  handleSubmit: () => void;
  handleReset: () => void;
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
  onClose: () => void;
};

export class HelpLinkDetailCMS extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isGroupSidebarShown: false,
      isCancelDialogOpened: false,
    };
  }

  render() {
    let {isGroupSidebarShown, isCancelDialogOpened} = this.state;
    let {
      handleSubmit,
      handleReset,
      values,
      userGroupList,
      onClose,
      isSubmitting,
      errors,
    } = this.props;
    return (
      <View style={[styles.root, colorStyles.thinShadow]}>
        <Form style={styles.form} onSubmit={handleSubmit}>
          <View style={styles.leftPane}>
            <ScrollView>
              <View style={styles.leftPaneInner}>
                <View style={styles.fieldComponent}>
                  <NameField {...this.props} />
                </View>
                <View style={styles.fieldComponent}>
                  <LinkField {...this.props} />
                </View>
                <View style={[styles.fieldComponent, {marginBottom: 15}]}>
                  <TargetUserGroupField
                    toggleAddGroupSidebar={this._toggleAddGroupSidebar}
                    {...this.props}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
          <CMSSidebar
            style={styles.sidebar}
            isOpen={isGroupSidebarShown}
            title="Group List"
            isSaveDisabled={isSubmitting || Object.keys(errors).length > 0}
            onSave={handleSubmit}
            onCancel={handleReset}
            onCancelPress={() => this.setState({isCancelDialogOpened: true})}
          >
            <MultiSelectItemSidebar
              searchPlaceholder="Search group..."
              icon="group"
              noItemFound="No group found. Please try another keyword."
              itemList={[...userGroupList.values()].map(({id, groupName}) => ({
                id: id.toString(),
                name: groupName || '',
              }))}
              selectedItems={values['groups'].map(({id}) => id.toString())}
              onConfirm={(selectedGroups) =>
                this._addTargetUserFilter(selectedGroups)}
              toggleSidebar={this._toggleAddGroupSidebar}
              addDataButtonLabel="Create New Group"
            />
          </CMSSidebar>
        </Form>
        <Dialog
          title="Back Confirmation"
          actions={[
            <Button
              secondary
              key="cancel"
              label="Cancel"
              style={styles.confirmationButton}
              onPress={() => this.setState({isCancelDialogOpened: false})}
            />,
            <Button
              secondary
              key="discard"
              label="Discard"
              style={styles.confirmationButton}
              onPress={onClose}
            />,
          ]}
          modal={false}
          open={isCancelDialogOpened}
          onRequestClose={() =>
            this.setState({
              isCancelDialogOpened: false,
            })}
        >
          <Text
          >{`Are you sure want to exit? This will discard all the changes that you've made`}</Text>
        </Dialog>
      </View>
    );
  }

  _addTargetUserFilter(selectedGroups: Array<string>) {
    let {setFieldValue, setFieldTouched, userGroupList} = this.props;
    setFieldValue(
      'groups',
      selectedGroups.map((id) => {
        let group = userGroupList.get(Number(id));
        if (group) {
          return {
            id: group.id,
            groupName: group.groupName,
          };
        }
        return null;
      }),
    );
    setImmediate(() => {
      setFieldTouched('groups', true);
    });
  }

  _toggleAddGroupSidebar(command?: 'open' | 'close') {
    let {isGroupSidebarShown} = this.state;
    if (command === 'open') {
      this.setState({isGroupSidebarShown: true});
    } else if (command === 'close') {
      this.setState({isGroupSidebarShown: false});
    } else {
      this.setState({isGroupSidebarShown: !isGroupSidebarShown});
    }
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    borderRadius: 8,
  },
  sidebar: {
    paddingVertical: 10,
  },
  form: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPane: {
    flex: 1,
  },
  leftPaneInner: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  rowField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowComponent: {
    marginRight: 0,
  },
  fieldComponent: {
    marginBottom: 30,
  },
  buttonSubmit: {
    marginBottom: 10,
  },
  confirmationButton: {
    borderColor: 'transparent',
  },
});

let formikWrapper = Formik({
  mapPropsToValues: (props: Props) => {
    let {initialValue} = props;
    return {
      name: (initialValue && initialValue.name) || '',
      linkUrl: (initialValue && initialValue.linkUrl) || '',
      groups: (initialValue && initialValue.groups) || [],
      createdDate:
        (initialValue && initialValue.createdDate) || new Date().toISOString(),
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(validationMessage.name.required),
    linkUrl: Yup.string()
      .required(validationMessage.linkUrl.required)
      .url(validationMessage.linkUrl.urlNotValid),
    groups: Yup.array(),
  }),
  handleSubmit: (values: HelpLink, {props}: {props: Props}) => {
    let {id, addReport, editReport, onClose} = props;
    if (id) {
      editReport(id, values);
    } else {
      addReport(values);
    }
    onClose();
  },
  displayName: 'HelpLinkCMSForm', // helps with React DevTools
});

function mapStateToProps(state: RootState) {
  let {cmsState: {groupCMS}} = state;
  return {
    userGroupList: groupCMS.groups,
  };
}

// eslint-disable-next-line no-unused-vars
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    addReport: (helpLink: HelpLink) => {
      dispatch({
        type: 'ADD_HELP_LINK_REQUESTED',
        helpLink,
      });
    },
    editReport: (id: ID, helpLink: HelpLink) => {
      dispatch({
        type: 'UPDATE_HELP_LINK_REQUESTED',
        helpLink,
        id,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  formikWrapper(HelpLinkDetailCMS),
);
