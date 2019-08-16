import * as mockjs from "mockjs";
(() => {
  const id = mockjs.mock('@guid')
  const pid2 = mockjs.mock('@guid')
  const pid3 = mockjs.mock('@guid')
  mockjs.mock('http://127.0.0.1:3000/struct1', {
    'id': id,
    // 'p2': pid2,
    'data': {
      'p2': pid2,
      'data': {
        'p3': pid3,
      }
    },
    'code': '第一层用来显示状态'
  })
  mockjs.mock('http://127.0.0.1:3000/sonetoone1', {
    'id': id,
    'data': '结构层级第一层下一对一'
  })
  mockjs.mock('http://127.0.0.1:3000/sonetoone2', {
    'id': pid2,
    'data': '结构层级第二层下一对一'
  })
})()

