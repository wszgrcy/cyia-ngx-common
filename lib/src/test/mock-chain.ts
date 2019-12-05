import * as mockjs from 'mockjs';
(() => {
  const id = mockjs.mock('@guid');
  const pid2 = mockjs.mock('@guid');
  const pid3 = mockjs.mock('@guid');
  mockjs.mock('http://127.0.0.1:3000/chain1210', {
    id: id,
    // 'p2': pid2,
    param: '这是第一层'
  });
  mockjs.mock('http://127.0.0.1:3000/chain1211', {
    id: id,
    param: '这是第二层'
  });
  mockjs.mock('http://127.0.0.1:3000/chain1212', {
    id: id,
    city: mockjs.mock('@city')
  });

  // mockjs.setup({ timeout: 0 })
})();
