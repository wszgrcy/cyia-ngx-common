import { BootstrapAssetsPlugin } from 'webpack-bootstrap-assets-plugin';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

export default (config, options, targetOptions) => {
  config.output.jsonpFunction = 'examplesJsonp';
  config.plugins.push(new MonacoWebpackPlugin({ languages: ['typescript', 'javascript'] }));

  const loaders: any[] = config.module.rules.filter(
    (rule) =>
      rule.use &&
      rule.use.find(
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
  plugin.hooks.originAssets.tap('remove-polyfill', (list: any[]) => {
    return list.filter((item) => !(item.name || '').includes('polyfills'));
  });
  return config;
};
