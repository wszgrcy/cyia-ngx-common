import { CyiaHttpService } from '../../http/http.service';
import { EntityOptions, RelationEntityOptions, Source } from '../../type/options/entity.options';
import { ENTITY_SYMBOL, REPOSITORY_SYMBOL } from '../../symbol/entity.symbol';
import { Type } from '@angular/core';
import { HttpRequestConfig } from '../../http/http.define';
import { mergeOptions } from '../../util/merge-options';

/**
 * todo childentity
 *
 * @export
 */
export function Entity(options: EntityOptions, relationOptions?: RelationEntityOptions) {
  return function<T extends new (...args: any[]) => {}>(constructor: T) {
    if (typeof options.request !== 'function') {
      options.request = Object.assign(new HttpRequestConfig(), options.request);
    }
    Reflect.defineMetadata(
      ENTITY_SYMBOL,
      {
        entity: constructor,
        options: mergeOptions(new EntityOptions(), options),
        relationOptions: mergeOptions(new RelationEntityOptions(), relationOptions)
      },
      constructor
    );
  };
}
