// webpack.config.js
// 設定ファイルはwebpack = node.js上で実行されるので、
// require()のようなnode(CommonJS)のメソッドが使える。

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');


// port babelrc from .babelrc
const getBabelWebOpt = () => {
    const pluginExclude = ['babel-plugin-dynamic-import-node-sync'];
    const envBrowserTargets = [
        'last 2 chrome versions',
        'last 2 firefox versions',
        'IE 11',
        'last 2 Edge versions'
    ];
    const babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
    babelrc.babelrc = false;
    babelrc.presets = babelrc.presets.map( (elem) => {
        if (elem instanceof Array){
            if(elem[0] === '@babel/preset-env'){
                elem[1].targets.browsers = envBrowserTargets;
                elem[1].modules = false; // for browsers. if true, import statements will be transpiled to CommonJS 'require', and webpack tree shaking doesn't work.
            }
        }
        return elem;
    });
    babelrc.plugins = babelrc.plugins.filter( (elem) => pluginExclude.indexOf(elem) < 0);
    console.log(babelrc);
    return babelrc;
};

const webConfig = {
    target: 'web',
    entry:
        {
            'test.bbclib': ['./test/test_bbclib.js'],
            //'test.connection': ['./test/transaction_check.test.js'],
            'bbclib': ['./src/index.js']
            // testはcommon-js記法だと動かないのでここでwebpack & babelしてしまう。
            // @babel/polyfill はIE11で動かないときなどで必要, libを作るときはGlobalが汚染されるのでこれを読み込むlibやhtmlの方でpolyfillを呼ぶこと。
        },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: path.resolve(__dirname, 'dist'),
        library: 'js-bbclib',
        libraryTarget: 'umd',
        globalObject: 'this' // for node js import
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.(m|)js$/,
                use: [{
                    loader: 'babel-loader',
                    options: getBabelWebOpt()
                }],
                exclude: path.join(__dirname, 'node_modules') // exclude: /node_modules/
            }
        ]
    },
    externals:[{
        'js-crypto-utils': true,
        'js-encoding-utils': true,
        'bson': true,
        'buffer': true,
        'js': true,
    }],
    plugins:[
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.optimize.MinChunkSizePlugin({minChunkSize: 1000})
    ],
    node: {
        fs: 'empty'
    }
};

module.exports = (env, argv) => {
    const config = webConfig;
    if (argv.mode === 'development'){
        console.log('build for development');
        config.devtool = 'inline-source-map'; // add inline source map
    }
    else if(argv.mode === 'production'){
        console.log('build for production');
    }
    return config;
};