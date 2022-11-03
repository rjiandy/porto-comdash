let notificationList = new Map();
notificationList.set('1', {
  id: '1',
  title: 'Cosmetic Surgery In A Nutshell',
  type: 'newsflash',
  time: new Date('September 25, 2017 17:20'),
  hasRead: false,
});
notificationList.set('2', {
  id: '2',
  title: 'Profiles Of The Powerful Advertising Exec Steve Grasse',
  type: 'newsflash',
  time: new Date('September 24, 2017 16:00'),
  hasRead: false,
});
notificationList.set('3', {
  id: '3',
  title: 'Differentiate Yourself And Attract More Attention Sales And Profits',
  type: 'newsflash',
  time: new Date('September 21, 2017 16:00'),
  hasRead: true,
});
notificationList.set('4', {
  id: '4',
  title: 'This Is A Test Notification',
  type: 'newsflash',
  time: new Date('September 20, 2017 16:00'),
  hasRead: true,
});

export default notificationList;
