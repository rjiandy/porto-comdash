// @flow

const reports = new Map();

reports.set(0, {
  name: 'Home',
  content: [1, 2, 3],
});
reports.set(1, {
  name: 'Folder 1',
  content: [4],
});
reports.set(2, {
  name: 'Folder 2',
  content: [5, 6],
});
reports.set(3, {
  name: 'File 1',
  content: 'http://www.google.com/',
});
reports.set(4, {
  name: 'Folder 1-1',
  content: [],
});
reports.set(5, {
  name: 'Folder 2-1',
  content: [],
});
reports.set(6, {
  name: 'File 2-1',
  content: 'http://www.yahoo.com/',
});

export default reports;
