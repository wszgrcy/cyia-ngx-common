import * as mockjs from 'mockjs';
function mockManyToOneDataItem() {
  return {
    id: mockjs.mock('@guid'),
    manytoone: mockjs.mock('@guid')
  };
}
function mockManyToOneRelation(id: string) {
  return {
    id: id,
    data: mockjs.mock('@province')
  };
}
(() => {
  const dataItem = mockManyToOneDataItem();
  const relation = mockManyToOneRelation(dataItem.manytoone);
  mockjs.mock('http://127.0.0.1:3000/manytoone/onlyItem', dataItem);
  mockjs.mock('http://127.0.0.1:3000/manytoone/relationItem', relation);
  const list = new Array((Math.random() * 10) | 0).fill(0).map(() => {
    return mockManyToOneDataItem();
  });
  mockjs.mock('http://127.0.0.1:3000/manytoone/listHasMTOItem', list);
  const relationList = list.map(({ manytoone }) => mockManyToOneRelation(manytoone));
  mockjs.mock('http://127.0.0.1:3000/manytoone/relationList', relationList);
})();
