import { HttpClient } from '@angular/common/http';
import { HttpRequestConfig } from '../http.define';
import { take, tap } from 'rxjs/operators';
import { mergeUrl } from '../../util/merge-url';
import { EntityOptions, Source } from '../../type';
import { mergeOptions } from '../../util/merge-options';
import { DataSource } from './data-source';

export class DataSourceByRequest extends DataSource {
  dataSource = Source.request;
  protected httpRequestConfig: HttpRequestConfig;
  constructor(
    protected http: HttpClient,
    protected urlPrefix: string,
    private requestByDecorator: EntityOptions['request'],
    requestByParams?: HttpRequestConfig | any[]
  ) {
    super();
    this.httpRequestConfig = this._getHttpRequestConfig(requestByParams);
  }
  find() {
    return this._findByRequest();
  }
  private _findByRequest() {
    return this.http
      .request(
        this.httpRequestConfig.method,
        mergeUrl(this.urlPrefix, this.httpRequestConfig.url),
        this.httpRequestConfig.options
      )
      .pipe(take(1))
      .toPromise();
  }
  /**需要从实体装饰器中拿到配置 */
  private _getHttpRequestConfig(param?: HttpRequestConfig | any[]) {
    let inputParams: HttpRequestConfig = param as any;
    if (this.requestByDecorator instanceof Function) {
      inputParams = this.requestByDecorator(...(param as any[]));
      return mergeOptions(new HttpRequestConfig(), inputParams);
    } else {
      return mergeOptions(new HttpRequestConfig(), this.requestByDecorator, inputParams);
    }
  }
}
