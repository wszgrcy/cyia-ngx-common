export type CommonNode = Node;
export type ContainerNode = Node;
export type ChildNode = Node | ProxyNode;
function isTemplateNode(node: any): node is HTMLTemplateElement {
  return node.tagName === 'TEMPLATE' && node.content !== undefined;
}
export function insertChildToContainer(
  parent: ContainerNode | undefined,
  newChild: CommonNode,
  anchor?: CommonNode | null
) {
  if (!parent) return;
  if (!anchor) {
    const targetParent = isTemplateNode(parent) ? parent.content : parent;
    targetParent.appendChild(newChild);
  } else {
    const targetParent = isTemplateNode(parent) ? parent.content : parent;
    targetParent.insertBefore(newChild, anchor);
  }
}

function countBefore(list: ChildNode[], node?: ChildNode): number {
  let count = 0;
  for (const item of list) {
    if (node && node === item) {
      break;
    } else if (isProxyNode(item)) {
      count += countBefore(item.children);
    } else {
      count++;
    }
  }
  return count;
}

export class ProxyNode {
  #parentContainer?: ContainerNode;
  parentProxy: ProxyNode | undefined = undefined;
  context;
  children: ChildNode[] = [];
  get parentNode(): ProxyNode | ContainerNode | null {
    return this.parentProxy ?? this.#parentContainer ?? null;
  }
  constructor(context: ProxyNodeContext) {
    this.context = context;
  }
  linkProxy(parent: ProxyNode, refChild?: ChildNode | null) {
    this.parentProxy?.remove(this);
    this.parentProxy = parent;
    if (refChild) {
      const index = parent.children.indexOf(refChild);
      if (ngDevMode && index === -1) {
        throw new Error('linkProxy Query Error');
      }
      parent.children.splice(index, 0, this);
    } else {
      parent.children.push(this);
    }
    this.#insertAll();
  }
  linkContainer(parent: ContainerNode, refChild?: ChildNode) {
    this.parentProxy?.remove(this);
    this.parentProxy = undefined;
    this.#parentContainer = parent;
    this.#insertAll(refChild);
  }
  unlinkProxy() {
    this.#removeAllOnly();
    this.parentProxy = undefined;
  }
  unlinkContainer() {
    this.#removeAllOnly();
    this.#parentContainer = undefined;
  }

  getContainer(): ContainerNode | undefined {
    if (this.parentProxy) {
      return this.parentProxy.getContainer();
    }
    return this.#parentContainer;
  }
  getInsertPosition(node?: ChildNode) {
    return countBefore(this.children, node);
  }
  #getStartIndex(refChild?: ChildNode): number {
    if (this.parentProxy) {
      return this.parentProxy.getInsertPosition(this) + this.parentProxy.#getStartIndex();
    }
    const instance = this.context.boxMap.get(this.getContainer()!);

    return instance ? countBefore(instance?.realList, refChild ?? this) ?? 0 : 0;
  }

  getAnchor(offset?: number, refChild?: ChildNode) {
    const base = this.#getStartIndex(refChild);
    const count = base + (typeof offset === 'number' ? offset : this.getInsertPosition(undefined));
    const container = this.getContainer();
    if (!container) {
      return undefined;
    }
    // todo 是否可以改造，实现更方便的位置获取

    return (container as HTMLElement).childNodes[count] as HTMLElement;
  }
  #removeContainerChild(child: any) {
    child.remove();
  }
  #removeAllOnly() {
    this.children.forEach((child) => {
      if (isProxyNode(child)) {
        child.#removeAllOnly();
      } else {
        this.#removeContainerChild(child);
      }
    });
  }
  remove(child: ChildNode) {
    const index = this.children.indexOf(child);
    if (ngDevMode && index === -1) {
      throw new Error('remove Query Error');
    }
    if (isProxyNode(child)) {
      child.unlinkProxy();
    } else {
      this.#removeContainerChild(child);
    }
    this.children.splice(index, 1);
  }

  appendChild(newChild: CommonNode, refChild?: ChildNode | null) {
    const oldParent = this.context.findDescendantParent(newChild);
    if (oldParent) {
      oldParent.remove(newChild);
    }
    let index;
    if (refChild) {
      index = this.children.indexOf(refChild);
      if (ngDevMode && index === -1) {
        throw new Error('insertBefore Query Error');
      }
    }

    const insertAnchor = refChild ? this.getAnchor(this.getInsertPosition(refChild)) : this.getAnchor();
    insertChildToContainer(this.getContainer(), newChild, insertAnchor);

    if (refChild) {
      this.children.splice(index!, 0, newChild);
    } else {
      this.children.push(newChild);
    }
  }

  #insertAll(refChild?: ChildNode) {
    for (const item of this.children) {
      if (isProxyNode(item)) {
        item.#insertAll(refChild);
      } else {
        const anchor = this.getAnchor(this.getInsertPosition(item), refChild);
        const result = insertChildToContainer(this.getContainer(), item, anchor);
        if (ngDevMode && (result as any) === -1) {
          throw new Error('#insertAll Insert Error');
        }
      }
    }
  }
}
export function isProxyNode(node: any): node is ProxyNode {
  return node instanceof ProxyNode;
}
class NodeInfo {
  realList: ChildNode[] = [];

  realRef(node: ChildNode) {
    if (isProxyNode(node)) {
      return node.getAnchor(0);
    } else {
      return node;
    }
  }
}
export class ProxyNodeContext {
  boxMap = new Map<CommonNode, NodeInfo>();
  appendChild(container: ContainerNode | ProxyNode, child: ChildNode) {
    if (isProxyNode(container)) {
      return;
    }
    const instance = this.boxMap.get(container) ?? new NodeInfo();
    instance.realList.push(child);
    this.boxMap.set(container, instance);
  }
  removeChild(container: ContainerNode | ProxyNode, child: ChildNode) {
    if (isProxyNode(container)) {
      return;
    }
    const instance = this.boxMap.get(container)!;
    const index = instance.realList.indexOf(child);
    if (ngDevMode && index === -1) {
      throw new Error('removeChild Query Error');
    }
    instance.realList.splice(index, 1);
  }
  insertBefore(parent: ContainerNode | ProxyNode, newChild: ChildNode, refChild: ChildNode | null) {
    if (isProxyNode(parent)) {
      return;
    }
    const instance = this.boxMap.get(parent) ?? new NodeInfo();
    if (refChild) {
      const index = instance.realList.indexOf(refChild);
      if (ngDevMode && index === -1) {
        throw new Error('insertBefore Query Error');
      }
      instance.realList.splice(index, 0, newChild);
    } else {
      instance.realList.push(newChild);
    }

    this.boxMap.set(parent, instance);
  }
  findDescendantParent(node: CommonNode): ProxyNode | null {
    const maybeParent = node.parentNode;
    if (!maybeParent) {
      return null;
    }
    if (isProxyNode(maybeParent)) {
      return maybeParent;
    }
    const ctx = this.boxMap.get(maybeParent as any);
    if (!ctx) {
      return null;
    }
    return this._findInRealList(ctx.realList, node, null);
  }

  private _findInRealList(realList: ChildNode[], node: CommonNode, currentProxy: ProxyNode | null): ProxyNode | null {
    for (const item of realList) {
      if (item === node) {
        return currentProxy;
      }
    }
    for (const item of realList) {
      if (isProxyNode(item)) {
        const result = this._findInRealList(item.children, node, item);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }
}
