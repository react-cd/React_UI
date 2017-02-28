/**
 * created by linsong 4/14/2016
 * 多级选择菜单
 * 大家暂时先别用这个组件，这个组件还有很多问题，先暂时把结构放到这里，公台引入要赶紧给销售卖1000个坐席的大单来用，临时用，千万别引到其他地方用，坑了你们别来找我.
 * 目前存在的问题：
 * · 只支持多选
 * · 菜单不能设置最大高度，所以有滚动问题
 * · 菜单只支持两级
 * · 等等等。。。
 */
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import domHelper from './_helper';

export default class stageDropdown extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        data: PropTypes.array,
        value: PropTypes.object,
        onChange: PropTypes.func,
        defaultValue: PropTypes.object,
        btnClass: PropTypes.string,
        multi: PropTypes.bool,
        children: PropTypes.node
    };

    // defaultValue and selected
    // {
    //     100: [1 , 2, 3, 4]
    // }
    static defaultProps = {
        placeholder: '请选择',
        data: [],
        defaultValue: {},
        onChange: () => null
    };

    buildData(data, selected = {}) {
        let newData = _.cloneDeep(data).map((d) => {
            if (!selected[d.value]) {
                d.status = 'unChecked';
                d.children.forEach((c) => {
                    c.status = 'unChecked';
                });
            } else {
                let allChecked = true;
                let atLeastOne = false;
                d.children.forEach((c) => {
                    if (selected[d.value].indexOf(c.value) >= 0) {
                        atLeastOne = true;
                        c.status = 'checked';
                    } else {
                        c.status = 'unChecked';
                        allChecked = false;
                    }
                });
                if (atLeastOne) {
                    if (allChecked) {
                        d.status = 'checked';
                    } else {
                        d.status = 'someChecked';
                    }
                } else {
                    // 一个都没有的话状态就为未选中
                    d.status = 'unChecked';
                }
            }
            return d;
        });

        return newData;
    }

    constructor (props) {
        super(props);

        let defaultValue = props.value || props.defaultValue;

        let data = this.buildData(_.cloneDeep(props.data), (props.multi ? defaultValue: {}));
        this.state = {
            isShow: false,
            selected: defaultValue,
            data: data
        };

        this.mounted = true;

    }

    componentWillReceiveProps(newProps){
        //TODO-yixi: 待组件完成后面的层级问题后再来组织这里重新赋值的逻辑
        if ((this.props.multi || newProps.multi)) {
            if (newProps.value) {
                let data = this.buildData(newProps.data, newProps.value);
                this.setState({data, selected: newProps.value});
            }
        } else {
            if (newProps.value && newProps.value.value !== this.state.selected.value) {
                let data = this.buildData(newProps.data);
                let value = newProps.value;
                if (!_.isObject(value)) {
                    value = _.find(data, {value: value});
                }
                this.setState({data, selected: value});
            } else if (newProps.data) {
                let data = this.buildData(newProps.data);
                this.setState({data});
            }
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', ::this.handleDocumentClick, false);
    }

    componentDidUpdate() {
        if (this.state.isShow) {
            this.renderMenu();
        } else {
            this.unrenderMenu();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        document.removeEventListener('mousedown', ::this.handleDocumentClick, false);
    }

    setValue(menu) {
        return menu;
        // 单选的形式还未实现
        // let selected = {
        //     value: menu.value,
        //     label: menu.label
        // };
        // this.props.onChange(selected);
        // this.setState({selected, isShow: false});
    }

    topMenuSelect(menu) {
        let data = this.state.data;
        if (menu.status === 'checked' || menu.status === 'someChecked') {
            data.forEach((d) => {
                if (d.value === menu.value) {
                    d.status = 'unChecked';
                    d.children.forEach((c) => c.status = 'unChecked');
                }
            });
        } else {
            data.forEach((d) => {
                if (d.value === menu.value) {
                    d.status = 'checked';
                    d.children.forEach((c) => c.status = 'checked');
                }
            });
        }
        this.setState({data});
    }

    subMenuSelect(menu, parent) {
        let data = this.state.data;
        let parentMenu = data.find((d) => d.value === parent.value);
        let subMenu = parentMenu.children.find((c) => c.value === menu.value);

        if (menu.status === 'checked') {
            subMenu.status = 'unChecked';
            // 父菜单之前的状态为全选，先清除掉全选状态
            if (parentMenu.status === 'checked') {
                parentMenu.status = 'someChecked';
            }
            // 检查是否所有的选中状态已经被清理掉 not cheked
            if (!parentMenu.children.find((c) => c.status === 'checked')) {
                parentMenu.status = 'unChecked';
            }
        } else {
            subMenu.status = 'checked';
            // 父菜单之前的状态为没有被选中，设置成部分选中
            if (parentMenu.status === 'unChecked') {
                parentMenu.status = 'someChecked';
            }
            // 如果所有被选中，设置成全选状态
            if (!parentMenu.children.find((c) => c.status === 'unChecked')) {
                parentMenu.status = 'checked';
            }
        }
        this.setState({data});
    }

    multiSetValue() {
        let selected = {};
        this.state.data.forEach((d) => {
            if (d.status === 'checked' || d.status === 'someChecked') {
                selected[d.value] = [];
                d.children.forEach((c) => {
                    if (c.status === 'checked') {
                        selected[d.value].push(c.value);
                    }
                });
            }
        });
        this.props.onChange(selected);
        this.setState({
            selected,
            isShow: false
        })
    }

    _renderStatus(menuStatus) {
        let status = <input type="checkbox" checked={false} readOnly/>;
        if (menuStatus === 'someChecked') {
            status = <span className="menu-status">-</span>;
        } else if (menuStatus === 'checked') {
            status = <input type="checkbox" checked={true} readOnly/>
        }
        return status;
    }

    renderOption(menu, index) {
        // 循环渲染 children
        let subMenu = null;
        if (menu.children) {
            subMenu = this._buildSubMenu(menu);
        }
        if (this.props.multi) {
            let status = this._renderStatus(menu.status);
            return (
                <li key={index}>
                    <a onMouseDown={this.topMenuSelect.bind(this, menu)}>
                        {status}
                        {menu.label}
                    </a>
                    {subMenu}
                </li>
            )
        }

        return (
            <li key={index}>
                <a onMouseDown={this.setValue.bind(this, menu)}
                   onClick={this.setValue.bind(this, menu)}>
                    {menu.label}
                </a>
                {subMenu}
            </li>
        )
    }

    _buildMenu(data) {
        let menuSegment = data.map((menu, index) => {
            return this.renderOption(menu, index);
        });

        if (this.props.multi) {
            return (
                <div className="mq-dropdown-menu mq-dropdown-multi meiqia-stage-dropdown-menu">
                    <ul>
                        {menuSegment}
                    </ul>
                    <div className="mq-dropdown-action">
                        <button className="mq-btn btn-block" onClick={::this.multiSetValue}>选好了</button>
                    </div>
                </div>
            )
        }

        return (
            <div className="mq-dropdown-menu meiqia-stage-dropdown-menu">
                <ul>
                    {menuSegment}
                </ul>
            </div>
        );
    }

    _buildSubMenu(parentMenu) {
        let data = parentMenu.children;
        let menuSegment = data.map((menu, index) => {
            return this.renderSubOption(parentMenu, menu, index);
        });

        if (this.props.multi) {
            return (
                <div className="mq-dropdown-menu mq-dropdown-multi meiqia-stage-dropdown-menu">
                    <ul>
                        {menuSegment}
                    </ul>
                </div>
            )
        }

        return (
            <div className="mq-dropdown-menu meiqia-stage-dropdown-menu">
                <ul>
                    {menuSegment}
                </ul>
            </div>
        )
    }

    renderSubOption(parentMenu, menu, index) {
        if (this.props.multi) {
            let status = this._renderStatus(menu.status);
            return (
                <li key={index}>
                    <a onMouseDown={this.subMenuSelect.bind(this, menu, parentMenu)}>
                        {status}
                        {menu.label}
                    </a>
                </li>
            )
        }

        return (
            <li key={index}>
                <a onMouseDown={this.setValue.bind(this, menu)}
                   onClick={this.setValue.bind(this, menu)}>
                    {menu.label}
                </a>
            </li>
        )
    }

    handleDocumentClick(evt) {
        if (this.mounted) {
            if (!ReactDOM.findDOMNode(this).contains(evt.target) && (this.menu && !this.menu.contains(evt.target))) {
                this.setState({isShow: false});
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
            isShow: !this.state.isShow
        });
    }

    renderMenu() {
        let offset = domHelper.getOffset(this.refs['mq-dropdown']);

        if (!this.menu) {
            this.menu = document.createElement('div');
            document.body.appendChild(this.menu);
            this.menu.className = 'mq-popup-portal'
        }

        let style = {
            zIndex: 999999,
            position: 'absolute',
            top: offset.top + 10,
            left: offset.left + 10
        };

        ReactDOM.render(<div style={style}>{this._buildMenu(this.state.data, 'top')}</div>, this.menu);
    }

    unrenderMenu() {
        if (this.menu) {
            ReactDOM.unmountComponentAtNode(this.menu);
            document.body.removeChild(this.menu);
            this.menu = null;
        }
    }


    render() {

        let dropDownClass = 'mq-dropdown';
        if (/btn-block/.test(this.props.btnClass)) {
            dropDownClass = 'mq-dropdown dropdown-block';
        }

        let icon = 'icon-dropdown';
        let showText = this.props.placeholder;

        if (this.props.multi) {
            icon = 'icon-filter-down';
            let texts = [];
            // console.log(JSON.stringify(this.state.selected));
            for (let i in this.state.selected) {
                // 被选中的 data 列表, 第二级的 value 值
                let _sd = this.state.selected[i];
                // 原始的一级数据
                let d = this.state.data.find(_d => _d.value.toString() === i.toString());
                if (d) {
                    _sd.forEach((_sc) => {
                        let c = d.children.find(c => c.value.toString() === _sc.toString());
                        // 找出的第二层数据
                        if (c) {
                            texts.push(c.label);
                        }
                    });
                }
            }
            if (texts.length > 0) {
                showText = texts.join('，');
            }
        }

        let buttonClass = `mq-btn mq-btn-dropdown-button ${this.props.btnClass} ${this.state.selected.value || this.state.selected.length > 0 ? '' : 'empty'}`;

        return (
            <div className={dropDownClass} ref="mq-dropdown">
                {this.props.children ? React.cloneElement(this.props.children, {onMouseDown: (::this.handleMouseDown)}) :
                <button className={buttonClass}
                        onMouseDown={::this.handleMouseDown}>{showText}
                        <i className={`icon-15 ${icon} icon-dropdown-button`} />
                </button>}
            </div>
        );
    }
}
