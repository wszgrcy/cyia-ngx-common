export function mergeUrl(...list: string[]) {
  return list
    .filter((url) => url)
    .reduce((pre, cur, i) => {
      if (/^https?:\/\//.test(cur)) {
        pre = '';
      }

      if (pre && pre.endsWith('/') && cur.startsWith('/')) {
        return `${pre}${cur.substr(1)}`;
      } else if (pre && !pre.endsWith('/') && !cur.startsWith('/')) {
        return `${pre}/${cur}`;
      } else {
        return `${pre}${cur}`;
      }
    }, '');
}
