
describe('强类型化', () => {
  class A {

  }
  function testIt(msg, entity, data) {
    it(msg, () => {
      const instance = new entity();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          instance[key] = data[key];
        }
      }
      console.log(instance);
      expect(instance instanceof entity).toBe(true);
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          expect(data[key] === instance[key]).toBe(true);
        }
      }
      for (const key in instance) {
        if (data.hasOwnProperty(key)) {
          expect(data[key] === instance[key]).toBe(true);
        }
      }
    });
  }
  // console.log('开始');
  testIt('无数据', A, {});
  testIt('没声明属性,但是也会赋值上去', A, { a: 1 });
  const data1 = { a: 1 };
  const b = Object.create(data1);
  b.b = 999;
  // console.log(b);
  testIt('继承', A, b);
  // console.log('结束');
});
