// function treeSearch<T = any>(list: TreeLike<T>[], item: TreeLike<T>, searchfn: (listItem: TreeLike<T>, searchItem: TreeLike<T>) => boolean) {
//     let heapList: TreeLike<T>[] = [];
//     heapList = list.slice()
//     /**每一层有几个的列表 */
//     let indexList: number[] = [list.length]
//     let paths = []
//     let index = 0
//     while (heapList.length) {
//         console.log('--------------');
//         let listItem = heapList.pop()
//         console.log(listItem);
//         paths.push(listItem)
//         console.log(paths.length, indexList.length);
//         if (listItem.children && listItem.children.length) {
//             index = 0
//             heapList = heapList.concat(listItem.children)
//             indexList.push(listItem.children.length)
//         } else {
//             if (searchfn(listItem, item)) {
//                 return paths
//             } else {
//                 index++
//                 let length = indexList.slice(-1)[0]
//                 console.log('路径长度', paths.length, '当前层节点数量', length, '测试', index);
//                 if (paths.length == indexList.length) {
//                     paths.pop()
//                 }
//                 if (length == index) {
//                     paths.pop()
//                     index = 0;
//                     indexList.pop()
//                 }
//             }
//         }
//     }
// }

// function getTreeLevel(list: number[], length: number) {
//     for (let i = 0; i < list.length; i++) {
//         const element = list[i];

//     }
// }
class TreeLike<T> {
    children?: TreeLike<T>[];
    [name: string]: any
}
// let res = treeSearch([{
//     v: 1, children: [{
//         v: 2, children: [
//             { v: 21 }
//         ]
//     }, {
//         v: 3, children: [
//             { v: 31, children: [{ v: 311 }, { v: 312 }, { v: 313 }] },
//             { v: 32 }

//         ]
//     }]
// }, { v: 6 }], { v: 312 }, (a, b) => a.v == b.v)
// console.log(res)

export function getNode<T = any>(list: TreeLike<T>[], item: TreeLike<T>, searchfn: (listItem: TreeLike<T>, searchItem: TreeLike<T>) => boolean) {
    let tempList = list.slice();
    let i = 0;
    while (i !== tempList.length) {
        const item = tempList[i];
        if (item.children && item.children.length) {
            tempList = tempList.concat(item.children);
        }
        i++;
    }
    return tempList.find((tempItem) => searchfn(tempItem, item));
}
