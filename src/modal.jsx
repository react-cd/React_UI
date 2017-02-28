/**
 * Created by yixi on 4/13/16.
 */
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

export default class Modal extends Component {
    static propTypes = {
        show: PropTypes.bool,
        children: PropTypes.any,
        onClose: PropTypes.func,
        maskClosable: PropTypes.bool
    };

    static defaultProps = {
        onClose: () => null,
        maskClosable: true
    };

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        if (this.props.show) {
            this.renderModal();
        } else {
            this.unrenderModal();
        }
    }

    onMaskClick() {
        if (this.props.maskClosable) {
            this.onClose();
        }
    }

    onClose() {
        this.props.onClose();
    }

    renderModal() {
        if (!this.modal) {
            this.modal = document.createElement('div');
            document.body.appendChild(this.modal);
            this.modal.className = 'mq-modal-portal';
            this.isShow = true;
        }

        ReactDOM.render(
            <div className="mq-modal-wrapper">
                <div className="mq-modal-mask" onClick={::this.onMaskClick}></div>
                <div className="mq-modal-dialog">
                    <div className="mq-modal-close" onClick={::this.onClose}>
                        <i className="icon-15 icon-close" />
                    </div>
                    {this.props.children}
                </div>
            </div>
            , this.modal);

        setTimeout(() => {this.modal.className = 'mq-modal-portal mq-after-open'},50);
    }

    unrenderModal() {
        if (this.modal && this.isShow) {
            this.modal.className = 'mq-modal-portal';
            this.isShow = false;
            setTimeout(() => {
                ReactDOM.unmountComponentAtNode(this.modal);
                document.body.removeChild(this.modal);
                this.modal = null;
            }, 160);
        }
    }

    render() {
        return React.DOM.noscript();
    }
}
