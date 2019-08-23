import { PrimaryColumn } from "../../decorator/entity/columns/primary-column.decorator";
import { Entity, OneToMany, OneToOne } from "../../decorator/entity";
import { One21P2Entity, One21P3Entity } from "./base.class";


@Entity({
  request: {
    url: 'http://127.0.0.1:3000/mainwithonetoone',
    method: 'get',
  }
})
export class One2OneOnlyEntity {
  @PrimaryColumn()
  id
  @OneToOne(() => One21P2Entity)
  p2

  @OneToOne(() => One21P3Entity)
  p3
}
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/mainwithonetoonemulti',
    method: 'get',
  }
})
export class One2OneMultiEntity {
  @PrimaryColumn()
  id
  @OneToOne(() => One21P2Entity)
  p2

  @OneToOne(() => One21P3Entity)
  p3
}

@Entity({
  request: {
    url: 'http://127.0.0.1:3000/mainwithonetoone',
    method: 'post',
    options: {
      body: { a: '1', c: 222 },
      headers: {
        test1: 'ceshi'
      }
    }
  }
})
export class One2OneOnlyTestReqEntity {
  @PrimaryColumn()
  id
  @OneToOne(() => One21P2Entity)
  p2
  @OneToOne(() => One21P3Entity)
  p3
}
