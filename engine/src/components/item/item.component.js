import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';

import '../../../assets/style/components/item/item.scss';

const mapStateToProps = (state) => state;

const defaultItemContainerClassName = 'item-container';

class ItemComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemContainerClassName: defaultItemContainerClassName
        };

        this.handleItemContainerClick = this.handleItemContainerClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleOutsideClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick, false);
    }

    handleOutsideClick(e) {
        if (this.item.contains(e.target)) {
            return;
        }

        this.setState(Object.assign({}, this.state, {
            itemContainerClassName: defaultItemContainerClassName
        }));
    }

    handleItemContainerClick(e) {
        this.setState(Object.assign({}, this.state, {
            itemContainerClassName: defaultItemContainerClassName + ' focus'
        }));
    }

    render() {
        const { itemContainerClassName } = this.state;
        const TagName = `${this.props.tag.name}`;

        var tag = null;
        if (this.props.tag.innerValue) {
            tag = (<TagName>{this.props.tag.value}</TagName>)
        } else {
            tag = (<TagName value={this.props.tag.value}></TagName>)
        }
        

        return (
            <div className={itemContainerClassName}
                ref={item => this.item = item}
                onClick={this.handleItemContainerClick}
                style={{ 
                    top: this.props.y, 
                    left: this.props.x,
                    width: this.props.width,
                    height: this.props.height
                }
            }>
                {tag}
            </div>
        );
    }
}

const Item = connect(mapStateToProps)(ItemComponent);
export default Item;