const path = require('path');

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
      path: path.resolve(__dirname, 'api'),
      filename: 'index.js',
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
    ],
  };
};
