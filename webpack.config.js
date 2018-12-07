var path = require('path'),
    ngAnnotate  = require('ng-annotate-webpack-plugin'),

    pathToRoot = path.join(__dirname),
    pathToSrc = path.join(pathToRoot, 'src/'),
    entry = {};

entry['dist/vsdropdown'] = path.join(pathToSrc, 'index.js');

module.exports = {
    mode:  'development',
    entry: entry,
    output: {
        path: pathToRoot,
        filename: '[name].js',
        libraryTarget: 'window',
        library: 'VSDropdown'
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: [
                    {
                        loader: 'pug-loader',
                        options: {
                            root: path.resolve(__dirname, './')
                        }
                    }
                ]
            },

            {
                test: /(\.scss$)|(\.css$)/,
                use:[
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: 'global'
                        }
                    }, 
                    {
                        loader: "sass-loader"
                    }
                ]
            },

            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader:     'babel-loader',
                    options:    {
                        presets:    [
                            ["@babel/env", {
                                "targets": { "chrome": "44" }
                            }]
                        ],

                        plugins:    [
                            ["@babel/plugin-transform-runtime",
                                {
                                    regenerator : true
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new ngAnnotate({
            add: true
        })
    ]
};