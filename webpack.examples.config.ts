import { NgxBootstrapAssetsPlugin } from './webpack-ngx-bootstrp-assets-plugin';

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

export default (config, options, targetOptions) => {
  config.optimization.runtimeChunk = undefined;
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
  config.plugins.push(new NgxBootstrapAssetsPlugin());
  return config;
};
