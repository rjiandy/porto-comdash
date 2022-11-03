// @flow

let validationMessage = {
  title: {
    required: 'Widget title is required',
  },
  groups: {
    min: 'Minimum one target user group required',
    itemNotListed: 'values not included in user group list',
    emptyValue: 'please fill the field first',
  },
};
export default validationMessage;
