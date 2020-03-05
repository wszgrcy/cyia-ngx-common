import { Entity, PrimaryColumn, OneToOne, EntityColumn, ManyToOne, OneToMany } from '../../../decorator/entity';
@Entity({ request: { url: 'http://127.0.0.1:3000/onetomany/onlyItem' } })
/**只有一对多关系的实体 */
export class ItemHasOTMItemEntity {
  @PrimaryColumn()
  id;
  @OneToMany(
    () => OTMRelation,
    (type) => type.itemId
  )
  onetomany: OTMRelation[];
}
/**用来实现一对一关系的 */
@Entity({ request: { url: 'http://127.0.0.1:3000/onetomany/relationItem' } })
export class OTMRelation {
  @PrimaryColumn()
  id: string;
  data;
  itemId: string;
}

@Entity({ request: { url: 'http://127.0.0.1:3000/onetomany/listHasOTMItem' } })
/**只有一对一关系的实体 */
export class ListHasOTMItemEntity {
  @PrimaryColumn()
  id;
  @OneToOne(() => OTMListRelation)
  onetoone: OTMListRelation;
}

@Entity({ request: { url: 'http://127.0.0.1:3000/onetoone/relationList' } })
export class OTMListRelation {
  @PrimaryColumn()
  id: string;
  data;
}
