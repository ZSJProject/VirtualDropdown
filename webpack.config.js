var path = require('path');
var webpack = require('webpack');

var pathToRoot = path.join(__dirname);
var pathToSrc = path.join(pathToRoot, 'src/');
var entry = {};

entry['dist/vsdropdown'] = path.join(pathToSrc, 'index.js');

module.exports = {
    mode:'production',
    entry: entry,
    output: {
        path: pathToRoot,
        filename: '[name].js',
        libraryTarget: 'window',
        library: 'VSDropdown'
    },
    module: {
        rules: [{
            test: /\.pug$/,
            use: [
                {
                    loader: 'html-loader'
                },
                {
                    loader: 'pug-html-loader'
                }
            ]
        }]
    },
    resolve:{
        alias: {
            pug: path.resolve(__dirname, 'src/template/'),
            js: path.resolve(__dirname, 'src/')
        }
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: false
        })
    ]
};