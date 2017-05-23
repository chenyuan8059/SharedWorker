var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './src/shareio.js',
    output: {
        publicPath:'/',
        path: path.resolve(__dirname, './dist'),
        filename: 'shareio.min.js',
        library:'shareio',
        libraryTarget:'umd'
    },
    module: {
        rules:[
            { 
                test: /\.js$/, 
                use:[
                    {
                        loader:'babel-loader', 
                        options:{
                            presets: ['es2015']
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve:{
        extensions:['.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings:false
            }
        }),
        // new webpack.NoErrorsPlugin()
    ]
};