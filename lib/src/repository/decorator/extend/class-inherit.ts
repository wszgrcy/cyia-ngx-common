import { ClassDataSource } from '../class-data-source';
import { of } from 'rxjs';

export function ClassInherit() {
  return ClassDataSource({ inherit: true, source: () => of(undefined) });
}
