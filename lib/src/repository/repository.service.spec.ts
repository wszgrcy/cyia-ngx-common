import { async, TestBed } from '@angular/core/testing';
import { RepositoryModule } from './repository.module';
import { ClassDataSource } from './decorator/class-data-source';
import { of } from 'rxjs';
import { PropertyDataSource } from './decorator/property-data-source';
import { RepositoryService } from './repository.service';
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
      console.log(item, key, result);
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
fdescribe('仓库服务(基础)', () => {
  let repository: RepositoryService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RepositoryModule],
    });
  }));
  beforeEach(() => {
    repository = TestBed.get(RepositoryService);
  });
  it('服务初始化', () => {
    expect(repository).toBeTruthy();
    expect(repository.findMany).toBeTruthy();
  });
  it('结构化基础', async (done) => {
    repository.findOne(Level1Item).subscribe((item) => {
      console.log(item);
      expect(item instanceof Level1Item);
      expect(item.name).toBe('level1');
      expect(item.linkLevel2 instanceof Level2Item).toBeTruthy();
      expect(item.linkLevel2.linkLevel3).toBeFalsy();
      done();
    });
  });
  it('级联', async (done) => {
    repository.findOne(Level1EascadeItem).subscribe((item) => {
      console.log(item);
      expect(item instanceof Level1EascadeItem);
      expect(item.name).toBe('level1');
      expect(item.linkLevel2 instanceof Level2Item).toBeTruthy();
      expect(item.linkLevel2.linkLevel3).toBeTruthy();
      expect(item.linkLevel2.linkLevel3 instanceof Level3Item).toBeTruthy();
      done();
    });
  });
  it('返回为列表', async (done) => {
    repository.findMany(Level1List).subscribe((res) => {
      expect(res instanceof Array).toBe(true);
      expect(res.length).toBeTruthy();
      expect(res[0] instanceof Level1List).toBe(true);
      expect(res[0].name).toBe('level1-1');
      done();
    });
  });
  it('列表结构化', async (done) => {
    repository.findMany(Level1List).subscribe((res) => {
      expect(res[0].linkLevel2List.name).toBe('level2-1');
      expect(res[1].linkLevel2List.name).toBe('level2-2');
      done();
    });
  });
  it('列表级联', async (done) => {
    repository.findMany(Level1List).subscribe((list) => {
      expect(list[0].linkLevel2List.level3name).toBe('level3-1');
      done();
    });
  });
  it('请求参数&传入参数', async (done) => {
    const str = { name: 'params' };
    repository.findOne(Level1UseSourceParams, str).subscribe((res) => {
      expect(res.name).toBe(str.name);
      const http = TestBed.get(HttpClient);
      expect(res.httpClient === http).toBeTruthy();
      const injector = TestBed.get(Injector);
      expect(res.injector === injector).toBeTruthy();
      console.log('结果', res.result);
      expect(res.result === res).toBeTruthy();
      done();
    });
  });
});
