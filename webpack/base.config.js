/**
 * Created by yixi on 2/1/16.
 */

import webpack from 'webpack';

export const jsLoader = 'babel?cacheDirectory';

const baseConfig =  {
    entry: undefined,
    output: undefined,
    externals: undefined,

    module: {
        loaders: [
            {test: /\.js/, loader: jsLoader, exclude: /node_modules/}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.jsx']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ]
};

export default baseConfig
