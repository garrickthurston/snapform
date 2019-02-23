import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';
import { updateProject, gClicked, updateProjectItems } from '../../config/redux/redux.actions';

import '../../../assets/style/components/item/item.scss';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
    return {
        updateProject: payload => dispatch(updateProject(payload)),
        gClicked: payload => dispatch(gClicked(payload)),
        updateProjectItems: payload => dispatch(updateProjectItems(payload))
    };
};

const defaultItemContainerClassName = 'item-container';

class ItemComponent extends Component {
    constructor(props) {
        super(props);
        
        const { workspace } = store.getState();
        const project = workspace.project;

        this.state = {
            container: this.props.container.getBoundingClientRect(),
            defaultWidth: project.cellWidth,
            defaultHeight: project.cellHeight,
            info: project.items[this.props.uid],
            itemContainerClassName: defaultItemContainerClassName
        };

        this.handleItemContainerClick = this.handleItemContainerClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.drag = this.drag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleOutsideClick, false);
    }

    componentDidMount() {
        this.dragImg = new Image(0,0);
        this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
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

    handleItemContainerClick() {
        this.setState(Object.assign({}, this.state, {
            itemContainerClassName: defaultItemContainerClassName + ' focus'
        }));

        const { workspace } = store.getState();
        var items = workspace.project.items;

        const current_z = items[this.props.uid].z;
        var top_z = current_z;
        for (var key in items) {
            if (key !== this.props.uid && items[key].z > current_z) {
                if (items[key].z > top_z) {
                    top_z = items[key].z;
                }
                items[key].z -= 1;
            }
        }
        items[this.props.uid].z = top_z;

        this.props.updateProjectItems(items);
    }

    handleDragStart(e) {
        this.handleItemContainerClick();

        this.props.gClicked({
            gClassList: 'gid hidden'
        });

        e.dataTransfer.setDragImage(this.dragImg, 0, 0);
    }

    handleDrag(e) {
        this.drag(e);
    }

    handleDragEnd(e) {
        this.drag(e);

        this.props.gClicked({
            gClassList: 'gid'
        });
    }

    drag(e) {
        const x = Math.floor((e.clientX - this.state.container.left) / this.state.defaultWidth) * this.state.defaultWidth;
        const y = Math.floor((e.clientY - this.state.container.top) / this.state.defaultHeight) * this.state.defaultHeight;
        var left = x > 0 ? x : 0;
        var top = y > 0 ? y : 0;

        const rect = this.item.getBoundingClientRect();
        const itemOffsetLeft = left + rect.width;
        const itemOffsetTop = top + rect.height;

        if (itemOffsetLeft > this.state.container.width) {
            left = Math.floor((this.state.container.width - rect.width) / this.state.defaultWidth) * this.state.defaultWidth;
        }

        if (itemOffsetTop > this.state.container.height) {
            top = Math.floor((this.state.container.height - rect.height) / this.state.defaultHeight) * this.state.defaultHeight;
        }

        const info = Object.assign({}, this.state.info, {
            x: left,
            y: top
        });

        this.props.updateProject({
            path: this.props.uid,
            value: info
        });

        this.setState(Object.assign({}, this.state, {
            info
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
                draggable={true}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragEnd={this.handleDragEnd}
                style={{ 
                    top: this.props.y, 
                    left: this.props.x,
                    width: this.props.width,
                    height: this.props.height,
                    zIndex: this.props.z + 100
                }
            }>
                {tag}
            </div>
        );
    }
}

const Item = connect(mapStateToProps, mapDispatchToProps)(ItemComponent);
export default Item;