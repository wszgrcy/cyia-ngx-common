export function getDir(str: string): string {
  return str.substr(0, str.lastIndexOf('/'));
}
export function mergePath(...paths: string[]): string {
  const pathList = [];
  for (const list of paths.map((path) => path.split(/\/|\\/))) {
    for (const item of list) {
      switch (item) {
        case '..':
          pathList.pop();
          break;
        case '.':
        case '':
          break;

        default:
          pathList.push(item);
          break;
      }
    }
  }
  return pathList.join('/');
}
export function extname(str: string): string {
  return str.split('.').pop();
}
