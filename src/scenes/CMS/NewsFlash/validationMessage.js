// @flow

let validationMessage = {
  title: {
    required: 'Title is required',
  },
  fileUrl: {
    required: 'Please attach PDF',
  },
  fileSize: {
    required: 'PDF size is not detected, Please try to upload it again',
  },
  fileName: {
    required: 'PDF name is not detected, Please try to upload it again',
  },
  imageUrl: {
    required: 'Please attach News Thumbnail',
  },
  startingTime: {
    required: 'Start show date is required',
    min: 'Start show date cannot be earlier than today',
  },
  endingTime: {
    required: 'End show date is required',
    min: 'End show date must be the same day or later than start show date',
  },
  groups: {
    min: 'Minimum one target user group required',
    itemNotListed: 'values not included in user group list',
    emptyValue: 'please fill the field first',
  },
};

export default validationMessage;
