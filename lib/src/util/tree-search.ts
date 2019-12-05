class TreeLike<T> {
  children?: TreeLike<T>[];
  [name: string]: any;
}

export function getNode<T = any>(
  list: TreeLike<T>[],
  item: TreeLike<T>,
  searchfn: (listItem: TreeLike<T>, searchItem: TreeLike<T>) => boolean
) {
  let tempList = list.slice();
  let i = 0;
  while (i !== tempList.length) {
    const tempItem = tempList[i];
    if (tempItem.children && tempItem.children.length) {
      tempList = tempList.concat(tempItem.children);
    }
    i++;
  }
  return tempList.find(tempItem => searchfn(tempItem, item));
}
