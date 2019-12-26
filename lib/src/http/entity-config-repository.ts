import { RegisterEntityOption } from '../type/options/register-entity.options';
import { Type } from '@angular/core';
import { ENTITY_SYMBOL, RELATION_SYMBOL, PRIMARY_COLUMN_SYMBOL, ENTITY_COLUMN_SYMBOL } from '../symbol/entity.symbol';
import { EntityConfig } from '../type/entity.config';

export class EntityConfigRepository {
  // static list = new Map<Type<any>, RegisterEntityOption>();

  // static register(entity: Type<any>, options: RegisterEntityOption) {
  //   EntityConfigRepository.list.set(entity, options);
  // }

  static get(entity: Type<any>): EntityConfig {
    return {
      entity: Reflect.getMetadata(ENTITY_SYMBOL, entity),
      relations: Reflect.getMetadata(RELATION_SYMBOL, entity) || [],
      primaryKey: Reflect.getMetadata(PRIMARY_COLUMN_SYMBOL, entity),
      entityColumns: Reflect.getMetadata(ENTITY_COLUMN_SYMBOL, entity) || []
    };
  }
}
