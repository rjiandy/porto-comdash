// @flow

let validationMessage = {
  name: {
    required: 'Report name is required',
  },
  linkUrl: {
    required: 'Report link is required',
    urlNotValid: 'Report link is not a valid URL',
  },
  groups: {
    min: 'Minimum one target user group required',
    itemNotListed: 'values not included in user group list',
    emptyValue: 'please fill the field first',
  },
};
export default validationMessage;
