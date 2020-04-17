import { async, TestBed } from '@angular/core/testing';
import { CyiaRepositoryModule } from './repository.module';
import { ClassDataSource } from './decorator/class-data-source';
import { of } from 'rxjs';
import { PropertyDataSource } from './decorator/property-data-source';
import { CyiaRepositoryService } from './repository.service';
import { StronglyTyped } from './decorator/extend/strongly-typed';
import { PropertyDefaultValue } from './decorator/extend/property-default-value';
import { PropertyDataSourceStandalone } from './decorator';
import { PropertyFormatValue } from './decorator/extend/property-format-value';
import { Level1 } from 'demo/src/app/request.entity';
import { PropertyInherit } from './decorator/extend/inherit';

class Level1Object {
  name: string;
  index: number;
}
@ClassDataSource({
  source: () => {
    return of([
      {
        name: 'level1-1',
        object: { name: '1', index: 1 },
        useDefaultValueOnlyNull: null,
        standalone: 'same',
        format: Date.now(),
      },
      {
        name: 'level1-2',
        useDefaultValue: 1,
        useDefaultValueOnlyNull: undefined,
        standalone: 'same',
        format: Date.now(),
      },
    ]);
  },
})
class Level1Item {
  name: string;
  @StronglyTyped(Level1Object)
  object: Level1Object;
  @PropertyDefaultValue(666)
  useDefaultValue: number;
  @PropertyDefaultValue(666, { isNull: true, isUndefined: false })
  useDefaultValueOnlyNull: Number;

  @PropertyDataSourceStandalone({
    source: (item, key) => {
      return of(`${item[key]}${Math.random()}`);
    },
  })
  standalone;
  @PropertyFormatValue((item) => new Date(item))
  format: Date;
  @PropertyFormatValue((item) => {
    return `${item}second`;
  })
  @PropertyFormatValue((item) => {
    return `${item}first`;
  })
  @PropertyDefaultValue('default')
  multiDecoarator: string;
  @PropertyFormatValue((item) => `${item}format`)
  @PropertyDataSource({
    source: () => {
      return of('2');
    },
  })
  @PropertyDataSource({
    source: () => {
      return of('1');
    },
  })
  multiDecoratorWithSource: string;
}
class Parent {
  @PropertyDataSource({
    source: () => of(undefined),
    itemSelect: () => {
      return of('parent');
    },
  })
  name: string;
}
@ClassDataSource({ source: () => of({}) })
class Child extends Parent {
  @PropertyFormatValue((item) => 'child' + item)
  @PropertyInherit()
  name: string;
}
fdescribe('仓库服务(拓展)', () => {
  let repository: CyiaRepositoryService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CyiaRepositoryModule],
    });
  }));
  beforeEach(() => {
    repository = TestBed.get(CyiaRepositoryService);
  });
  it('子对象强类型化', async (done) => {
    repository.findMany(Level1Item).subscribe((item) => {
      expect(item[0].object instanceof Level1Object).toBeTruthy();
      expect(item[0].object.index === 1).toBeTruthy();
      expect(item[0].object.name === '1').toBeTruthy();

      done();
    });
  });
  it('默认值', async (done) => {
    repository.findMany(Level1Item).subscribe((item) => {
      expect(item[0].useDefaultValue).toEqual(666);
      expect(item[1].useDefaultValue).not.toEqual(666);
      expect(item[0].useDefaultValueOnlyNull).toEqual(666);
      expect(item[1].useDefaultValueOnlyNull).not.toEqual(666);
      done();
    });
  });
  it('属性独立请求', async (done) => {
    repository.findMany(Level1Item).subscribe((list) => {
      expect(list[0].standalone !== list[1].standalone).toBeTruthy();

      done();
    });
  });
  it('属性格式化', async (done) => {
    repository.findMany(Level1Item).subscribe((list) => {
      list.forEach((item) => {
        expect(item.format instanceof Date).toBeTruthy();
      });
      done();
    });
  });
  it('多装饰器顺序', async (done) => {
    repository.findMany(Level1Item).subscribe((list) => {
      expect(list[0].multiDecoarator).toEqual(`defaultfirstsecond`);
      done();
    });
  });
  it('多装饰器单一源', async (done) => {
    repository.findMany(Level1Item).subscribe((list) => {
      expect(list[0].multiDecoratorWithSource).toEqual('1format');
      done();
    });
  });
  it('类继承', async (done) => {
    repository.findOne(Child).subscribe((item) => {
      expect(item.name).toEqual('childparent');
    });
    done();
  });
});
