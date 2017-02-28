/**
 * Created by yixi on 3/30/16.
 */
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import domHelper from './_helper';

export default class dropdown extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        data: PropTypes.array,
        onChange: PropTypes.func,
        defaultValue: PropTypes.any,
        btnClass: PropTypes.string,
        multi: PropTypes.bool,
        children: PropTypes.node
    };

    static defaultProps = {
        placeholder: '请选择',
        data: [],
        onChange: () => null
    };

    buildData(data, defaultValue = []) {

        defaultValue.forEach((d) => {
            if (!d.value) d.value = d.label;
        });

        let _d = defaultValue.map((d) => d.value);

        let newData = _.cloneDeep(data).map((d) => {
            if (!d.value) d.value = d.label;
            d.checked = _d.indexOf(d.value) > -1;
            return d;
        });

        return newData;
    }

    constructor (props) {
        super(props);

        let defaultValue = props.defaultValue;
        if (defaultValue && !defaultValue.value) {
            defaultValue.value = defaultValue.label;
        }

        let data = this.buildData(_.cloneDeep(props.data), (props.multi ? defaultValue: []));

        this.state = {
            isShow: false,
            selected: defaultValue || {
                label: props.placeholder,
                value: ''
            },
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
        let selected = {
            value: menu.value,
            label: menu.label
        };
        this.props.onChange(selected);
        this.setState({selected, isShow: false});
    }

    checkedOption(menu) {
        menu.checked = !menu.checked;   //利用对象引用改变值, 层级使用方便, 但感觉会玩脱
        this.setState({data: this.state.data});
    }

    multiSetValue() {
        let selected = this.state.data.filter((d) => d.checked);
        this.props.onChange(selected.map((s) => {return {value: s.value, label: s.label}}));
        if (selected.length === 0) {
            selected = {
                label: this.props.placeholder,
                value: ''
            }
        }
        this.setState({
            selected,
            isShow: false
        })
    }

    renderOption(menu, index) {

        if (this.props.multi) {
            return (
                <li key={index}>
                    <a onMouseDown={this.checkedOption.bind(this, menu)}>
                        <input type="checkbox" checked={menu.checked} readOnly/>
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

    _buildMenu() {

        let menuSegment = this.state.data.map((menu, index) => {
            return this.renderOption(menu, index);
        });

        if (this.props.multi) {
            return (
                <div className="mq-dropdown-menu mq-dropdown-multi">
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
            <div className="mq-dropdown-menu">
                <ul>
                    {menuSegment}
                </ul>
            </div>
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
        // setTimeout(() => {
            this.setState({
                isShow: !this.state.isShow
            });
        // }, 50);
    }

    renderMenu() {
        let offset = domHelper.getOffset(this.refs['mq-dropdown']);

        if (!this.menu) {
            this.menu = document.createElement('div');
            document.body.appendChild(this.menu);
            this.menu.className = 'mq-popup-portal'
        }

        let style = {
            position: 'absolute',
            top: offset.top + 10,
            left: offset.left + 10
        };

        ReactDOM.render(<div style={style}>{this._buildMenu()}</div>, this.menu);
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

        if (this.props.multi) {
            icon = 'icon-filter-down'
        }

        let showText = Array.isArray(this.state.selected)
            ? this.state.selected.map((l) => l.label).join(',')
            : this.state.selected.label;

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
