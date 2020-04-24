import { DocType } from '../define/doc-type';
export function typeService() {
  return new TypeService();
}

export class TypeService {
  private typeMap = new Map<string, DocType>();
  /**原始类型的文档列表 */
  private orgtypeDocList = [];
  constructor() {}
  setType(docs = []) {
    this.orgtypeDocList = docs.filter((item) => item.docType === 'class' || item.docType === 'interface');
    this.orgtypeDocList.forEach((doc: any, i) => {
      this.addType(doc);
    });
  }
  private addType(doc) {
    if (this.typeMap.has(doc.name)) {
      return;
    }
    const docType = new DocType();
    docType.name = doc.name;
    docType.description = doc.description;
    doc.members.forEach((member) => {
      // console.log(member.declaration.initializer.text);
      docType.propertyList.push({
        name: member.name,
        description: member.description,
        type: member.type,
        // default: member.declaration.initializer.text,
      });
      const extraType = this.find(member.type);
      if (extraType) {
        docType.extraDocTypeList.push(extraType);
      }
    });
    this.typeMap.set(doc.name, docType);
  }
  private find(type: string) {
    const returnType = this.typeMap.get(type);
    if (!returnType) {
      const orgDoc = this.orgtypeDocList.find((doc) => doc.name === type);
      if (orgDoc) {
        this.addType(orgDoc);
        return this.typeMap.get(type);
      } else {
        return undefined;
      }
    }
    return returnType;
  }
  getType(name: string) {
    return this.typeMap.get(name);
  }
}
