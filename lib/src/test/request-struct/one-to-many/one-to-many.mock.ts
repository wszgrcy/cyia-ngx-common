import * as mockjs from 'mockjs';
function mockOneToManyDataItem() {
  return {
    id: mockjs.mock('@guid'),
    onetomany: mockjs.mock('@guid')
  };
}
function mockOneToOneRelation(id: string) {
  return {
    id: id,
    data: mockjs.mock('@province')
  };
}
(() => {
  const dataItem = mockOneToManyDataItem();
  const relation = mockOneToOneRelation(dataItem.onetomany);
  mockjs.mock('http://127.0.0.1:3000/onetoone/onlyItem', dataItem);
  mockjs.mock('http://127.0.0.1:3000/onetoone/relationItem', relation);

  const list = new Array((Math.random() * 10) | 0).fill(0).map(() => {
    return mockOneToManyDataItem();
  });
  mockjs.mock('http://127.0.0.1:3000/onetoone/listHasOTOItem', list);
  const relationList = list.map(({ onetomany }) => mockOneToOneRelation(onetomany));
  mockjs.mock('http://127.0.0.1:3000/onetoone/relationList', relationList);
})();
