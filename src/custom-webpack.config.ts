  import { EnvironmentPlugin } from 'webpack'
  //const Dotenv = require('dotenv-webpack')

  /* module.exports = {
    module: {
      rules: [
        {
          test: /\.css?$/,
          use: ['postcss-loader']
        }
      ]
    },
    plugins: [
      new Dotenv()
    ],
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "vm": require.resolve("vm-browserify")
      }
    }
  } */

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss?$/,
        use: ['postcss-loader']
      }
    ]
  },
  plugins: [
    new EnvironmentPlugin({
          // Define development or testing environment variables here (optional)
    })
  ],
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "vm": require.resolve("vm-browserify")
    }
  }
};