const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

module.exports = {
  entry: {
	  "bundle": './src/index.ts'
	// "bundle.min": './src/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
  externals: {
    firebase: 'firebase'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'index.html',
      template: 'src/index.html'
    })
  ]
};
