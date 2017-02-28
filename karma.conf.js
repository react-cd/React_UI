/**
 * Created by yixi on 1/29/16.
 */

require("babel-register");

var webpackConfig = require('./webpack/test.config.js');
var isCI = process.env.CONTINUOUS_INTEGRATION === 'true';
var runCoverage = process.env.COVERAGE === 'true' || isCI;

var preprocessors = ['webpack', 'sourcemap'];
var reporters = ['mocha'];


module.exports = function(config) {
    config.set({
        basePath: '',

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        files: [
            'test/index.js'
        ],

        preprocessors: {
            'test/index.js': preprocessors
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true
        },

        reporters: reporters,

        mochaReporter: {
            output: 'autowatch'
        },

        coverageReporter: {
            dir: '.coverage',
            reporters: [
                { type: 'html' },
                { type: 'lcovonly' }
            ]
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: [ isCI ? 'ChromeTravisCI' : 'Chrome' ],

        customLaunchers: {
            ChromeTravisCI: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        captureTimeout: 60000,
        browserNoActivityTimeout: 45000,

        singleRun: isCI
    })
};
