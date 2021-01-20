import * as webpack from 'webpack';
import * as path from 'path';
import { EmittedFiles, getEmittedFiles } from '@angular-devkit/build-webpack/src/utils';
import { FileInfo } from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/augment-index-html';
import { RawSource } from 'webpack-sources';
import { SyncWaterfallHook, AsyncSeriesWaterfallHook } from 'tapable';
type ExtensionFilter = '.js' | '.css';

export class NgxBootstrapAssetsPlugin {
  constructor(private options: { output: string } = { output: 'bootstrap.json' }) {}
  hooks = {
    originAssets: new SyncWaterfallHook(['files']),
    beforeAppend: new SyncWaterfallHook(['bootstrapFiles']),
    beforeEmit: new SyncWaterfallHook(['bootstrapJson']),
  };
  apply(compiler: webpack.Compiler) {
    compiler.hooks.shouldEmit.tap('NgxBootstrapAssetsPlugin', (compilation) => {
      let files = getEmittedFiles(compilation);
      files = this.hooks.originAssets.call(files);
      let bootstrapFiles = filterAndMapBuildFiles(files, ['.css', '.js']);
      bootstrapFiles = this.hooks.beforeAppend.call(bootstrapFiles);
      let bootstrapJson: { scripts?: { src: string }[]; stylesheets?: { href: string }[] } = {
        scripts: [],
        stylesheets: [],
      };
      for (const { extension, file, name } of bootstrapFiles) {
        switch (extension) {
          case '.js':
            bootstrapJson.scripts.push({ src: file });
            break;
          case '.css':
            bootstrapJson.stylesheets.push({ href: file });
            break;
        }
      }
      bootstrapJson = this.hooks.beforeEmit.call(bootstrapJson);
      compilation.assets[this.options.output] = new RawSource(JSON.stringify(bootstrapJson, undefined, 4));
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
