import { async, TestBed } from '@angular/core/testing';
import { CyiaRepositoryModule } from './repository.module';
import { ClassDataSource } from './decorator/class-data-source';
import { of } from 'rxjs';
import { PropertyDataSource } from './decorator/property-data-source';
import { CyiaRepositoryService } from './repository.service';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
@ClassDataSource({
  source: () => {
    return of({ name: 'level3' });
  },
})
class Level3Item {
  name: string;
}
@ClassDataSource({
  source: () => {
    return of({ name: 'level2' });
  },
})
class Level2Item {
  name: string;
  @PropertyDataSource({
    entity: Level3Item,
    itemSelect: (item, key, index, result) => {
      return of(result);
    },
  })
  linkLevel3: Level3Item;
}
@ClassDataSource({
  source: () => {
    return of([{ name: 'level2-1' }, { name: 'level2-2' }]);
  },
})
class Level2List {
  name: string;
  @PropertyDataSource({
    source: () => {
      return of(['level3-1', 'level3-2']);
    },
    itemSelect: (item, key, index, result) => {
      return of(result[index]);
    },
  })
  level3name: string;
}
@ClassDataSource({
  source: () => {
    return of({ name: 'level1' });
  },
})
class Level1Item {
  name: string;
  @PropertyDataSource({
    entity: Level2Item,
    itemSelect: (item, key, index, result) => {
      return of(result);
    },
    cascade: false,
  })
  linkLevel2: Level2Item;
}
@ClassDataSource({
  source: () => {
    return of({ name: 'level1' });
  },
})
class Level1EascadeItem {
  name: string;
  @PropertyDataSource({
    entity: Level2Item,
    itemSelect: (item, key, index, result) => {
      return of(result);
    },
    cascade: true,
  })
  linkLevel2: Level2Item;
}
@ClassDataSource({
  source: () => {
    return of([{ name: 'level1-1' }, { name: 'level1-2' }]);
  },
})
class Level1List {
  name: string;
  @PropertyDataSource({
    entity: Level2List,
    itemSelect: (item, key, j, result: Level2List) => {
      return of(result[j]);
    },
    cascade: true,
  })
  linkLevel2List: Level2List;
}
@ClassDataSource({
  source: (http, injector, ...args) => {
    return of(args[0]);
  },
})
class Level1UseSourceParams {
  name: string;
  @PropertyDataSource({
    source: (http, inject, result) => {
      return of(http);
    },
  })
  httpClient: HttpClient;
  @PropertyDataSource({
    source: (http, injector, result) => {
      return of(injector);
    },
  })
  injector: Injector;
  @PropertyDataSource({
    source: (http, injector, result) => {
      return of(result);
    },
  })
  result;
}
@ClassDataSource({
  source: (a, b, result) => {
    return of(result);
  },
})
class ItemSelectParams {
  @PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key) => {
      return of(key);
    },
  })
  key: string;

  @PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key, index) => {
      return of(index);
    },
  })
  index: number;
  @PropertyDataSource({
    source: () => of(['result1', 'result2']),
    itemSelect: (item, key, index, result) => {
      return of(result[index]);
    },
  })
  result;
  @PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key, index, result, http) => {
      return of(http);
    },
  })
  http: HttpClient;
  @PropertyDataSource({
    source: () => of(undefined),
    itemSelect: (item, key, index, result, http, injector) => {
      return of(injector);
    },
  })
  injector: Injector;
}
fdescribe('仓库服务(基础)', () => {
  let repository: CyiaRepositoryService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CyiaRepositoryModule],
    });
  }));
  beforeEach(() => {
    repository = TestBed.get(CyiaRepositoryService);
  });
  it('服务初始化', () => {
    expect(repository).toBeTruthy();
    expect(repository.findMany).toBeTruthy();
  });
  it('返回为item&结构化基础', async (done) => {
    repository.findOne(Level1Item).subscribe((item) => {
      expect(item instanceof Level1Item);
      expect(item.name).toBe('level1');
      expect(item.linkLevel2 instanceof Level2Item).toBeTruthy();
      expect(item.linkLevel2.linkLevel3).toBeFalsy();
      done();
    });
  });
  it('返回为list&&结构化基础', async (done) => {
    repository.findMany(Level1List).subscribe((res) => {
      expect(res instanceof Array).toBe(true);
      expect(res.length).toBeTruthy();
      res.forEach((item, i) => {
        expect(res[i] instanceof Level1List).toBeTruthy();
        expect(res[i].name).toBe(`level1-${i + 1}`);
        expect(res[i].linkLevel2List instanceof Level2List).toBeTruthy();
        expect(res[i].linkLevel2List.name).toBe(`level2-${i + 1}`);
      });
      done();
    });
  });

  it('item级联', async (done) => {
    repository.findOne(Level1EascadeItem).subscribe((item) => {
      expect(item instanceof Level1EascadeItem);
      expect(item.name).toBe('level1');
      expect(item.linkLevel2 instanceof Level2Item).toBeTruthy();
      expect(item.linkLevel2.linkLevel3).toBeTruthy();
      expect(item.linkLevel2.linkLevel3 instanceof Level3Item).toBeTruthy();
      expect(item.linkLevel2.linkLevel3.name === 'level3').toBeTruthy();
      done();
    });
  });
  it('list级联', async (done) => {
    repository.findMany(Level1List).subscribe((list) => {
      list.forEach((item, i) => {
        expect(item.name).toBe(`level1-${i + 1}`);
        expect(item instanceof Level1List).toBeTruthy();
        expect(item.linkLevel2List).toBeTruthy();
        expect(item.linkLevel2List instanceof Level2List).toBeTruthy();
        expect(item.linkLevel2List.level3name).toBe(`level3-${i + 1}`);
      });
      done();
    });
  });
  it('请求参数&属性数据源(item)source参数', async (done) => {
    const str = { name: 'params' };
    repository.findOne(Level1UseSourceParams, str).subscribe((res) => {
      expect(res.name).toBe(str.name);
      const http = TestBed.get(HttpClient);
      expect(res.httpClient === http).toBeTruthy();
      const injector = TestBed.get(Injector);
      expect(res.injector === injector).toBeTruthy();
      expect(res.result === res).toBeTruthy();
      done();
    });
  });
  it('请求参数&属性数据源(list)source参数', async (done) => {
    const str = [{ name: 'name1' }, { name: 'name2' }];
    repository.findMany(Level1UseSourceParams, str).subscribe((res) => {
      res.forEach((item, i) => {
        expect(item.name).toBe(str[i].name, 'name');
        const http = TestBed.get(HttpClient);
        expect(item.httpClient === http).toBeTruthy('http');
        const injector = TestBed.get(Injector);
        expect(item.injector === injector).toBeTruthy('injector');
        // console.log('result', item, item.result);
        expect(item.result === res).toBeTruthy('result');
        done();
      });
    });
  });
  it('属性数据源(item)itemSelect参数', async (done) => {
    repository.findOne(ItemSelectParams, {}).subscribe((item) => {
      expect(item.http === TestBed.get(HttpClient)).toBeTruthy('http');
      expect(item.injector === TestBed.get(Injector)).toBeTruthy('injector');
      expect(item.key === 'key').toBeTruthy('key');
      expect(item.result === `result1`).toBeTruthy('result');

      done();
    });
  });
  it('属性数据源(list)itemSelect参数', async (done) => {
    repository.findMany(ItemSelectParams, [{}, {}]).subscribe((list) => {
      console.log('列表', list);
      list.forEach((item, i) => {
        expect(item.http === TestBed.get(HttpClient)).toBeTruthy('http');
        expect(item.injector === TestBed.get(Injector)).toBeTruthy('injector');
        expect(item.key === 'key').toBeTruthy('key');
        expect(item.result === `result${i + 1}`).toBeTruthy('result');
        expect(item.index === i).toBeTruthy('index');
      });
      done();
    });
  });
});
