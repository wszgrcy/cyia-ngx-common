import { ClassDataSource } from '../class-data-source';
import { of } from 'rxjs';

/**
 *@docs-decorator
 * @description 类继承,用于继承上一个类的数据来源
 * @export
 * @returns
 */
export function ClassInherit() {
  return ClassDataSource({ inherit: true, source: () => of(undefined) });
}
