import { RequestItem, HttpClientItemConfig, HttpClientItemConfigBase, Entity, OneToOne, PrimaryColumn, Source, ManyToOne, EntityColumn } from 'cyia-ngx-common';
import { OneToMany } from 'cyia-ngx-common'
export const requestList: RequestItem[] = [
  {
    prefixurl: 'https://www.npmjs.com',
    apiList: [
      {
        token: 'test',
        method: 'get',
        url: 'package/cyia-ngx-log/'
      }
    ]

  }
]

export class TestItem extends HttpClientItemConfig<Ent, SubHelper> {
  sub = {
    post: new HttpClientItemConfigBase(
      { url: 'post', method: 'get', options: { responseType: 'text' } }, Post
    )
  }
  defalut = new HttpClientItemConfigBase(
    { url: 'index.html', method: 'get', options: { responseType: 'text' } }, Ent
  )
}
class Ent {
  a
  b
  c
}
class Post {
  t
  a
  c
}
class SubHelper {
  post
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
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/b',
    method: 'get'
  }
}, {
    request: async () => {
      return {
        options: {
          params: { a: `1` }
        }
      }
    }
  }
)
export class O2O1Entity extends MainEntity {
  // @OneToOne(() => MainEntity)
  @PrimaryColumn()
  ret1
  ret2
}
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
    url: 'http://127.0.0.1:3000/multi',
    method: 'get',

  },
})
export class MultiEntity {
  @EntityColumn(() => T1Entity)
  t1
  @EntityColumn(() => T2Entity)
  t2

}
@Entity({ method: Source.normal })
export class T1Entity {
  t1p1
  t1p2
  @EntityColumn(() => T2Entity)
  t2
}
@Entity({ method: Source.normal })
export class T2Entity {
  t2p1
  t2p2
}
