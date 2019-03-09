import React, { Component } from 'react';
import { store } from '../config/redux/redux.store';
import { connect } from 'react-redux';
import { updateProjectConfig } from '../config/redux/redux.actions';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        updateProjectConfig: payload => dispatch(updateProjectConfig(payload))
    };
}

class GComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        const { workspace } = store.getState();
        const project = workspace.project;

        var x = Math.floor(e.nativeEvent.offsetX / project.config.cellWidth) * project.config.cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / project.config.cellHeight) * project.config.cellHeight;
        var cellTransform = 'translate(' + x + ',' + y + ')';

        const left = x + (project.config.cellWidth / 2);
        const top = y + (project.config.cellHeight / 2);

        this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
            ui: Object.assign({}, workspace.project.ui, {
                cellTransform,
                current_x: x,
                current_y: y,
                g_class_list: 'gid clicked',
                add: {
                    component: {
                        top,
                        left
                    }
                }
            })
        }));
    }

    render() {
        const { workspace } = store.getState();
        const project = workspace.project;
        
        return (
            <g ref={el => this.el = el} className={project.config.ui.g_class_list} transform={project.config.ui.cellTransform} onClick={this.handleClick}>
                <rect className="hover-rect" width={project.config.cellWidth} height={project.config.cellHeight} /> 
            </g>
        );
    }
}

const G = connect(mapStateToProps, mapDispatchToProps)(GComponent);

export default G;