import {StyleSheet} from 'react-primitives';

import {TEXT_COLOR} from '../../general/constants/colors';
import {SMALL_FONT_SIZE} from '../../general/constants/text';

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    justifyContent: 'center',
    marginRight: 20,
    marginBottom: 15,
  },
  addTargetUserButton: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingTop: 5,
  },
  floatingLabel: {
    fontSize: 12,
    lineHeight: 22,
    pointerEvents: 'none',
    userSelect: 'none',
    color: TEXT_COLOR,
    marginBottom: 3,
  },
  button: {
    height: 42,
  },
  iconButton: {
    fontSize: 18,
    paddingBottom: 2,
  },
  errorText: {
    fontSize: SMALL_FONT_SIZE,
    lineHeight: 12,
    color: 'rgb(244, 67, 54)',
    marginTop: 5,
    paddingLeft: 15,
  },
});

export default styles;
