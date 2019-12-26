import { Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityConfigRepository } from './entity-config-repository';
import { FindOptions, HttpRequestConfig } from './http.define';
import { EntityConfig } from '../type/entity.config';
import { Observable, from, of } from 'rxjs';
import { throwIf } from '../util/throw-if';
import { switchMap, map, take, tap } from 'rxjs/operators';
import { stronglyTyped } from '../util/strongly-typed';
import { Source } from '../type';
import { mergeOptions } from '../util/merge-options';
import { transform2Array } from '../util/transform2array';
import { REPOSITORY_SYMBOL } from '../symbol/entity.symbol';
import { RelationType } from '../type/relation.type';
import { RelationMatchingMode } from '../type/options/relations.options';
import { mergeUrl } from '../util/merge-url';

export class Repository<T> {
  // todo
  relation: number = RelationType.ManyToOne | RelationType.OneToMany | RelationType.OneToOne;
  constructor(protected entity: Type<T>, protected http: HttpClient, protected urlPrefix: string) {
    this.config = Repository._getEntityConfig(entity);
    throwIf(!this.config || !this.config.entity, `未定义实体${entity}`);
  }
  /**指定返回值 */
  protected config: EntityConfig;
  protected httpRequestConfig: HttpRequestConfig;
  static _getEntityConfig(entity: Type<any>) {
    return EntityConfigRepository.get(entity);
  }
  static getEntityRepository<T>(entity: Type<T>): { [name: string]: T } {
    return Reflect.getOwnMetadata(REPOSITORY_SYMBOL, entity) || {};
  }
  /**设置是否加载关系 */
  setLoadRelation(number: number) {
    this.relation = number;
    return this;
  }
  protected savePlainData<T>(data) {
    const config = this.config;
    if (config.entity.options.method === Source.normal || config.entity.options.method === Source.request) {
      data = transform2Array(data);
      const obj = Reflect.getOwnMetadata(REPOSITORY_SYMBOL, this.config) || {};
      (<any[]>data).forEach((item) => {
        obj[item[config.primaryKey] || `${Math.random()}`] = Object.assign({}, item);
      });
      Reflect.defineMetadata(REPOSITORY_SYMBOL, obj, this.entity);
    }
  }
  findOne<T>() {}
  findMany<T>() {}
  find<T>(param?: HttpRequestConfig | any[]): Observable<T> {
    this.httpRequestConfig = this._getHttpRequestConfig(param);
    return this._find().pipe(
      switchMap((res) => from(this.entityColumnImplementation(res))),
      switchMap((res) => from(this.relationsImplementation(res))),
      map((res) => stronglyTyped(res, this.entity) as any)
    );
  }
  protected _find(): Observable<any> {
    switch (this.config.entity.options.method) {
      case Source.request:
        return this._findByRequest();
      case Source.normal:
        return this._findByCache();
      default:
        break;
    }
  }
  private _findByRequest() {
    return this.http
      .request(
        this.httpRequestConfig.method,
        mergeUrl(this.urlPrefix, this.httpRequestConfig.url),
        this.httpRequestConfig.options
      )
      .pipe(
        take(1),
        tap((res) => this.savePlainData(res))
      );
  }
  private _findByCache() {
    return of(Object.values(Repository.getEntityRepository(this.entity)));
  }
  /**获得http请求的配置 */
  private _getHttpRequestConfig(param?: HttpRequestConfig | any[]) {
    let inputParams: HttpRequestConfig = param as any;
    if (this.config.entity.options.request instanceof Function) {
      inputParams = this.config.entity.options.request(...(param as any[]));
      return mergeOptions(new HttpRequestConfig(), inputParams);
    } else {
      return mergeOptions(new HttpRequestConfig(), this.config.entity.options.request, inputParams);
    }
  }

  /**
   * 实体列实现
   *
   * @private
   * @param {*} data
   * @returns
   */
  private async entityColumnImplementation(data: T | T[]) {
    const { /**实体列配置 */ entityColumns } = this.config;
    /**数据列表 */
    const dataList = transform2Array(data);
    for (let i = 0; i < entityColumns.length; i++) {
      const entityColumn = entityColumns[i];
      for (let j = 0; j < dataList.length; j++) {
        const dataItem = dataList[j];
        /**需要结构化的源数据 */
        const entityColumnRaw = dataItem[entityColumn.propertyName];
        /**结构化返回的数据 */
        const structRepository = new StructRepository(entityColumn.targetEntityFn(), this.http, this.urlPrefix);
        structRepository.setResult(entityColumnRaw);
        const result = await structRepository.find().pipe(take(1)).toPromise();
        dataList[j][entityColumn.propertyName] = result;
      }
    }
    return data instanceof Array ? dataList : dataList[0];
  }
  /**
   *关系实现
   *
   * @private
   * @param {*} data
   * @returns
   */
  private async relationsImplementation(data: T | T[]) {
    const relations = this.config.relations;
    const primaryKey = this.config.primaryKey;
    console.log('准备实现关系', relations, primaryKey);
    for (let i = 0; i < relations.length; i++) {
      const relation = relations[i];

      const inverseType = relation.inverseFn();
      const inverseEntityConfig = Repository._getEntityConfig(inverseType);
      switch (relation.name) {
        case RelationType.OneToOne:
          if (this.relation & RelationType.OneToOne) {
            await this.oneToOneImplementation(data, primaryKey, relation, inverseEntityConfig);
          }
          break;
        case RelationType.OneToMany:
          if (this.relation & RelationType.OneToMany) {
            console.log('一对多关系', data, primaryKey, relation, inverseEntityConfig);
            await this.oneToManyImplementation(data, primaryKey, relation, inverseEntityConfig);
          }
          break;
        case RelationType.ManyToOne:
          if (this.relation & RelationType.ManyToOne) {
            await this.ManyToOneImplementation(data, primaryKey, relation, inverseEntityConfig);
          }
          break;
        default:
          break;
      }
    }
    return data as any;
  }

  async oneToManyImplementation<I>(
    result,
    primaryKey: string,
    targetRelation: EntityConfig['relations'][0],
    inverseEntityConfig: EntityConfig
  ) {
    return this.generalRelationImplementation(
      result,
      primaryKey,
      targetRelation,
      inverseEntityConfig,
      (inverseMap) => {
        const inverseInstanceList = stronglyTyped(Object.values(inverseMap), inverseEntityConfig.entity.entity);
        return (item, primaryValue) => {
          /**查找到的反向的实例 */
          const inverseInstance = inverseInstanceList.filter(
            (inverseInstanceItem) =>
              item[targetRelation.propertyName] === targetRelation.inverseValueFn(inverseInstanceItem)
          );
          if (inverseInstance.length) {
            item[targetRelation.propertyName] = inverseInstance;
          } else {
            return true;
          }
          return false;
        };
      },
      { mod: inverseEntityConfig.entity.relationOptions.mode }
    );
  }

  async ManyToOneImplementation<I>(
    data: any,
    primaryKey: string,
    targetRelation: EntityConfig['relations'][0],
    inverseEntityConfig: EntityConfig
  ) {
    return this.generalRelationImplementation(
      data,
      primaryKey,
      targetRelation,
      inverseEntityConfig,
      (inverseMap) => (item, primaryValue) => {
        if (inverseMap[item[targetRelation.propertyName]]) {
          item[targetRelation.propertyName] = stronglyTyped(
            inverseMap[item[targetRelation.propertyName]],
            inverseEntityConfig.entity.entity
          );
        } else {
          return true;
        }
        return false;
      },
      { mod: inverseEntityConfig.entity.relationOptions.mode }
    );
  }
  async generalRelationImplementation(
    data,
    primaryKey,
    targetRelation: EntityConfig['relations'][0],
    inverseEntityConfig: EntityConfig,
    relationFn: (...args) => (...args) => boolean,
    options: { mod?: RelationMatchingMode }
  ) {
    let unFindList = [];
    /**反向实例对象 */
    let inverseMap: { [name: string]: any };
    const matchRelation = (mainList, fn: (...args) => boolean) => mainList.filter((item) => fn(item, item[primaryKey]));
    if (options.mod === RelationMatchingMode.auto || options.mod === RelationMatchingMode.repositoryOnly) {
      inverseMap = Repository.getEntityRepository(inverseEntityConfig.entity.entity);
      // doc 首次匹配
      unFindList = matchRelation(transform2Array(data), relationFn(inverseMap));
    }
    if (!unFindList.length || options.mod === RelationMatchingMode.repositoryOnly) {
      return;
    }
    if (options.mod === RelationMatchingMode.requestOnly) {
      unFindList = transform2Array(data);
    }
    if (options.mod === RelationMatchingMode.auto || options.mod === RelationMatchingMode.requestOnly) {
      // doc 请求数据
      inverseMap = {};
      transform2Array(await this.getDataByRelation(inverseEntityConfig, unFindList)).forEach((item) => {
        inverseMap[item[inverseEntityConfig.primaryKey || `${Math.random()}`]] = item;
      });

      // doc 返回类型强类型化
      // inverseMap = this.getEntityRepository(inverseEntityConfig.entity.entity)
      // doc 获得数据后二次匹配
      matchRelation(transform2Array(unFindList), relationFn(inverseMap));
    }
  }
  // protected abstract generateRepository<D>(entity: Type<D>): Repository<any>;
  private async getDataByRelation(entityConfig: EntityConfig, implementationResult) {
    const repository =
      //  this.generateRepository(entityConfig.entity.entity);
      new Repository(entityConfig.entity.entity, this.http, this.urlPrefix);
    repository.setLoadRelation(0);
    return repository.find(await entityConfig.entity.relationOptions.request(implementationResult)).toPromise();
  }
  async oneToOneImplementation<I>(
    data,
    primaryKey: string,
    targetRelation: EntityConfig['relations'][0],
    inverseEntityConfig: EntityConfig
  ) {
    return this.generalRelationImplementation(
      data,
      primaryKey,
      targetRelation,
      inverseEntityConfig,
      (inverseMap) => (item, primaryValue) => {
        if (inverseMap[primaryValue]) {
          item[targetRelation.propertyName] = stronglyTyped(
            inverseMap[primaryValue],
            inverseEntityConfig.entity.entity
          );
        } else {
          return true;
        }
        return false;
      },
      { mod: inverseEntityConfig.entity.relationOptions.mode }
    );
  }
}
export class StructRepository<T> extends Repository<T> {
  result: any;
  setResult(result) {
    this.result = result;
  }
  protected _find() {
    return of(this.result);
  }
}
