import * as mockjs from 'mockjs';
(() => {
  const id = mockjs.mock('@guid');
  const pid2 = mockjs.mock('@guid');
  const pid3 = mockjs.mock('@guid');
  mockjs.mock('http://127.0.0.1:3000/mainwithmanytoone',
    {
      'id': id,
      'p2': pid2,
      // 'p3': pid3,
    }
  );
  mockjs.mock('http://127.0.0.1:3000/mainwithmanytoonemulti',
    [
      {
        'id': mockjs.mock('@guid'),
        'p2': pid3,
        // 'p3': pid3,
      },
      {
        'id': mockjs.mock('@guid'),
        'p2': pid3,
        // 'p3': pid3,
      },
    ]
  );
  mockjs.mock('http://127.0.0.1:3000/many2onep2',
    [
      {
        'id': pid2,
        'city': mockjs.mock('@city')
      },
      {
        'id': pid3,
        'city': mockjs.mock('@city')
      },
    ]
  );
  // mockjs.mock('http://127.0.0.1:3000/onetoonep3', {
  //   'id': id,
  //   'province': mockjs.mock('@province')
  // })
  // mockjs.setup({ timeout: 0 })
})();

