import { async, TestBed } from '@angular/core/testing';
import { RepositoryModule } from './repository.module';
import { ClassDataSource } from './decorator/class-data-source';
import { of } from 'rxjs';
import { PropertyDataSource } from './decorator/property-data-source';
import { RepositoryService } from './repository.service';
import { StronglyTyped } from './decorator/extend/strongly-typed';

class Level1Object {
  name: string;
  index: number;
}
@ClassDataSource({
  source: () => {
    return of([{ name: 'level1-1', object: { name: '1', index: 1 } }, { name: 'level1-2' }]);
  },
})
class Level1Item {
  name: string;
  @StronglyTyped(Level1Object)
  object: Level1Object;
}
fdescribe('仓库服务(拓展)', () => {
  let repository: RepositoryService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RepositoryModule],
    });
  }));
  beforeEach(() => {
    repository = TestBed.get(RepositoryService);
  });
  it('仅强类型化', async (done) => {
    repository.findMany(Level1Item).subscribe((item) => {
      console.log('强类型', item);
      expect(item[0].object instanceof Level1Object).toBeTruthy();
      expect(item[0].object.index === 1).toBeTruthy();
      expect(item[0].object.name === '1').toBeTruthy();

      done();
    });
  });
});
