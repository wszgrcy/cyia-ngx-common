import { Entity, PrimaryColumn, OneToOne, EntityColumn } from '../../../decorator/entity';
@Entity({ request: { url: 'http://127.0.0.1:3000/onetoone/onlyItem' } })
/**只有一对一关系的实体 */
export class ItemHasOTOItemEntity {
  @PrimaryColumn()
  id;
  @OneToOne(() => OTORelation)
  onetoone: OTORelation;
}
/**用来实现一对一关系的 */
@Entity({ request: { url: 'http://127.0.0.1:3000/onetoone/relationItem' } })
export class OTORelation {
  @PrimaryColumn()
  id: string;
  data;
}

@Entity({ request: { url: 'http://127.0.0.1:3000/onetoone/listHasOTOItem' } })
/**只有一对一关系的实体 */
export class ListHasOTOItemEntity {
  @PrimaryColumn()
  id;
  @OneToOne(() => OTOListRelation)
  onetoone: OTOListRelation;
}

@Entity({ request: { url: 'http://127.0.0.1:3000/onetoone/relationList' } })
export class OTOListRelation {
  @PrimaryColumn()
  id: string;
  data;
}
