import { RelationType } from '../relation.type';
import { Type } from '@angular/core';

export interface RelationOption {
  /**关系名 */
  name: RelationType;
  inverseFn: () => Type<any>;
  inverseValueFn?: (args) => any;
  target: any;
  options: any;
  /**附加位置 */
  propertyName: string;
}
export enum RelationMatchingMode {
  repositoryOnly,
  requestOnly,
  auto
}
