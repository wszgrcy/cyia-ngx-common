import { ClassDataSource, PropertyDataSource } from 'cyia-ngx-common/repository';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
@ClassDataSource({
  source: (http) => {
    return http.get(environment.assetsPrefix + 'author.mock.json');
  },
})
export class AuthorEntity {
  name: string;
  url: string;
}

@ClassDataSource({
  source: (http) => {
    return http.get(environment.assetsPrefix + 'package.mock.json');
  },
})
export class PackageEntity {
  name: string;
  author: string;
  @PropertyDataSource({
    entity: AuthorEntity,
    itemSelect: (thisItem, key, index, result: AuthorEntity[]) => {
      return of(result.find((item) => item.name === thisItem.author));
    },
  })
  authorEntity: string;
}
