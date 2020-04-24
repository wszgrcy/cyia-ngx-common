import { ClassDataSource } from '../class-data-source';
import { of } from 'rxjs';

/**
 *@docs-decorator
 *
 * @export
 * @returns
 */
export function ClassInherit() {
  return ClassDataSource({ inherit: true, source: () => of(undefined) });
}
