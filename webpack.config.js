var webpack = require('webpack')
var config = {
   entry: './src/entry.js',
	
   output: {
      path:'./dist',
      filename: 'cloudboost.js',
   },
   module: {
      loaders: [
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
   plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
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