// @flow

let newsFlashList = new Map();
newsFlashList.set('newsFlash1', {
  id: 'newsFlash1',
  title: 'Rapat Umum Pemegang Saham',
  startShowNewsDate: '2017-10-10T00:00:00.000Z',
  endShowNewsDate: '2017-10-11T00:00:00.000Z',
  targetUsers: ['Jakarta'],
  active: true,
  pdfUrl: '/assets/pdf1.pdf',
  pdfName: 'sampoerna news flash 1.pdf',
  pdfSize: 3000000,
  newsThumbnailUrl:
    'http://cdn2.tstatic.net/tribunnews/foto/bank/images/sampoerna-rups_20161118_104619.jpg',
  postedBy: {name: 'admin', email: 'admin@admin.com'},
  lastEdited: '2017-10-10T00:00:00.000Z',
});
newsFlashList.set('newsFlash2', {
  id: 'newsFlash2',
  title: 'Penghargaan Finansial Kawasan Asia',
  startShowNewsDate: '2017-10-10T00:00:00.000Z',
  endShowNewsDate: '2017-10-11T00:00:00.000Z',
  targetUsers: ['Jakarta'],
  active: true,
  pdfUrl: '/assets/pdf2.pdf',
  pdfName: 'sampoerna news flash 2.pdf',
  pdfSize: 2000000,
  newsThumbnailUrl:
    'http://img.antaranews.com/new/2016/01/ori/20160128Janelle-Sampoerna.jpg',
  postedBy: {name: 'admin', email: 'admin@admin.com'},
  lastEdited: '2017-10-10T00:00:00.000Z',
});
newsFlashList.set('newsFlash3', {
  id: 'newsFlash3',
  title: 'Other News Flash',
  startShowNewsDate: '2017-10-10T00:00:00.000Z',
  endShowNewsDate: '2017-10-11T00:00:00.000Z',
  targetUsers: ['Jakarta'],
  active: true,
  pdfUrl: '/assets/pdf3.pdf',
  pdfName: 'sampoerna news flash 3.pdf',
  pdfSize: 500000,
  newsThumbnailUrl:
    'http://www.sampoernastrategic.com/modul/telecoms/slider2.jpg',
  postedBy: {name: 'admin', email: 'admin@admin.com'},
  lastEdited: '2017-10-10T00:00:00.000Z',
});

export default newsFlashList;
