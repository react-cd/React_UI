/**
 *  一个高阶函数，用于装饰组件给组件提供 confirm 方法。
 *  @popconfirm()
 *  class Component {
 *  	handleConfirm(e) {
 *  		this.confirm({
 *  			content: '确认删除',
 *  			target: e.srcElement,
 *  			position: ['left', 'right', 'top', 'bottom'],
 *  			onConfirm: () => console.log('confirm'),
 *  			onCancel: () => console.log('cancel')
 *  		})
 *  	}
 *  }
 */
import React from 'react';
import ReactDOM from 'react-dom';

import Popconfirm from './index';

const popconfirm = () => (ComposedComponent) => {
    const confirm = ({
        content,
        target,
        position,
        onConfirm,
        onCancel
    }) => {
        const Ele = React.createElement(Popconfirm, {
            content,
            target,
            position,
            onConfirm,
            onCancel
        });
        const container = document.createElement('div');
        document.body.appendChild(container);
        let instance = ReactDOM.render(Ele, container);
        instance.setContainer(container);
        instance.show();
    }
    if (!ComposedComponent.prototype.confirm) {
        ComposedComponent.prototype.confirm = confirm;
    }
    return ComposedComponent;
}

export default popconfirm;
