import * as mockjs from 'mockjs';
(() => {
  const id = mockjs.mock('@guid');
  const pid2 = mockjs.mock('@guid');
  const pid3 = mockjs.mock('@guid');
  mockjs.mock('http://127.0.0.1:3000/mainwithonetomany', {
    'id': id,
    'p2': pid2,
    // 'p3': pid3,
  });
  mockjs.mock('http://127.0.0.1:3000/mainwithonetomanymulti',
    [
      {
        'id': id,
        'p2': pid2,
        // 'p3': pid3,
      },
      {
        'id': id,
        'p2': pid3,
        // 'p3': pid3,
      },
    ]
  );
  mockjs.mock('http://127.0.0.1:3000/onetomanyp2',
    mockjs.mock({
      'array': [
        {
          'id': mockjs.mock('@guid'),
          'mainid': pid2,
          'city': mockjs.mock('@city')
        },
        {
          'id': mockjs.mock('@guid'),
          'mainid': pid2,
          'city': mockjs.mock('@city')
        },
        {
          'id': mockjs.mock('@guid'),
          'mainid': pid3,
          'city': mockjs.mock('@city')
        }
      ]
    })['array']
  );
  // mockjs.mock('http://127.0.0.1:3000/onetoonep3', {
  //   'id': id,
  //   'province': mockjs.mock('@province')
  // })
  // mockjs.setup({ timeout: 0 })
})();

