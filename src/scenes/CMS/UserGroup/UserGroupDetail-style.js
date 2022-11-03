// @flow

import {StyleSheet} from 'react-primitives';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 20,
    borderRadius: 8,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    flex: 1,
  },
  sidebar: {
    paddingVertical: 10,
  },
  form: {
    flex: 1,
    flexDirection: 'row',
  },
  rowField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowComponent: {
    marginRight: 0,
  },
  fieldComponent: {
    width: '100%',
    marginBottom: 30,
  },
  inputStyle: {
    height: 40,
    borderRadius: 4,
  },
  buttonSubmit: {
    marginBottom: 10,
  },
  multiSelectionField: {
    marginBottom: 15,
  },
});

export default styles;
