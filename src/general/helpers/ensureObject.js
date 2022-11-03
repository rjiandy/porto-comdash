// @flow

export default function ensureObject(value: mixed): ?Object {
  if (typeof value === 'object' && value != null && !Array.isArray(value)) {
    return value;
  }
}
