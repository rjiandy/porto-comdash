// @flow

import React, {Component} from 'react';
import autobind from 'class-autobind';
import Dialog from 'material-ui/Dialog';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import Yup from 'yup';
import {StyleSheet} from 'react-primitives';

import {
  View,
  Form,
  ScrollView,
  Button,
  Text,
} from '../../../general/components/coreUIComponents';
import {colorStyles} from '../../../general/constants/colors.js';

import {
  TargetUserGroupField,
  StartEndShowDateField,
  TitleField,
  ActiveField,
  UploadPDF,
} from './inputFields';

import validationMessage from './validationMessage';
import CMSSidebar from '../components/CMSSidebar';
import MultiSelectItemSidebar from '../components/MultiSelectItemSidebar';

import type {ID, NewsFlash} from './NewsFlash-type';
import type {Group, GroupMetadata} from '../CMS-type';
import type {RootState} from '../../../general/stores/RootState';
import type {Dispatch} from '../../../general/stores/Action';

type State = {
  isGroupSidebarShown: boolean;
  isDeleteConfirmationDialogOpened: boolean;
};

type Props = {
  userGroupList: Map<number, Group | GroupMetadata>;
  id: ?ID;
  news: ?NewsFlash;
  values: NewsFlash;
  initialValue?: NewsFlash;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  dirty: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  serverError: ?Error;
  addNewsFlash: (values: NewsFlash) => void;
  editNewsFlash: (id: ID, values: NewsFlash) => void;
  handleChange: (newValue: mixed) => void;
  handleBlur: () => void;
  handleSubmit: () => void;
  handleReset: () => void;
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
  onClose: () => void;
};

export class NewsFlashDetailCMS extends Component {
  state: State;
  props: Props;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {
      isGroupSidebarShown: false,
      isDeleteConfirmationDialogOpened: false,
    };
  }

  render() {
    let {isGroupSidebarShown, isDeleteConfirmationDialogOpened} = this.state;
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
                  <TitleField {...this.props} />
                </View>
                <View style={[styles.fieldComponent, styles.rowField]}>
                  <View style={styles.rowComponent}>
                    <StartEndShowDateField {...this.props} />
                  </View>
                  <View style={styles.rowComponent}>
                    <ActiveField {...this.props} />
                  </View>
                </View>
                <View style={[styles.fieldComponent, {marginBottom: 15}]}>
                  <TargetUserGroupField
                    toggleAddGroupSidebar={this._toggleAddGroupSidebar}
                    {...this.props}
                  />
                </View>
                <View style={styles.fieldComponent}>
                  <UploadPDF {...this.props} />
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
            onCancelPress={() =>
              this.setState({isDeleteConfirmationDialogOpened: true})}
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
              key="cancel"
              secondary
              label="Cancel"
              onPress={() =>
                this.setState({isDeleteConfirmationDialogOpened: false})}
              style={styles.confirmationButton}
            />,
            <Button
              key="discard"
              secondary
              label="Discard"
              onPress={onClose}
              style={styles.confirmationButton}
            />,
          ]}
          modal={false}
          open={isDeleteConfirmationDialogOpened}
          onRequestClose={() =>
            this.setState({isDeleteConfirmationDialogOpened: false})}
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
      title: (initialValue && initialValue.title) || '',
      startingTime: (initialValue && initialValue.startingTime) || '',
      endingTime: (initialValue && initialValue.endingTime) || '',
      groups: (initialValue && initialValue.groups) || [],
      status: (initialValue && initialValue.status) || true,
      fileUrl: (initialValue && initialValue.fileUrl) || '',
      fileSize: (initialValue && initialValue.fileSize) || 0,
      fileName: (initialValue && initialValue.fileName) || '',
      imageUrl: (initialValue && initialValue.imageUrl) || '',
      createdDate:
        (initialValue && initialValue.createdDate) || new Date().toISOString(),
    };
  },
  validationSchema: (props: Props) => {
    if (props.id != null) {
      return Yup.object().shape({
        title: Yup.string().required(validationMessage.title.required),
        startingTime: Yup.date().required(
          validationMessage.startingTime.required,
        ),
        endingTime: Yup.date()
          .required(validationMessage.endingTime.required)
          .min(Yup.ref('startingTime'), validationMessage.endingTime.min),
        groups: Yup.array(),
        fileUrl: Yup.string().required(validationMessage.fileUrl.required),
        fileSize: Yup.number().required(validationMessage.fileSize.required),
        fileName: Yup.string().required(validationMessage.fileName.required),
        imageUrl: Yup.string().required(validationMessage.imageUrl.required),
      });
    } else {
      return Yup.object().shape({
        title: Yup.string().required(validationMessage.title.required),
        startingTime: Yup.date()
          .required(validationMessage.startingTime.required)
          .min(new Date().toDateString(), validationMessage.startingTime.min),
        endingTime: Yup.date()
          .required(validationMessage.endingTime.required)
          .min(Yup.ref('startingTime'), validationMessage.endingTime.min),
        groups: Yup.array(),
        fileUrl: Yup.string().required(validationMessage.fileUrl.required),
        fileSize: Yup.number().required(validationMessage.fileSize.required),
        fileName: Yup.string().required(validationMessage.fileName.required),
        imageUrl: Yup.string().required(validationMessage.imageUrl.required),
      });
    }
  },
  handleSubmit: (values: NewsFlash, {props}: {props: Props}) => {
    let {addNewsFlash, editNewsFlash, id, onClose} = props;
    if (id) {
      editNewsFlash(id, values);
    } else {
      addNewsFlash(values);
    }
    onClose();
  },
  displayName: 'NewsFlashCMSForm', // helps with React DevTools
});

function mapStateToProps(state: RootState) {
  let {cmsState} = state;
  let {groupCMS, newsFlashCMS: {isLoading, error}} = cmsState;
  return {
    userGroupList: groupCMS.groups,
    isLoading,
    serverError: error,
  };
}

// eslint-disable-next-line no-unused-vars
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    addNewsFlash: (newsFlash: NewsFlash) => {
      dispatch({
        type: 'ADD_NEWS_FLASH_REQUESTED',
        newsFlash,
      });
    },
    editNewsFlash: (id: ID, newsFlash: NewsFlash) => {
      dispatch({
        type: 'UPDATE_NEWS_FLASH_REQUESTED',
        newsFlash,
        id,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  formikWrapper(NewsFlashDetailCMS),
);
