import { transform2Array } from "./transform2array";

describe('转换为数组', () => {
  function testIt(msg, data) {
    it(msg, () => {
      let list = transform2Array(data)
      expect(list instanceof Array).toBe(true)
    })
  }
  testIt('null', null)
  testIt('undefined', undefined)

  testIt('数字', 541615)
  testIt('字符串', 'sdfsfadgsf')
  testIt('数组', ['sdfsf', 'sdfdsf', 343554])
  testIt('对象', { a: 3 })
  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [
  //       RouterTestingModule
  //     ],
  //     declarations: [
  //       AppComponent
  //     ],
  //   }).compileComponents();
  // }));




});
