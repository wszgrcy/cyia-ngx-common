import * as mockjs from 'mockjs';
function mockOneToOneDataItem() {
  return {
    id: mockjs.mock('@guid'),
    onetoone: mockjs.mock('@guid')
  };
}
function mockOneToOneRelation(id: string) {
  return {
    id: id,
    data: mockjs.mock('@province')
  };
}
(() => {
  const dataItem = mockOneToOneDataItem();
  const relation = mockOneToOneRelation(dataItem.onetoone);
  mockjs.mock('http://127.0.0.1:3000/onetoone/onlyItem', dataItem);
  mockjs.mock('http://127.0.0.1:3000/onetoone/relationItem', relation);

  const list = new Array((Math.random() * 10) | 0).fill(0).map(() => {
    return mockOneToOneDataItem();
  });
  mockjs.mock('http://127.0.0.1:3000/onetoone/listHasOTOItem', list);
  const relationList = list.map(({ onetoone }) => mockOneToOneRelation(onetoone));
  mockjs.mock('http://127.0.0.1:3000/onetoone/relationList', relationList);
})();
