import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';

import Popconfirm from '../src/popconfirm';

describe('Popconfirm', () => {
    it('Should output a popconfirm with wrapper', () => {
        let instance = TestUtils.renderIntoDocument(
            <Popconfirm />
        );

        let node = ReactDOM.findDOMNode(instance);
        assert.equal(node.nodeName, 'DIV');
        assert.equal(node.className, 'mq-popconfirm');
    })
})
