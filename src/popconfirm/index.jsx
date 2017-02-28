import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import domHelper from '../_helper';


export default class Popconfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            top: 0,
            left: 0
        };
    }
    componentDidMount() {
        const handleDocumentClick = (e) => {
            if (!ReactDOM.findDOMNode(this.refs.root).contains(e.target)) {
                apply(this, this.props.onCancel, this.close);
                return;
            }
        }
        this.handleDocumentClick = handleDocumentClick.bind(this);
        document.addEventListener('mousedown', this.handleDocumentClick, false)
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleDocumentClick, false);
    }
    setContainer(container) {
        this.container = container;
    }
    close() {
        if (this.container) {
            ReactDOM.unmountComponentAtNode(this.container);
            document.body.removeChild(this.container);
            this.container = null;
        }
    }
    show() {
        const {target, position} = this.props;
        const offset = domHelper.getOffset(target);
        const ele = ReactDOM.findDOMNode(this.refs.root);
        const eleOffset = domHelper.getOffset(ele);
        if (offset && eleOffset) {
            const {top, left} = this.state;
            const {_top, _left} = getOffset(offset, eleOffset, position);
            if (top !== _top || left !== _left) {
                this.setState({
                    left: _left,
                    top: _top
                });
            }
        }
    }
    getPosition() {
        return {
            left: this.state.left + 'px',
            top: this.state.top + 'px'
        };
    }
    render() {
        const {content} = this.props;
        return (
            <div style={this.getPosition()} ref="root" className="mq-popconfirm">
                <div>{content}</div>
                <div>
                    <button onClick={() => apply(this, this.props.onConfirm, this.close)} className="mq-btn mq-btn-danger">确认</button>
                    <button onClick={() => apply(this, this.props.onCancel, this.close)} className="mq-btn mq-btn-gray">取消</button>
                </div>
            </div>
        )
    }
}

Popconfirm.propTypes = {
    content: PropTypes.string.isRequired,
    target: PropTypes.object,
    position: PropTypes.oneOf(['top', 'left', 'right', 'bottom']),
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func
};

Popconfirm.defaultProps = {
    content: '',
    show: false,
    position: 'left'
};

/**
 * offset: 定位元素的 offset
 * eleOffset: 弹出框元素的 offset
 */
const getOffset = (offset, eleOffset, position) => {
    let _left = 0;
    let _top = 0;
    if (position === 'right') {
        _top = offset.top + offset.height / 2 - eleOffset.height / 2;
        _left = offset.left + offset.width + 10;
    }
    if (position === 'left') {
        _top = offset.top + offset.height / 2 - eleOffset.height / 2;
        _left = offset.left - eleOffset.width - 10;
    }
    if (position === 'top') {
        _top = offset.top - eleOffset.height - 10;
        _left = offset.left + offset.width / 2 - eleOffset.width / 2;
    }
    if (position === 'bottom') {
        _top = offset.top + offset.height + 10;
        _left = offset.left + offset.width / 2 - eleOffset.width / 2;
    }
    return fixedOffset({_left, _top, eleOffset});
};

const fixedOffset = ({_left, _top, eleOffset}) => {
    const body = document.documentElement || document.body;
    const bodyRect = body.getBoundingClientRect();
    const [maxWidth, maxHeight] = [bodyRect.width + body.scrollLeft, bodyRect.height + body.scrollTop];
    //修复离左边最少 10 个像素
    _left = min(10 + body.scrollLeft)(_left);
    //修复离上面最少 10 个像素
    _top = min(10 + body.scrollTop)(_top);

    // 修复离右边最少 10 个像素
    if (_left + eleOffset.width > maxWidth) {
        _left = maxWidth - eleOffset.width - 10;
    }
    // 修复离底部最少 10 个像素
    if (_top + eleOffset.height > maxHeight) {
        _top = maxHeight - eleOffset.height - 10;
    }
    return {
        _left,
        _top
    };
}

const min = min => num => num < min ? min : num;


const apply = (content, ...funcs) => {
    for (const func of funcs) {
        if (func && typeof func === 'function') {
            func.call(content);
        }
    }
}
