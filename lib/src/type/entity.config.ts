import { RegisterEntityOption } from "./options/register-entity.options";
import { RelationOption } from "./options/relations.options";

export interface EntityConfig {
  entity: RegisterEntityOption
  relations: RelationOption[]
  primaryKey: string
}
