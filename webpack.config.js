module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    output: {
      ...options.output,
      filename: 'main.js',
    },
    resolve: {
      ...options.resolve,
      alias: {
        ...options.resolve?.alias,
        '@app': require('path').resolve(__dirname, 'src/'),
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
