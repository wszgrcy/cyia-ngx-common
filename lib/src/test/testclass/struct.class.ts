import { Entity, PrimaryColumn, OneToOne, EntityColumn } from "../../decorator/entity";
import { Source } from "../../type";

@Entity({
  request: {
    url: 'http://127.0.0.1:3000/struct1'
  }
})
export class NoRelationStructEntity {
  @PrimaryColumn()
  id
  @EntityColumn(() => ColumnP2Entity)
  data: ColumnP2Entity
  code
}
@Entity({
  method: Source.normal
})
export class ColumnP2Entity {
  p2
  @EntityColumn(() => ColumnP3Entity)
  data
}
@Entity({
  method: Source.normal
})
export class ColumnP3Entity {
  p3
}
/**机构式返回的情况下,进行不同层级下的关联 */
@Entity({ request: { url: 'http://127.0.0.1:3000/struct1' } })
export class RelationStructEntity {
  @PrimaryColumn()
  id
  @EntityColumn(() => RColumnP2Entity)
  data: RColumnP2Entity
  code
  @OneToOne(() => OntoOne1Entity)
  onetoone: OntoOne1Entity
}
@Entity({
  method: Source.normal
})
export class RColumnP2Entity {
  @PrimaryColumn()
  p2
  @EntityColumn(() => RColumnP3Entity)
  data
  @OneToOne(() => OntoOne2Entity)
  onetoone
}
@Entity({
  method: Source.normal
})
export class RColumnP3Entity {
  p3
}

@Entity({
  request: { url: 'http://127.0.0.1:3000/sonetoone1' }
})
export class OntoOne1Entity {
  @PrimaryColumn()
  id
  data
}
@Entity({
  request: { url: 'http://127.0.0.1:3000/sonetoone2' }
})
export class OntoOne2Entity {
  @PrimaryColumn()
  id
  data
}

@Entity({ request: { url: 'http://127.0.0.1:3000/struct1' } })
export class SWithSEntity {
  @PrimaryColumn()
  id
  data
  code
  @OneToOne(() => Struct2Entity)
  struct2: Struct2Entity
}
@Entity({ request: { url: 'http://127.0.0.1:3000/struct2' } })
export class Struct2Entity {
  @PrimaryColumn()
  id
  @EntityColumn(() => Struct2DataEntity)
  data: Struct2DataEntity
  code
}
@Entity({ method: Source.normal })
export class Struct2DataEntity {
  p1
  email
}
