const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
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
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({      
  //       include: /\.min\.js$/
  //     })]  
  // },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'firebase',
          entry: 'https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js',
          global: 'firebase',
        },
        {
          module: 'firebase/analytics',
          entry: 'https://www.gstatic.com/firebasejs/7.13.2/firebase-analytics.js',
          global: 'firebase/analytics',
        },        
        {
          module: 'firebase-database',
          entry: 'https://www.gstatic.com/firebasejs/7.13.2/firebase-database.js',
          global: 'firebase-database',
        },
      ],
    })
  ]
};
