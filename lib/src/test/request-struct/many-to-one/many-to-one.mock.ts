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
  const relation = mockOneToOneRelation(dataItem.id);
  mockjs.mock('http://127.0.0.1:3000/onetoone/onlyItem', dataItem);
  mockjs.mock('http://127.0.0.1:3000/onetoone/relationItem', relation);
})();
