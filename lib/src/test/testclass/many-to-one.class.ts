import { PrimaryColumn } from "../../decorator/entity/columns/primary-column.decorator";
import { Entity, OneToMany, ManyToOne } from "../../decorator/entity";
import { OneToManyP2, Many2OneP2Entity } from "./base.class";

@Entity({
  request: {
    url: 'http://127.0.0.1:3000/mainwithmanytoone',
    method: 'get',
  }
})
export class Many2OneOnlyEntity {
  @PrimaryColumn()
  id
  @ManyToOne(() => Many2OneP2Entity, (type) => type.id)
  p2: Many2OneP2Entity

}
