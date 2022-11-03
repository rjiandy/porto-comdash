// @flow

import React from 'react';
import {StyleSheet} from 'react-primitives';
import {
  View,
  Tag,
  Button,
  Text,
} from '../../../../general/components/coreUIComponents';
import {GREY} from '../../../../general/constants/colors';

import multiSelectItemStyles from '../../MultiSelectItem-style';

type UserGroup = any;

type Props = {
  // TODO: get this type from redux
  helpLinkList: Map<string, {id: string; name: string}>;

  values: UserGroup;
  touched: {[key: string]: boolean};
  errors: {[key: string]: string};
  setFieldValue: (field: string, value: mixed) => void;
  setFieldTouched: (field: string, touchedValue: boolean) => void;
  setFieldError: (field: string, errorMessage: string) => void;
  toggleSideBar: (command: 'open' | 'close') => void;
};

export default function AssignedHelpLinkField(props: Props) {
  let {
    values,
    errors,
    touched,
    toggleSideBar,
    helpLinkList,
    setFieldValue,
    setFieldTouched,
  } = props;
  return (
    <View>
      <Text
        style={[
          multiSelectItemStyles.floatingLabel,
          errors.assignedHelpLinkList && touched.assignedHelpLinkList
            ? {color: 'red'}
            : null,
        ]}
      >
        HELP LINK
      </Text>
      <View style={multiSelectItemStyles.field}>
        {values.assignedHelpLinkList.map((linkID, index) => {
          let link = helpLinkList.get(linkID) || {name: ''};
          return (
            <View key={index} style={multiSelectItemStyles.tag}>
              <Tag
                label={link.name}
                icon="link"
                iconStyle={{color: GREY}}
                onRequestDelete={() => {
                  removeAssignedHelpLink(
                    linkID,
                    values,
                    setFieldValue,
                    setFieldTouched,
                  );
                }}
              />
            </View>
          );
        })}
        <View style={multiSelectItemStyles.addTargetUserButton}>
          <Button
            secondary
            label="Assign Help Link"
            // onPress={this._addTargetUserFilter}
            onPress={() => toggleSideBar('open')}
            icon="add"
            iconPosition="left"
            iconStyle={StyleSheet.flatten(multiSelectItemStyles.iconButton)}
            style={StyleSheet.flatten(multiSelectItemStyles.button)}
          />
          <Text style={multiSelectItemStyles.errorText}>
            {errors.assignedHelpLinkList && touched.assignedHelpLinkList
              ? errors.assignedHelpLinkList
              : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function removeAssignedHelpLink(
  id: string,
  values: UserGroup,
  setFieldValue: (field: string, value: mixed) => void,
  setFieldTouched: (field: string, touchedValue: boolean) => void,
) {
  let oldValue = values['assignedHelpLinkList'];
  let selectedValues = [...oldValue];
  let removedIndex = selectedValues.indexOf(id);
  if (removedIndex > -1) {
    selectedValues.splice(removedIndex, 1);
  }
  setFieldValue('assignedHelpLinkList', selectedValues);
  setFieldTouched('assignedHelpLinkList', true);
}
