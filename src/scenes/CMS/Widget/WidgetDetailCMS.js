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

import {TitleField, TargetUserGroupField} from './inputFields';

import validationMessage from './validationMessage';
import CMSSidebar from '../components/CMSSidebar';
import MultiSelectItemSidebar from '../components/MultiSelectItemSidebar';

import type {ID, Widget} from './Widget-type';
import type {Group, GroupMetadata} from '../CMS-type';
import type {RootState} from '../../../general/stores/RootState';
import type {Dispatch} from '../../../general/stores/Action';

type State = {
  isGroupSidebarShown: boolean;
  isCancelDialogOpened: boolean;
};

type Props = {
  userGroupList: Map<number, Group | GroupMetadata>;
  id: ID;
  values: Widget;
  initialValue?: Widget;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  dirty: boolean;
  isSubmitting: boolean;
  editWidget: (id: ID, values: Widget) => void;
  handleChange: (newValue: mixed) => void;
  handleBlur: () => void;
  handleSubmit: () => void;
  handleReset: () => void;
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
  onClose: () => void;
};

export class WidgetDetailCMS extends Component {
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
      <View style={styles.root}>
        <Form style={styles.form} onSubmit={handleSubmit}>
          <View style={styles.leftPane}>
            <ScrollView>
              <View style={styles.leftPaneInner}>
                <View style={styles.fieldComponent}>
                  <TitleField {...this.props} />
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
          <Text>
            {`Are you sure want to exit? This will discard all the changes that you've made`}
          </Text>
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
      title: (initialValue && initialValue.title) || '',
      widgetName: (initialValue && initialValue.widgetName) || '',
      groups: (initialValue && initialValue.groups) || [],
    };
  },
  validationSchema: Yup.object().shape({
    title: Yup.string().required(validationMessage.title.required),
    groups: Yup.array(),
  }),
  handleSubmit: (values: Widget, {props}: {props: Props}) => {
    let {id, editWidget, onClose} = props;
    if (id) {
      editWidget(id, values);
    }
    onClose();
  },
  displayName: 'WidgetDetailCMSForm', // helps with React DevTools
});

function mapStateToProps(state: RootState) {
  let {cmsState: {groupCMS}} = state;
  return {
    userGroupList: groupCMS.groups,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    editWidget: (id: ID, widget: Widget) => {
      dispatch({
        type: 'UPDATE_WIDGET_REQUESTED',
        widget,
        id,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  formikWrapper(WidgetDetailCMS),
);
