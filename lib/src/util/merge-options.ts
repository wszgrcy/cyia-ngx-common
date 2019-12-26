/**
 *
 */
export function mergeOptions(...list: any[]): any {
  const options = {};
  list.forEach((item) => {
    if (!item || typeof item !== 'object') { return; }
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        options[key] = item[key] === undefined ? options[key] : item[key];
      }
    }
  });
  return options;
}
