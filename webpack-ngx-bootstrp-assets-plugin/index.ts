import * as webpack from 'webpack';
import * as path from 'path';
import { EmittedFiles, getEmittedFiles } from '@angular-devkit/build-webpack/src/utils';
import { FileInfo } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/augment-index-html';
import { RawSource } from 'webpack-sources';
type ExtensionFilter = '.js' | '.css';

export class NgxBootstrapAssetsPlugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.shouldEmit.tap('NgxBootstrapAssetsPlugin', (compilation) => {
      let files = getEmittedFiles(compilation);
      let bootStrapFiles = filterAndMapBuildFiles(files, ['.css', '.js']);
      let bootStrapJson: { scripts?: { src: string }[]; stylesheets?: { href: string }[] } = {
        scripts: [],
        stylesheets: [],
      };
      for (const { extension, file, name } of bootStrapFiles) {
        switch (extension) {
          case '.js':
            bootStrapJson.scripts.push({ src: file });
            break;
          case '.css':
            bootStrapJson.stylesheets.push({ href: file });
            break;
        }
      }
      compilation.assets['bootstrap.json'] = new RawSource(JSON.stringify(bootStrapJson, undefined, 4));
    });
  }
}

function filterAndMapBuildFiles(
  files: EmittedFiles[],
  extensionFilter: ExtensionFilter | ExtensionFilter[]
): FileInfo[] {
  const filteredFiles: FileInfo[] = [];
  const validExtensions: string[] = Array.isArray(extensionFilter) ? extensionFilter : [extensionFilter];

  for (const { file, name, extension, initial } of files) {
    if (name && initial && validExtensions.includes(extension)) {
      filteredFiles.push({ file, extension, name });
    }
  }

  return filteredFiles;
}
