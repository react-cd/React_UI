/**
 * Created by yixi on 2/1/16.
 */

import _ from 'lodash';
import baseConfig from './base.config';

export default _.extend({}, baseConfig, {
    output: {
        pathinfo: true
    },

    devtool: 'eval',
    resolve: {
        extensions: ['', '.js', '.json', '.jsx']
    }
});
