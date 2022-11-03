// @flow

export default function groupDataByKeyToMap(data: Array<{[key: string]: any}>, key: string) {
  let dataSource = new Map();
  if (data) {
    data.forEach((item) => {
      let objectKey = item[key];
      let currentData = dataSource.get(objectKey);
      let newData = currentData ? [...currentData, item] : [item];
      dataSource.set(objectKey, newData);
    });
    return dataSource;
  } else {
    return data;
  }
}
