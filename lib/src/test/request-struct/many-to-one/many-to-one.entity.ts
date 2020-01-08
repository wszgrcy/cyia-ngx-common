import { Entity, PrimaryColumn, OneToOne, EntityColumn, ManyToOne } from '../../../decorator/entity';
import { Type } from '@angular/core';
@Entity({ request: { url: 'http://127.0.0.1:3000/manytoone/onlyItem' } })
/**只有一对一关系的实体 */
export class ItemHasMTOItemEntity {
  @PrimaryColumn()
  id;
  @ManyToOne(
    () => MTORelation,
    (type) => type.id
  )
  manytoone: MTORelation;
}
/**用来实现一对一关系的 */
@Entity({ request: { url: 'http://127.0.0.1:3000/manytoone/relationItem' } })
export class MTORelation {
  @PrimaryColumn()
  id: string;
  data;
}

@Entity({ request: { url: 'http://127.0.0.1:3000/manytoone/listHasMTOItem' } })
/**只有一对一关系的实体 */
export class ListHasMTOItemEntity {
  @PrimaryColumn()
  id;
  @ManyToOne(
    () => MTOListRelation,
    (type) => type.id
  )
  manytoone: MTOListRelation;
}

@Entity({ request: { url: 'http://127.0.0.1:3000/manytoone/relationList' } })
export class MTOListRelation {
  @PrimaryColumn()
  id: string;
  data;
}
