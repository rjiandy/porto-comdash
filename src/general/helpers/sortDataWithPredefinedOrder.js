// @flow

export default function sortDataWithPredefinedOrder<T: *>(
  order: Array<string>,
  data: Array<T>,
  key: string
): Array<T> {
  let predefineOrderMap = new Map(
    order.map((name, i) => [name.toLowerCase(), i])
  );
  return data.sort((objectOne, objectTwo) => {
    let orderOne = 0;
    let orderTwo = 0;
    if (objectOne && objectOne.hasOwnProperty(key)) {
      orderOne =
        predefineOrderMap.get(String(objectOne[key]).toLowerCase()) || 0;
    }
    if (objectTwo && objectTwo.hasOwnProperty(key)) {
      orderTwo =
        predefineOrderMap.get(String(objectTwo[key]).toLowerCase()) || 0;
    }
    return orderOne - orderTwo;
  });
}
