var webpack = require('webpack')
var config = {
   entry: './src/entry.js',
	
   output: {
      path:'./dist',
      filename: 'cloudboost1.js',
      library: "cloudboost",
      libraryTarget: 'umd',
      umdNamedDefine: true
   },
   module: {
      loaders: [
         { test: /\.json$/, loader: 'json' },
         {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
				
            query: {
               presets: ['es2015']
            }
         }
      ]
   },
  node: {
    fs: "empty"
  },
   plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     mangle: false,
        //     output: {
        //         comments: false,
        //     },
        // }),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // })
    ]
}

module.exports = config;