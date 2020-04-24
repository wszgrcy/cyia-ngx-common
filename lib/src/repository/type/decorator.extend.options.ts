export class PropertyDefaultValueOptions {
  /**是否为null */
  isNull?: boolean = false;
  /**是否为undefined */
  isUndefined?: boolean = true;
  /**是否为0 */
  isZero?: boolean = false;
  /**是否为nan */
  isNaN?: boolean = false;
  /**是否为空字符串 */
  isEmptyString?: boolean = false;
  /**是否==false */
  equalToFalse?: boolean = false;
}
