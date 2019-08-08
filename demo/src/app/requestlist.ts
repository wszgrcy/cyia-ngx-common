import { RequestItem, HttpClientItemConfig, HttpClientItemConfigBase, Entity, OneToOne } from 'cyia-ngx-common';
import { config } from 'rxjs';
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
    method: 'get'
  }
})
export class NewEntity {
  @OneToOne(() => ExtEntity, (type) => type.ret1)
  ret1
  ret2
}
@Entity({
  request: {
    url: 'http://127.0.0.1:3000/b',
    method: 'get'
  }
})
export class ExtEntity extends NewEntity {
  @OneToOne(() => NewEntity, (type) => type.ret1)
  ret1
  ret2
}
