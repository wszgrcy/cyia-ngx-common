import { PrimaryColumn } from "../../decorator/entity/columns/primary-column.decorator";
import { Entity, OneToMany } from "../../decorator/entity";
@Entity({ request: { url: 'http://127.0.0.1:3000/onetomanyp2' } })
export class OneToManyP2 {
  @PrimaryColumn()
  id
  mainid
  city
}

@Entity({
  request: {
    url: 'http://127.0.0.1:3000/many2onep2',
    method: 'get',
  }
})
export class Many2OneP2Entity {
  @PrimaryColumn()
  id

  city

}

@Entity({
  request: {
    // url: 'http://127.0.0.1:3000/onetoonep2',
    method: 'get',
  }
}, {
    request: async (result) => {
      console.log(result);
      console.log('通过被动请求返回的url,不是预设');
      return {
        url: 'http://127.0.0.1:3000/onetoonep2'
      }
    }
  })
export class One21P2Entity {
  @PrimaryColumn()
  id
  city
}
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/onetoonep3',
    method: 'get',
  }
})
export class One21P3Entity {
  @PrimaryColumn()
  id
  province
}
