/**
 * Created by linsong on 4/14/2016.
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';

import StageDropDown from '../src/stage-dropdown.jsx';

describe('StageDropDown', () => {
    it('Shoud output a StageDropDown button with wrapper', () => {
        let instance  = TestUtils.renderIntoDocument(
            <StageDropDown />
        );

        let node = ReactDOM.findDOMNode(instance);
        assert.equal(node.nodeName, 'DIV');
        assert.equal(node.className, 'mq-dropdown');

        let instance2 = TestUtils.renderIntoDocument(
            <StageDropDown btnClass='btn-block'/>
        );

        assert.equal(ReactDOM.findDOMNode(instance2).className, 'mq-dropdown dropdown-block');
        assert.equal(TestUtils.findRenderedDOMComponentWithClass(instance2,'mq-btn-dropdown-button').textContent, '请选择');

    });

    it('Should output a custom StageDropDown click element', () => {
        let instance = TestUtils.renderIntoDocument(
            <StageDropDown><a className="customizeButton">自定义按钮</a></StageDropDown>
        );

        let node = ReactDOM.findDOMNode(instance);
        let customizeButton = TestUtils.findRenderedDOMComponentWithClass(instance, 'customizeButton');
        assert.equal(customizeButton.textContent, '自定义按钮');
    });

    it('Shoud handle menu show when click down the button', () => {

        let dropDownData = [
            {label: '奥格瑞玛', value: 'wow', children: [{label: '但是', value: 'df'}]},
            {label: '雷霆崖', value: 'zxc', children: [{label: '发的方法', value: 'dfd'}]},
        ];


        let instance = TestUtils.renderIntoDocument(
            <StageDropDown placeholder="选择地区" multi={true}
                      data={dropDownData}/>
        );


        let node = ReactDOM.findDOMNode(instance);
        let buttonNode = TestUtils.findRenderedDOMComponentWithClass(instance, 'mq-btn-dropdown-button');

        // assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'mq-dropdown-menu').length, 0);
        assert.equal(document.getElementsByClassName('mq-popup-portal').length, 0);
        assert.equal(TestUtils.findRenderedDOMComponentWithClass(instance,'mq-btn-dropdown-button').textContent, '选择地区');
        TestUtils.Simulate.mouseDown(buttonNode);

        assert.equal(document.getElementsByClassName('mq-popup-portal').length, 1);
        assert.equal(document.getElementsByClassName('mq-popup-portal')[0].getElementsByTagName('LI').length, 4);


        TestUtils.Simulate.mouseDown(buttonNode);

        // assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(instance, 'mq-dropdown-menu').length, 0);
        assert.equal(document.getElementsByClassName('mq-popup-portal').length, 0);

    });

});
