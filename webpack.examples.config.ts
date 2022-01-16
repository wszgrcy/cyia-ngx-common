import { BootstrapAssetsPlugin } from 'webpack-bootstrap-assets-plugin';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
import * as webpack from 'webpack';
export default (config: webpack.Configuration, options, targetOptions) => {
  config.plugins.push(new MonacoWebpackPlugin({ languages: ['typescript', 'javascript'] }));

  const loaders: any[] = config.module.rules.filter(
    (rule) =>
      (rule as any).use &&
      (rule as any).use.find(
        (it) =>
          it.loader &&
          (it.loader.includes('@angular-devkit\\build-optimizer') ||
            it.loader.includes('@angular-devkit/build-optimizer'))
      )
  );
  loaders.forEach((loader) => {
    const originalTest = loader.test;
    loader.test = (file) => {
      const isMonaco = !!file.match('monaco-editor');
      return !isMonaco && !!file.match(originalTest);
    };
  });
  let plugin = new BootstrapAssetsPlugin();
  config.plugins.push(plugin);
  plugin.hooks.removeChunk.tap('remove-polyfill', (item) => {
    return item.name.includes('polyfills');
  });
  return config;
};
