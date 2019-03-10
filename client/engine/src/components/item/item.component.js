import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../../config/redux/redux.store';
import { updateProject, updateProjectItems, updateProjectConfig } from '../../config/redux/redux.actions';

import '../../../assets/style/components/item/item.scss';

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
    return {
        updateProject: payload => dispatch(updateProject(payload)),
        updateProjectItems: payload => dispatch(updateProjectItems(payload)),
        updateProjectConfig: payload => dispatch(updateProjectConfig(payload))
    };
};

const defaultItemContainerClassName = 'item-container';

class ItemComponent extends Component {
    dragging = false;
    dragOffsetX = 0;
    dragOffsetY = 0;
    defaultTagClassName = 'g-border-color';

    constructor(props) {
        super(props);

        const { workspace } = store.getState();
        const project = workspace.project;

        this.handleReadOnlyValueChanged = this.handleReadOnlyValueChanged.bind(this);
        this.handleItemContainerClick = this.handleItemContainerClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.drag = this.drag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.removeItem = this.removeItem.bind(this);

        this.state = {
            info: project.items[this.props.uid],
            itemContainerClassName: defaultItemContainerClassName,
            readOnlyValue: ''
        };
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleOutsideClick, false);
        document.addEventListener('mousemove', this.mousemove, false);
        document.addEventListener('keydown', this.handleKeyDown, false);
    }

    componentDidMount() {
        this.dragImg = new Image(0,0);
        this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick, false);
        document.removeEventListener('mousemove', this.mousemouve, false);
        document.removeEventListener('keydown', this.handleKeyDown, false);
    }

    handleReadOnlyValueChanged(e) {
        this.setState(Object.assign({}, this.state, {
            readOnlyValue: e.target.value
        }));
    }

    handleOutsideClick(e) {
        if (this.item.contains(e.target)) {
            return;
        }

        this.setState(Object.assign({}, this.state, {
            hasFocus: false,
            itemContainerClassName: defaultItemContainerClassName
        }));
    }

    handleItemContainerClick() {
        this.setState(Object.assign({}, this.state, {
            hasFocus: true,
            itemContainerClassName: defaultItemContainerClassName + ' focus'
        }));

        const { workspace } = store.getState();
        var items = workspace.project.items;

        if (items[this.props.uid]) {
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
    }

    handleDragStart(e) {
        this.handleItemContainerClick();

        e.dataTransfer.setDragImage(this.dragImg, 0, 0);
        e.target.style.cursor = 'move';

        const { workspace } = store.getState();
        const container = workspace.project.container.getBoundingClientRect();
        const item = workspace.project.items[this.props.uid];

        this.dragging = true;
        this.dragOffsetX = item.x - (e.clientX - container.left);
        this.dragOffsetY = item.y - (e.clientY - container.top);

        this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
            ui: Object.assign({}, workspace.project.config.ui, {
                g_class_list: 'gid hidden'
            })
        }));
    }

    handleDrag(e) {
        this.drag(e);
    }

    async handleDragEnd(e) {
        var info = this.drag(e);
        const { workspace } = store.getState();

        this.dragging = false;

        this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
            ui: Object.assign({}, workspace.project.config.ui, {
                g_class_list: 'gid'
            })
        }));

        this.props.updateProject({
            path: this.props.uid,
            value: info
        });

        this.item.dispatchEvent(new CustomEvent('sf.workspace.project.update', {
            bubbles: true,
            detail: { 
                workspace_id: workspace.id,
                project: workspace.project 
            }
        }));
    }

    drag(e) {
        const { workspace } = store.getState();
        const container = workspace.project.container.getBoundingClientRect();
        const defaultWidth = workspace.project.config.cellWidth;
        const defaultHeight = workspace.project.config.cellHeight;

        const x = Math.floor((e.clientX - (container.left - this.dragOffsetX)) / defaultWidth) * defaultWidth;
        const y = Math.floor((e.clientY - (container.top - this.dragOffsetY)) / defaultHeight) * defaultHeight;
        
        var left = x > 0 ? x : 0;
        var top = y > 0 ? y : 0;

        const rect = this.item.getBoundingClientRect();
        const itemOffsetLeft = left + rect.width;
        const itemOffsetTop = top + rect.height;

        if (itemOffsetLeft > container.width) {
            left = Math.floor((container.width - rect.width) / defaultWidth) * defaultWidth;
        }

        if (itemOffsetTop > container.height) {
            top = Math.floor((container.height - rect.height) / defaultHeight) * defaultHeight;
        }

        const info = Object.assign({}, this.state.info, {
            x: left,
            y: top
        });

        this.setState(Object.assign({}, this.state, {
            info
        }));
        
        return info;
    }

    mousemove(e) {
        if (this.dragging) {
            e.target.style.cursor = 'move';
        }
    }

    async handleKeyDown(e) {
        if (!this.state.hasFocus) {
            return;
        }

        const rect = this.item.getBoundingClientRect();
        const { workspace } = store.getState();
        const container = workspace.project.container.getBoundingClientRect();
        var info = this.state.info;

        var save = false;
        var x, y;
        switch (e.keyCode) {
            case 37: // left
                e.preventDefault();
                x = info.x - workspace.project.config.cellWidth;
                if (x >= 0) {
                    info.x = x;
                    save = true;
                }
                break;
            case 38: // up
                e.preventDefault();
                y = info.y - workspace.project.config.cellHeight;
                if (y >= 0) {
                    info.y = y;
                    save = true;
                }
                break;
            case 39: // right
                e.preventDefault();
                x = info.x + workspace.project.config.cellWidth;
                if ((x + rect.width) <= container.width) {
                    info.x = x;
                    save = true;
                }
                break;
            case 40: // down
                e.preventDefault();
                y = info.y + workspace.project.config.cellHeight;
                if ((y + rect.height) <= container.height) {
                    info.y = y;
                    save = true;
                }
                break;
            default:
                return;
        }

        if (save) {
            this.setState(Object.assign({}, this.state, {
                info
            }));

            this.props.updateProject({
                path: this.props.uid,
                value: info
            });

            const updated_workspace = store.getState().workspace;
            this.item.dispatchEvent(new CustomEvent('sf.workspace.project.update', {
                bubbles: true,
                detail: { 
                    workspace_id: updated_workspace.id,
                    project: updated_workspace.project 
                }
            }));
        }
    }

    handleMouseEnter() {
        this.setState(Object.assign({}, this.state, {
            hover: true
        }));
    }

    handleMouseLeave() {
        this.setState(Object.assign({}, this.state, {
            hover: false
        }));
    }

    async removeItem(e) {
        e.preventDefault();
        e.stopPropagation();

        var { workspace } = store.getState();
        var project = workspace.project;
        var items = project.items;

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

        delete items[this.props.uid];

        this.props.updateProjectItems(items);

        const updated_workspace = store.getState().workspace;
        this.item.dispatchEvent(new CustomEvent('sf.workspace.project.update', {
            bubbles: true,
            detail: { 
                workspace_id: updated_workspace.id,
                project: updated_workspace.project 
            }
        }));
    }

    render() {
        const { itemContainerClassName, info, hover, hasFocus } = this.state;

        const TagName = this.props.tag.name;
        var tag = null;
        if (this.props.tag.innerValue) {
            tag = (<TagName>{this.props.tag.value}</TagName>);
        } else {
            var tagClassName = this.defaultTagClassName + (this.state.readOnlyValue && this.state.readOnlyValue.length ? ' g-valid' : '');
            tag = (<div className="input-component">
                        <TagName className={tagClassName} type="text" name={this.props.tag.value.toLowerCase().replace(' ', '_')} 
                            value={this.state.readOnlyValue} onChange={this.handleReadOnlyValueChanged}></TagName>
                        <span className="g-login-form-input-placeholder">{this.props.tag.value}</span>
                    </div>);
        }

        return (
            <div 
                className={itemContainerClassName}
                ref={item => this.item = item}
                onClick={this.handleItemContainerClick}
                draggable={true}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragEnd={this.handleDragEnd}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                style={{ 
                    top: info.y, 
                    left: info.x,
                    width: info.width,
                    height: info.height,
                    zIndex: info.z + 100
                }}>
                {tag}
                {hover || hasFocus ?
                <div className="item-actions">
                    <div className="close-icon-item shadow-none" onClick={this.removeItem}>
                        <span className="close-icon"></span>
                    </div>
                </div>
                : null}
            </div>
        );
    }
}

const Item = connect(mapStateToProps, mapDispatchToProps)(ItemComponent);
export default Item;