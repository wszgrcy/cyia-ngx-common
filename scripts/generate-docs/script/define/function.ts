import { DocParameter } from './parameter';
import { ApiDoc } from 'dgeni-packages/typescript/api-doc-types/ApiDoc';
import { FileInfo } from 'dgeni-packages/typescript/services/TsParser/FileInfo';
import ts from 'typescript';
import { DECORATOR_DOC_TYPE } from '../const/doc-type';
export class BaseDoc implements ApiDoc {
  docType: string;
  name: string;
  id: string;
  aliases: string[];
  path: string;
  outputPath: string;
  content: string;
  symbol: ts.Symbol;
  declaration: ts.Declaration;
  fileInfo: FileInfo;
  startingLine: number;
  endingLine: number;
  description: string;
}
export class DocFunction extends BaseDoc {
  docParameters: DocParameter[];
}
export class DocDecorator extends DocFunction {
  readonly docType = DECORATOR_DOC_TYPE;
}
