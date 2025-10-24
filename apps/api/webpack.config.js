const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: 'apps/api/src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,

      externalDependencies: [
        'cookie-parser',
        '@nestjs/microservices',
        '@nestjs/websockets',
        '@nestjs/platform-socket.io',
        '@nestjs/websockets/socket-module',
        '@nestjs/microservices/microservices-module',
      ],
    }),
  ],

  externals: {
    '@nestjs/microservices': 'commonjs @nestjs/microservices',
    '@nestjs/websockets': 'commonjs @nestjs/websockets',
    '@nestjs/platform-socket.io': 'commonjs @nestjs/platform-socket.io',
    '@nestjs/websockets/socket-module':
      'commonjs @nestjs/websockets/socket-module',
    '@nestjs/microservices/microservices-module':
      'commonjs @nestjs/microservices/microservices-module',
  },

  ignoreWarnings: [
    {
      module: /node_modules/,
      message:
        /Critical dependency: the request of a dependency is an expression/,
    },
    {
      module: /node_modules[\\/]iterare/,
      message: /Failed to parse source map/,
    },
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [/node_modules[\\/]iterare/],
      },
    ],
  },
};
