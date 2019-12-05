import { RegisterEntityOption } from './options/register-entity.options';
import { RelationOption } from './options/relations.options';
import { EntityColumnOption } from './options/entity.options';

/**
 * 定义实体的配置
 *
 * @author cyia
 * @date 2019-10-13
 * @export
 *
 */
export interface EntityConfig {
  entity: RegisterEntityOption;
  relations: RelationOption[];
  primaryKey: string;
  entityColumns: EntityColumnOption[];
}
