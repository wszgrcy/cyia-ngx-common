import { Entity, PrimaryColumn, OneToOne, EntityColumn } from '../../decorator/entity';
import { Source } from '../../type';
@Entity({
  method: Source.structure
})
/**双层结构化实体第二层 */
export class DoubleLevelStruct2Entity {
  p3;
}
@Entity({
  method: Source.structure
})
/**双层结构化实体第一层 */
export class DoubleLevelStruct1Entity {
  p2;
  @EntityColumn(() => DoubleLevelStruct2Entity)
  data: DoubleLevelStruct2Entity;
}
@Entity({
  method: Source.structure
})
/**结构化单项实体 */
export class StructItemEntity {
  data;
}
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/structlist2'
  }
})
/**单层结构化列表实体 */
export class StructListEntity {
  @PrimaryColumn()
  id;
  @EntityColumn(() => StructItemEntity)
  data: StructItemEntity[];
}
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/struct1'
  }
})
/**双层结构化单项实体 */
export class DoubleLevelStructEntity {
  @PrimaryColumn()
  id;
  @EntityColumn(() => DoubleLevelStruct1Entity)
  data: DoubleLevelStruct1Entity;
  code;
}

@Entity({
  request: {
    url: 'http://127.0.0.1:3000/structlist1'
  }
})
export class StructList1Entity {
  @PrimaryColumn()
  id;
  @EntityColumn(() => StructItemEntity)
  data: StructItemEntity[];
}

/**
 * 结构化返回的情况下,进行不同层级下的关联
 * 子实体中关联的关系需要正确返回
 * @export
 * @class RelationStructEntity
 */
@Entity({ request: { url: 'http://127.0.0.1:3000/struct1' } })
export class RelationStructEntity {
  @PrimaryColumn()
  id;
  @EntityColumn(() => RColumnP2Entity)
  data: RColumnP2Entity;
  code;
  @OneToOne(() => OntoOne1Entity)
  onetoone: OntoOne1Entity;
}
@Entity({
  method: Source.structure
})
export class RColumnP2Entity {
  @PrimaryColumn()
  p2;
  @EntityColumn(() => RColumnP3Entity)
  data;
  @OneToOne(() => OntoOne2Entity)
  onetoone;
}
@Entity({
  method: Source.structure
})
export class RColumnP3Entity {
  p3;
}

@Entity({
  request: { url: 'http://127.0.0.1:3000/sonetoone1' }
})
export class OntoOne1Entity {
  @PrimaryColumn()
  id;
  data;
}
@Entity({
  request: { url: 'http://127.0.0.1:3000/sonetoone2' }
})
export class OntoOne2Entity {
  @PrimaryColumn()
  id;
  data;
}

/**
 * 关联结构化一对一
 *
 * @export
 * @class Structure121WithStructureEntity
 */
@Entity({ request: { url: 'http://127.0.0.1:3000/struct1' } })
export class Relate121WithStructureEntity {
  @PrimaryColumn()
  id;
  data;
  code;
  @OneToOne(() => Struct2Entity)
  struct2: Struct2Entity;
}
@Entity({ request: { url: 'http://127.0.0.1:3000/struct2' } })
export class Struct2Entity {
  @PrimaryColumn()
  id;
  @EntityColumn(() => Struct2DataEntity)
  data: Struct2DataEntity;
  code;
}
@Entity({ method: Source.structure })
export class Struct2DataEntity {
  p1;
  email;
}
