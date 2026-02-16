const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    entry: './src/serverless.ts',
    output: {
      ...options.output,
      filename: 'serverless.js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs2',
    },
    resolve: {
      ...options.resolve,
      alias: {
        ...options.resolve?.alias,
        '@app': path.resolve(__dirname, 'src/'),
      },
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (error) {
              return true;
            }
          }
          return false;
        },
      }),
      new CopyPlugin({
        patterns: [
          { from: 'src/i18n', to: 'i18n' },
        ],
      }),
    ],
  };
};
