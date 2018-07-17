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
            //'bbclib': ['./src/bbcclass/*'],
            //'babel-polyfill': ['./html/src/*.js', './html/src/*/*.js'],
            //auth: ['./src/index.mjs'],
            //'test.bbclib': ['./test/bbclib.test.js'],
            //'test.connection': ['./test/transaction_check.test.js'],
            'test.test': ['./test/test_bbclib.js'],
            'test.test2': ['./test/test_connection_bbcapp_and_bbccore.test.js']
            //'test.register': ['./test/api.register.spec.mjs'],
            //'test.refresh': ['./test/api.refresh.spec.mjs']
            // testはcommon-js記法だと動かないのでここでwebpack & babelしてしまう。
            // @babel/polyfill はIE11で動かないときなどで必要, libを作るときはGlobalが汚染されるのでこれを読み込むlibやhtmlの方でpolyfillを呼ぶこと。
        },
    output: {
        path: `${__dirname}/dist`,
        //filename: 'main.js'
        filename: '[name].bundle.js',
        chunkFilename: '[name].js',
        //path: path.resolve(__dirname, 'dist'),
        //publicPath: path.resolve(__dirname, 'dist'),
        //library: 'Auth',
        //libraryTarget: 'umd',
        //globalObject: 'this' // for node js import
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
                // exclude: /node_modules\/(?!(js-crypto-utils)\/).*/,
                // exclude: /node_modules(?!\/js-crypto-utils)/
            }
        ]
    },
    externals:[{
        // このwebpackで生成したライブラリを更に読み込んでwebpackする場合は指定。package.json/browserだけでは不十分。
        // 主に、jscuでrequireしているライブラリも含めて列挙するのが安全のよう。
        'xmlhttprequest': true, // 'xmlhttprequest': '{XMLHttpRequest:XMLHttpRequest}',
        'path': true,
        'fs': true,
        'crypto': true,
        'mkdirp': true,
        'jscu': true,
        'buffer': true,
        'cbytes': true,
        'assertArrays': true,
        'cjson': true

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
    // optimization: { // TODO: 分割の設定
    //   splitChunks: {
    //     chunks: 'all'
    //   }
    // }
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