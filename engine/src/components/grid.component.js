import React, { Component } from 'react';
import { store } from '../config/redux/redux.store';
import { updateViewSettings, gClicked } from '../config/redux/redux.actions';
import { connect } from 'react-redux';

import GComponent from './g.component';
import AddComponent from './add/add.component';

import '../../assets/images/mgt-logo.png';
import '../../assets/style/components/grid.component.scss';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        updateViewSettings: payload => dispatch(updateViewSettings(payload)),
        gClicked: payload => dispatch(gClicked(payload))
    };
}

class GridComponent extends Component {
    smallGridPath = `M ${this.props.cellWidth} 0 L 0 0 0 ${this.props.cellHeight}`;
    gridPath = `M ${this.props.cellWidth * 10} 0 L 0 0 0 ${this.props.cellHeight * 10}`;

    constructor(props) {
        super(props);

        const payload = {
            viewWidth: this.props.viewWidth,
            viewHeight: this.props.viewHeight,
            cellWidth: this.props.cellWidth,
            cellHeight: this.props.cellHeight,
            cellTransform: this.props.cellTransform
        };
        this.props.updateViewSettings(payload);

        this.mouseMove = this.mouseMove.bind(this);
        this.handleSvgClick = this.handleSvgClick.bind(this);
    }

    mouseMove(e) {
        const { addComponent } = store.getState();
        if (addComponent) {
            return;
        }

        var x = Math.floor(e.nativeEvent.offsetX / this.props.cellWidth) * this.props.cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / this.props.cellHeight) * this.props.cellHeight;
        var cellTransform = 'translate(' + x + ',' + y + ')';

        this.props.updateViewSettings({ cellTransform });
    }

    handleSvgClick(e) {
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
        const { cellTransform, viewWidth, viewHeight, cellWidth, cellHeight, addComponent } = store.getState();
        return (
            <div>
                <div className="add-container" ref={container => this.container = container}>
                <svg ref={node => this.node = node} className="view-svg" width={viewWidth} height={viewHeight} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="smallGrid" width={cellWidth} height={cellHeight} patternUnits="userSpaceOnUse">
                            <path d={this.smallGridPath} fill="none" stroke="gray" strokeWidth="0.5"/>
                        </pattern>
                        <pattern id="grid" width={cellWidth * 10} height={cellHeight * 10} patternUnits="userSpaceOnUse">
                            <rect width={cellWidth * 10} height={cellHeight * 10} fill="url(#smallGrid)"/>
                            <path d={this.gridPath} fill="none" stroke="gray" strokeWidth="1"/>
                        </pattern>
                    </defs>
            
                    <rect width="100%" height="100%" fill="url(#grid)" onMouseMove={this.mouseMove} onClick={this.handleSvgClick} />
                    <GComponent ref={g => this.g = g} width={cellWidth} height={cellHeight} transform={cellTransform} node={this.node} container={this.container} add={this.add} />
                </svg>
                { addComponent
                    ? <AddComponent top={addComponent.props.top} left={addComponent.props.left} g={this.g} node={this.node} container={this.container} />
                    : null }
                </div>
            </div>
        )
    }
};

const Grid = connect(mapStateToProps, mapDispatchToProps)(GridComponent);

export default Grid;