import React, { Component } from 'react';
import { store } from '../../../common/config/redux/redux.store';
import { connect } from 'react-redux';
import { gClicked } from '../config/redux/redux.actions';

import AddComponent from './add/add.component';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        gClicked: payload => dispatch(gClicked(payload))
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
        const { workspace } = store.getState().engineReducer;
        const project = workspace.project;

        var x = Math.floor(e.nativeEvent.offsetX / project.config.cellWidth) * project.config.cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / project.config.cellHeight) * project.config.cellHeight;
        var cellTransform = 'translate(' + x + ',' + y + ')';

        const left = x + (project.config.cellWidth / 2);
        const top = y + (project.config.cellHeight / 2);

        this.props.gClicked({
            cellTransform,
            current_x: x,
            current_y: y,
            addComponent: <AddComponent top={top} left={left} />,
            gClassList: 'gid clicked'
        });
    }

    render() {
        const { workspace } = store.getState().engineReducer;
        const project = workspace.project;
        
        return (
            <g ref={el => this.el = el} className={project.ui.gClassList} transform={this.props.transform} onClick={this.handleClick}>
                <rect className="hover-rect" width={this.props.width} height={this.props.height} /> 
            </g>
        );
    }
}

const G = connect(mapStateToProps, mapDispatchToProps)(GComponent);

export default G;