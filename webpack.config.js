module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: ['babel-polyfill', './html/src/index.js'], // babel-polyfill はIE11などで必要
    output: {
        path: `${__dirname}/html/js`,
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};