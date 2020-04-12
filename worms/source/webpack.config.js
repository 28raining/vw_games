const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
	"bundle": './src/index.ts',
	"bundle.min": './src/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({      
        include: /\.min\.js$/
      })]  
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
