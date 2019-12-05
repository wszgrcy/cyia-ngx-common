import * as mockjs from 'mockjs';
(() => {
  const id = mockjs.mock('@guid');
  const pid2 = mockjs.mock('@guid');
  const pid3 = mockjs.mock('@guid');
  mockjs.mock('http://127.0.0.1:3000/mainwithonetoone', {
    id: id,
    p2: pid2,
    p3: pid3
  });
  mockjs.mock('http://127.0.0.1:3000/mainwithonetoonemulti', [
    {
      id: id
    },
    {
      id: pid2
    }
  ]);
  mockjs.mock('http://127.0.0.1:3000/onetoonep2', [
    {
      id: id,
      city: mockjs.mock('@city')
    },
    {
      id: pid2,
      city: mockjs.mock('@city')
    }
  ]);
  mockjs.mock('http://127.0.0.1:3000/onetoonep3', [
    {
      id: id,
      province: mockjs.mock('@province')
    },
    {
      id: pid2,
      province: mockjs.mock('@province')
    }
  ]);
  // mockjs.setup({ timeout: 0 })
})();
