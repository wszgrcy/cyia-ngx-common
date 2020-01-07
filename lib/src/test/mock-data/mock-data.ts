import * as mockjs from 'mockjs';
function mockOneToOneDataItem() {
  return {
    id: mockjs.mock('@guid'),
    onetoone: mockjs.mock('@guid')
  };
}
function mockOneToOneRelation(id: string, name: string) {}
