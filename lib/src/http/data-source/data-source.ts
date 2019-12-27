import { Source } from '../../type';

export abstract class DataSource {
  abstract dataSource: Source;
  abstract find(): Promise<any>;
}
