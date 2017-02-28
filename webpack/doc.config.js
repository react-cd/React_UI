/**
 * Created by yixi on 3/29/16.
 */

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import baseConfig from './base.config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

var EXAMPLES_DIR = path.resolve(__dirname, '../doc');

function isDirectory(dir) {
    return fs.lstatSync(dir).isDirectory();
}


function buildEntries() {
    return fs.readdirSync(EXAMPLES_DIR).reduce(function (entries, dir) {
        if (dir === 'build')
            return entries;

        var isDraft = dir.charAt(0) === '_';

        if (!isDraft && isDirectory(path.join(EXAMPLES_DIR, dir)))
            entries[dir] = path.join(EXAMPLES_DIR, dir, 'client.js');

        return entries;
    }, {});
}

export default _.extend({}, baseConfig, {

    devtool: 'source-map',

    entry: {
        doc: './doc/client.js'
    },

    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        path: 'doc/_build',
        publicPath: '/_build/'
    },

    module: {
        noParse: /babel-core\/browser/,
        preLoaders: [{
            test: /\.js$|.jsx$/,
            exclude: [/node_modules/, /doc/],
            loaders: ['eslint']
        }],
        loaders: [
            { test: /\.js|\.jsx/, loader: 'babel', exclude: /node_modules|Samples\.js/ },
            { test: /\.json$/, loader: 'json' },
            { test: /\.jpe?g$|\.gif$|\.png|\.ico$/, loader: 'file?name=[name].[ext]' },
            { test: /\.eot$|\.ttf$|\.svg$|\.woff2?$/, loader: 'file?name=[name].[ext]' },
            {
                test: /\.scss$|.css$/,
                // loaders: ["style", "css?sourceMap", "sass?sourceMap"]
                loader: ExtractTextPlugin.extract("style", "css!sass")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
});
