// /* global Symbol */
import 'babel-polyfill';

// NOTE: this is (temporary) solution for Map.values not having Symbol.iterator
// let mapValuesProto = Object.getPrototypeOf(new Map().values());
// mapValuesProto[Symbol.iterator] = function() {
//   return this;
// };
//   mapValuesProto['@@iterator'] = function() {
//     return this;
//   };
