import React, { Component } from 'react';
import { store } from '../config/redux/redux.store';
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
        const { cellWidth, cellHeight } = store.getState();

        var x = Math.floor(e.nativeEvent.offsetX / cellWidth) * cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / cellHeight) * cellHeight;
        var cellTransform = 'translate(' + x + ',' + y + ')';

        const left = x + (cellWidth / 2);
        const top = y + (cellHeight / 2);

        this.props.gClicked({
            cellTransform,
            current_x: x,
            current_y: y,
            addComponent: <AddComponent top={top} left={left} />,
            gClassList: 'gid clicked'
        });
    }

    render() {
        const { gClassList } = store.getState();
        return (
            <g ref={el => this.el = el} className={gClassList} transform={this.props.transform} onClick={this.handleClick}>
                <rect className="hover-rect" width={this.props.width} height={this.props.height} /> 
            </g>
        );
    }
}

const G = connect(mapStateToProps, mapDispatchToProps)(GComponent);

export default G;