/**
 * Created by yixi on 3/31/16.
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';

import DropDown from '../src/dropdown.jsx';

describe('Dropdown', () => {
    it('Shoud output a dropdown button with wrapper', () => {
        let instance  = TestUtils.renderIntoDocument(
            <DropDown />
        );

        let node = ReactDOM.findDOMNode(instance);
        assert.equal(node.nodeName, 'DIV');
        assert.equal(node.className, 'mq-dropdown');

        let instance2 = TestUtils.renderIntoDocument(
            <DropDown btnClass='btn-block'/>
        );

        assert.equal(ReactDOM.findDOMNode(instance2).className, 'mq-dropdown dropdown-block');
        assert.equal(TestUtils.findRenderedDOMComponentWithClass(instance2,'mq-btn-dropdown-button').textContent, '请选择');

    });

    it('Should output a custom dropdown click element', () => {
        let instance = TestUtils.renderIntoDocument(
            <DropDown><a className="customizeButton">自定义按钮</a></DropDown>
        );

        let node = ReactDOM.findDOMNode(instance);
        let customizeButton = TestUtils.findRenderedDOMComponentWithClass(instance, 'customizeButton');
        assert.equal(customizeButton.textContent, '自定义按钮');
    });

    it('Shoud handle menu show when click down the button', () => {

        let dropDownData = [
            {label: '奥格瑞玛', value: 'wow'},
            {label: '雷霆崖'},
            {label: '幽暗城'},
            {label: '银月城'},
            {label: '暴风城'},
            {label: '达纳苏斯'}
        ];


        let instance = TestUtils.renderIntoDocument(
            <DropDown placeholder="选择地区"
                      data={dropDownData}/>
        );

        let node = ReactDOM.findDOMNode(instance);
        let buttonNode = TestUtils.findRenderedDOMComponentWithClass(instance, 'mq-btn-dropdown-button');

        // assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'mq-dropdown-menu').length, 0);
        assert.equal(document.getElementsByClassName('mq-popup-portal').length, 0);
        assert.equal(TestUtils.findRenderedDOMComponentWithClass(instance,'mq-btn-dropdown-button').textContent, '选择地区');

        TestUtils.Simulate.mouseDown(buttonNode);

        assert.equal(document.getElementsByClassName('mq-popup-portal').length, 1);
        assert.equal(document.getElementsByClassName('mq-popup-portal')[0].getElementsByTagName('LI').length, 6);


        TestUtils.Simulate.mouseDown(buttonNode);

        // assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'mq-dropdown-menu').length, 0);
        assert.equal(document.getElementsByClassName('mq-popup-portal').length, 0);

    });

});
