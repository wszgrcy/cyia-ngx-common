export default (config, options, targetOptions) => {
  config.optimization.runtimeChunk = undefined;

  return config;
};
