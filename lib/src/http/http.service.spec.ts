import { TestBed } from '@angular/core/testing';
import { CyiaHttpService } from './http.service';
import { CyiaHttpModule } from './http.module';
import { Entity } from '../decorator/entity/entity.decorator';
import { Source } from '../type/options/entity.options';
import { PrimaryColumn } from '../decorator/entity/columns/primary-column.decorator';
import { ManyToOne } from '../decorator/entity/property/many-to-one.decorator';
import { OneToMany } from '../decorator/entity/property/one-to-many.decorator';
import { OneToOne } from '../decorator/entity/property/one-to-one.decorator';
// import { Entity, PrimaryColumn, OneToOne, OneToMany, Source, ManyToOne } from '../public_api';
// import { NormalEntity, OneToManyEntity } from 'demo/src/app/requestlist';


@Entity({ method: Source.normal })
export class NormalEntity {
  @PrimaryColumn()
  id
  test
  constructor(id, test) {
    this.id = id;
    this.test = test
  }
}
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/onetomany',
    method: 'get',

  },
})
export class OneToManyEntity {
  @ManyToOne(() => MainEntity, (type) => type.ret1)
  p
  data
  @PrimaryColumn()
  id
}
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/a',
    method: 'get',
    options: {
      params: { default1: '默认' }
    }
  }
})
export class MainEntity {
  @PrimaryColumn()
  ret1
  ret2

  @OneToOne(() => NormalEntity)
  ext
  @OneToMany(() => OneToManyEntity, (type) => type.p)
  many: OneToManyEntity[]
}
describe('服务测试', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [CyiaHttpModule.forRoot([])]
  }));

  it('创建', () => {
    const service: CyiaHttpService = TestBed.get(CyiaHttpService);
    expect(service).toBeTruthy();
  });
  it('请求', () => {
    const service: CyiaHttpService = TestBed.get(CyiaHttpService);
    service.getEntity(MainEntity)({}).subscribe((val) => {
      console.log(val);

    })
  })
});
