const path = require('path');

module.exports = {
  entry: {
	  "worker": './src/ts/worker.ts'
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
  }
};
