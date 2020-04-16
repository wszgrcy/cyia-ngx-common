/**
 * 合并选项
 */
export function mergeOptions<T= any>(...list: T[]): any {
  return list.reduce((pre, current) => {
    return {
      ...pre,
      ...current,
    };
  }, {});
}
