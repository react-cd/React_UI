/**
 * Created by yixi on 6/27/16.
 */
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import domHelper from './_helper';

export default class select extends Component {

    static propTypes = {
        placeholder: PropTypes.string,
        data: PropTypes.array,
        defaultValue: PropTypes.any,
        value: PropTypes.any,
        onChange: PropTypes.func,
        btnClass: PropTypes.string,
        multi: PropTypes.bool,
        children: PropTypes.any,
        position: PropTypes.string,
        cls: PropTypes.string,
    };

    static defaultProps = {
        placeholder: '请选择',
        position: 'bottom',
        data: [],
        onChange: () => null,
        select: null,
        cls: ''
    };

    buildData(orignalData, select, isMulti) {
        /*建立值hash*/
        let data = _.cloneDeep(orignalData);
        this.dataHash = {};
        let loop = (_data, _p) => {
            _data.forEach(d => {
                d.checked = select && select.indexOf ? select.indexOf(d.value) > -1 : false;
                d.parent = _p;
                this.dataHash[d.value] = d;
                if (d.children) {
                    loop(d.children, d);
                }
            });
        };

        loop(data, null);

        if (isMulti) {
            this.buildInitCheck(data, select);
        }

        return data;
    }


    buildInitCheck(data) {
        let loop = _data => {
            _data.forEach(_d => {
                if (_d.checked) {
                    this.checkAllChildren(_d, true);
                } else {
                    if (_d.children) {
                        loop(_d.children);
                    }
                }
            });
        };

        loop(data);
    }

    checkAllChildren(data, checked) {
        console.log(data);
        let loop = _data => {
            _data.forEach(_d => {
                _d.checked = !!checked;
                if (_d.children) {
                    loop(_d.children);
                }
            });
        };

        if (data.children) {
            loop(data.children);
        }
    }

    constructor(props) {
        super(props);

        let data = this.buildData(props.data, props.defaultValue, props.multi);

        this.state = {
            show: false,
            data: data,
            cursor: [],
            select: props.defaultValue
        }
    }

    componentDidMount() {
        this.mounted = true;
        document.addEventListener('mousedown', ::this.handleDocumentClick, false);
    }

    componentDidUpdate() {
        if (this.state.show) {
            this._renderMenu();
        } else {
            this._unrenderMenu();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.setState({select: nextProps.value});
        }

        if (nextProps.data) {
            let data = this.buildData(nextProps.data, nextProps.value, nextProps.multi);
            this.setState({data});
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        document.removeEventListener('mousedown', ::this.handleDocumentClick, false);
    }

    handleDocumentClick(evt) {
        if (this.mounted) {
            if (!ReactDOM.findDOMNode(this).contains(evt.target) && (this.menu && !this.menu.contains(evt.target))) {
                this.setState({show: false});
            }
        }
    }

    handleMouseDown(evt) {
        if (evt.type === 'mousedown' && evt.button !== 0) {
            return;
        }
        evt.stopPropagation();
        evt.preventDefault();
        this.setState({
            show: !this.state.show
        });
    }

    setValue(menu) {
        this.setState({
            select: menu.value,
            show: false
        });
        this.props.onChange(menu.value);
    }

    multiSetValueDone() {
        let data = this.state.data;
        let value = [];

        //建立最终的值
        let loop = _data => {
            _data.forEach(_d => {
                if (_d.checked) {
                    if (_d.value !== undefined) {
                        //这里做一个 如果 gruop 有 value 的话, 就直接返回 group 的value 就不向下查找了。
                        value.push(_d.value);
                    } else if (_d.children) {
                        loop(_d.children);
                    }
                } else {
                    if (_d.children) {
                        loop(_d.children);
                    }
                }
            });
        };

        loop(data);

        this.setState({
            select: value,
            show: false
        });

        this.props.onChange(value);

    }

    onMenuOver(value, cursorIndex) {
        let cursor = this.state.cursor;
        cursor = cursor.slice(0, cursorIndex + 1);
        cursor[cursorIndex] = value;
        this.setState({cursor});
    }

    multiSetValue(menu) {
        console.log(menu);
        menu.checked = !menu.checked;

        this.checkAllChildren(menu, menu.checked);  //向下check
        this.checkParent(menu); //向上查找

        this.setState({data: this.state.data});
    }

    checkParent(menu) {
        let loop = _menu => {
            _menu.checked = _menu.children.every(m => m.checked);

            let inputEle = this.menu.querySelector(`input[name="${_menu.value}"]`);
            if (inputEle) {
                inputEle.indeterminate = false;
            }

            if (!_menu.checked && _menu.children.some(m => m.checked) && inputEle) {
                //set indeterminate;
                inputEle.indeterminate = true;
            }

            if (_menu.parent) {
                loop(_menu.parent);
            }
        };

        if (menu.parent) {
            loop(menu.parent);
        }
    }

    _buildMenu(array, cursorIndex) {
        let menuSegment = array.map((menu, index) => {
            if (this.props.multi) {
                return (
                    <li key={menu.value}>
                        <a onMouseOver={this.onMenuOver.bind(this, index, cursorIndex)}
                           onMouseDown={this.multiSetValue.bind(this, menu)}>
                            <input type="checkbox" readOnly checked={menu.checked} name={menu.value}/>
                            {menu.name}
                            {menu.children ? <i className="icon-15 icon-right nest-menu-icon" /> : ''}
                        </a>
                    </li>
                );
            }

            return (
                <li key={menu.value}>
                    <a onMouseOver={this.onMenuOver.bind(this, index, cursorIndex)}
                       onMouseDown={this.setValue.bind(this, menu)}>
                        {menu.name}
                        {menu.children ? <i className="icon-15 icon-right nest-menu-icon" /> : ''}
                    </a>
                </li>
            )
        });


        if (this.props.multi && cursorIndex === 0) {
            return (
                <div className="mq-dropdown-menu mq-dropdown-multi">
                    <ul className="mq-dropdown-menu-root">
                        {menuSegment}
                    </ul>
                    <div className="mq-dropdown-action">
                        <button className="mq-btn btn-block" onClick={::this.multiSetValueDone}>选好了</button>
                    </div>
                </div>
            )
        }

        return (
            <div className={`mq-dropdown-menu${this.props.multi ? ' mq-dropdown-multi' : ''}`}>
                <ul>
                    {menuSegment}
                </ul>
            </div>
        )

    }

    _renderMenu() {
        let offset = domHelper.getOffset(this.refs['mq-select']);

        if (!this.menu) {
            this.menu = document.createElement('div');
            document.body.appendChild(this.menu);
            this.menu.className = `mq-popup-portal ${this.props.cls}`;
        }

        let rootStyle = {
            position: 'absolute',
            // top: offset.top + 10,
            left: offset.left + 10
        };

        if (this.props.position === 'bottom') {
            rootStyle.top = offset.top + 10;
        } else {
            rootStyle.visibility = 'hidden';
        }


        let menu = [<div style={rootStyle} key="root" className="mq-dropdown-menu-wrapper">{this._buildMenu(this.state.data, 0)}</div>];

        let cursor = this.state.cursor;
        let i = 0;
        let recursiveData = (lastData) => {
            let currentData = lastData[cursor[i]].children;
            if (currentData) {
                menu.push(
                    <div key={i} className="mq-dropdown-menu-wrapper" style={{visibility: 'hidden'}}>{this._buildMenu(currentData, i + 1)}</div>
                );

                if (cursor[++i]) {
                    recursiveData(currentData);
                }
            }
        };

        if(cursor[0] !== undefined) {
            recursiveData(this.state.data);
        }

        ReactDOM.render(<div>{menu}</div>, this.menu);

        setTimeout(::this._setMenuOffset, 100);
    }

    _setMenuOffset() {
        let cursor = this.state.cursor;
        let i = 0;

        let rootMenu = this.menu.querySelectorAll('.mq-dropdown-menu-wrapper')[0];
        if (rootMenu && this.props.position === 'top') {
            let selectOffset = domHelper.getOffset(this.refs['mq-select']);
            let menuOffset = domHelper.getOffset(rootMenu);

            rootMenu.style.top = (selectOffset.top - menuOffset.height + 20) + 'px';
            rootMenu.style.visibility = '';
        }


        let recursiveOffset = (element) => {
            let selectElement = element.querySelectorAll('li')[cursor[i]];
            let nextElement = this.menu.querySelectorAll('.mq-dropdown-menu-wrapper')[i + 1];

            if(selectElement && nextElement) {
                let offset = domHelper.getOffset(selectElement);

                nextElement.style.position = 'absolute';
                nextElement.style.top = offset.top + 'px';
                nextElement.style.left = (offset.width + offset.left - 10) + 'px';
                nextElement.style.visibility = '';
            }

            if (cursor[++i]) {
                recursiveOffset(nextElement);
            }

        };

        if (cursor[0] !== undefined && this.menu) {
            recursiveOffset(this.menu.querySelector('.mq-dropdown-menu-wrapper'))
        }

        this._setIndeterminate();
    }

    _setIndeterminate() {

        let loop = _data => {
            _data.forEach(_d => {
                 if (!_d.checked && _d.children && _d.children.some(m => m.checked)) {
                     let inputEle = this.menu.querySelector(`input[name="${_d.value}"]`);
                     if (inputEle) {
                         inputEle.indeterminate = true;
                     }
                 }
            });
        };

        if (this.props.multi) {
            let data = this.state.data;
            loop(data);
        }
    }

    _unrenderMenu() {
        if (this.menu) {
            ReactDOM.unmountComponentAtNode(this.menu);
            document.body.removeChild(this.menu);
            this.menu = null;
            this.setState({cursor: []});
        }
    }

    render() {

        let dropDownClass = 'mq-dropdown';
        if (/btn-block/.test(this.props.btnClass)) {
            dropDownClass = 'mq-dropdown dropdown-block';
        }

        let icon = 'icon-dropdown';

        let showText;
        if (this.state.select) {

             showText = _.isArray(this.state.select)
                ? this.state.select.map(s => this.dataHash[s] ? this.dataHash[s].name : '').join(',') || this.props.placeholder
                : (this.dataHash[this.state.select] ? this.dataHash[this.state.select].name : null) || this.props.placeholder;
        } else {
            showText = this.props.placeholder;
        }

        let buttonClass = `mq-btn mq-btn-dropdown-button ${this.props.btnClass} ${this.state.select ? '' : 'empty'}`;


        return (
            <div className={dropDownClass} ref="mq-select">
                {this.props.children ? React.cloneElement(this.props.children, {onMouseDown: (::this.handleMouseDown)}) :
                <button className={buttonClass} onMouseDown={::this.handleMouseDown}>
                    {showText}
                    <i className={`icon-15 ${icon} icon-dropdown-button`} />
                </button> }
            </div>
        );
    }
}
