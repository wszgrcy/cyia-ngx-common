import { RegisterEntityOption } from "./options/register-entity.options";
import { RelationOption } from "./options/relations.options";
import { EntityColumnOption } from "./options/entity.options";

export interface EntityConfig {
  entity: RegisterEntityOption
  relations: RelationOption[]
  primaryKey: string
  entityColumns: EntityColumnOption[]
}
