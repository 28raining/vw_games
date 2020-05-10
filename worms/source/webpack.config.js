const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

module.exports = {
  entry: {
	  "bundle_index": './src/ts/index.ts',
	  "bundle_three": './src/ts/three.ts'
	// "bundle_index.min": './src/index.ts'
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
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },      
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ]
  },
  externals: {
    // firebase: 'firebase'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['bundle_index']
    }),
    new HtmlWebpackPlugin({ 
      filename: 'newpage.html',
      template: 'src/newpage.html',
      chunks: ['bundle_three']
    })
  ]
};
