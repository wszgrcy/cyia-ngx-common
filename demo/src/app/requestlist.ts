import { RequestItem, HttpClientItemConfig, HttpClientItemConfigBase } from 'cyia-ngx-common';
import { HttpMethod } from 'lib/http/http.define';
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

export class TestItem extends HttpClientItemConfig<Ent> {
    sub = {
        post: new HttpClientItemConfigBase(
            { url: 'index.html', method: 'get', options: { responseType: 'text' } }, Ent
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
class Sub extends HttpClientItemConfigBase<Ent>{
    requestConfig  
     = { url: 'index.html', method: 'get', options: { responseType: 'text' } } as any
  
    
}