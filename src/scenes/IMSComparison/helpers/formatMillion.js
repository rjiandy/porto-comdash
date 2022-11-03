// @flow

export default function formatMillion(value: ?number | 'NULL') { // TODO: REMOVE THIS FUNCTION LATER
  return !isNaN(value) ? (Number(value) / 1000000).toFixed() : value;
}

// No test on this helper because they said it will be formated from the backend
// Will remove this later after the data on backend is formated
