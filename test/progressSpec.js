/**
 * Created by yixi on 2/1/16.
 */
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';

import Progress from '../src/progress.jsx';

describe('Progress', () => {
    it('Should output a progress with wrapper', () => {
        let instance = TestUtils.renderIntoDocument(
            <Progress />
        );

        assert.equal(ReactDOM.findDOMNode(instance).nodeName, 'DIV');
    });
});