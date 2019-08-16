import { PrimaryColumn } from "../../decorator/entity/columns/primary-column.decorator";
import { Entity, OneToMany } from "../../decorator/entity";
import { OneToManyP2 } from "./base.class";


@Entity({ request: { url: 'http://127.0.0.1:3000/mainwithonetomany' } })
export class OneToManyOnly {
  @PrimaryColumn()
  id
  @OneToMany(() => OneToManyP2, (type) => type.mainid)
  p2: OneToManyP2[]
}
@Entity({ request: { url: 'http://127.0.0.1:3000/mainwithonetomanymulti' } })
export class OneToManyMultiEntity {
  @PrimaryColumn()
  id
  @OneToMany(() => OneToManyP2, (type) => type.mainid)
  p2: OneToManyP2[]
}

