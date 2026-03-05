module.exports = function (api) {
  api.cache(true);

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove todos os console.* no bundle de produção
      ...(isProduction ? [['transform-remove-console', { exclude: [] }]] : []),
    ],
  };
};
