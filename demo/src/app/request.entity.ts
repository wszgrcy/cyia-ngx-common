import { ClassDataSource, PropertyDataSource } from 'cyia-ngx-common';
import { of } from 'rxjs';
@ClassDataSource({
  source: () => {
    console.log('应该返回');
    return of([{ sub1: 1234 }]);
  },
})
export class Level1 {
  sub1;
  @PropertyDataSource({
    source: (http) => {
      console.log('简易第二层', http);

      return of([1, 2, 34]);
    },
    itemSelect: (item, key, result) => {
      console.log('item选择', result);
      return of(result[0]);
    },
  })
  sub2: number;
}

@ClassDataSource({
  source: () => {
    return of({ item: '123' });
  },
})
export class RequestOne {
  item;

  @PropertyDataSource({
    entity: Level1,
    itemSelect: (item, key, result) => {
      console.log('needrequest字段', item, key, result);
      return of(result);
    },
    cascade: true,
  })
  needrequest: Level1[];
}
