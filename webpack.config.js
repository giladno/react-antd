const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const {name, theme} = require('./package.json');

const NODE_ENV = (process.env.NODE_ENV == 'development' && process.env.NODE_ENV) || 'production';

module.exports = {
    mode: NODE_ENV,
    entry: ['@babel/polyfill', './src/index.jsx'],
    devtool: {development: 'inline-source-map'}[NODE_ENV],
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        ...{
            development: {filename: 'bundle.js'},
            production: {filename: '[name].[chunkhash].js'},
        }[NODE_ENV],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: /\.(less|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {loader: 'less-loader', options: {javascriptEnabled: true, modifyVars: theme}},
                ],
            },
            {
                test: /\.(jpe?g|png|gif|woff2?|eot|ttf|svg)$/,
                use: 'file-loader?limit=10000',
            },
        ],
    },
    plugins: [
        new Dotenv({
            path: `./.env.${NODE_ENV}`,
        }),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify(NODE_ENV)},
            __DEV__: NODE_ENV == 'development',
        }),
        new (require('html-webpack-plugin'))({
            inject: false,
            template: require('html-webpack-template'),
            title: name,
            appMountId: 'root',
            mobile: true,
            minify: {collapseWhitespace: true},
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.ProvidePlugin({
            React: 'react',
        }),
        ...{
            development: [
                new webpack.NamedModulesPlugin(),
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoEmitOnErrorsPlugin(),
            ],
            production: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            dead_code: true,
                            properties: true,
                            conditionals: true,
                            booleans: true,
                            loops: true,
                            unused: true,
                            if_return: true,
                            negate_iife: true,
                            drop_console: true,
                            passes: 2,
                        },
                    },
                }),
            ],
        }[NODE_ENV],
    ],
    resolve: {
        modules: [path.resolve('./src'), 'node_modules'],
        extensions: ['.js', '.jsx', '.css', '.less'],
    },
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        hot: true,
        historyApiFallback: true,
    },
};
