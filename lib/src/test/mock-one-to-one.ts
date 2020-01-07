import * as mockjs from 'mockjs';
(() => {
  const id = mockjs.mock('@guid');
  const pid2 = mockjs.mock('@guid');
  const pid3 = mockjs.mock('@guid');
  const p2id1 = mockjs.mock('@guid');
  const p2id2 = mockjs.mock('@guid');
  const p3id1 = mockjs.mock('@guid');
  const p3id2 = mockjs.mock('@guid');
  mockjs.mock('http://127.0.0.1:3000/mainwithonetoone', {
    id: id,
    p2: p2id1,
    p3: p3id1
  });
  mockjs.mock('http://127.0.0.1:3000/mainwithonetoonemulti', [
    {
      id: id,
      p2: p2id1,
      p3: p3id1
    },
    {
      id: pid2,
      p2: p2id2,
      p3: p3id2
    }
  ]);
  mockjs.mock('http://127.0.0.1:3000/onetoonep2', [
    {
      id: p2id1,
      city: mockjs.mock('@city')
    },
    {
      id: p2id2,
      city: mockjs.mock('@city')
    }
  ]);
  mockjs.mock('http://127.0.0.1:3000/onetoonep3', [
    {
      id: p3id1,
      province: mockjs.mock('@province')
    },
    {
      id: p3id2,
      province: mockjs.mock('@province')
    }
  ]);
  // mockjs.setup({ timeout: 0 })
})();
