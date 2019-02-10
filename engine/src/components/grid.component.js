import React, { Component } from 'react';
import store from '../config/redux/redux.store';
import { updateViewSettings } from '../config/redux/redux.actions';
import { connect } from 'react-redux';

import GComponent from './g.component';

import '../../assets/style/components/grid.component.scss';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        updateViewSettings: payload => dispatch(updateViewSettings(payload))
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
    }

    mouseMove(e) {
        var x = Math.floor(e.nativeEvent.offsetX / this.props.cellWidth) * this.props.cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / this.props.cellHeight) * this.props.cellHeight;
        var cellTransform = 'translate(' + x + ',' + y + ')';

        this.props.updateViewSettings({ cellTransform });
    }

    render() {
        const { cellTransform, viewWidth, viewHeight, cellWidth, cellHeight } = store.getState();
        return (
            <div>
                <div>{cellTransform}</div>
                <svg className="view-svg" width={viewWidth} height={viewHeight} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="smallGrid" width={cellWidth} height={cellHeight} patternUnits="userSpaceOnUse">
                            <path d={this.smallGridPath} fill="none" stroke="gray" strokeWidth="0.5"/>
                        </pattern>
                        <pattern id="grid" width={cellWidth * 10} height={cellHeight * 10} patternUnits="userSpaceOnUse">
                            <rect width={cellWidth * 10} height={cellHeight * 10} fill="url(#smallGrid)"/>
                            <path d={this.gridPath} fill="none" stroke="gray" strokeWidth="1"/>
                        </pattern>
                    </defs>
            
                    <rect id="rect" width="100%" height="100%" fill="url(#grid)" onMouseMove={this.mouseMove.bind(this)} />
                    <GComponent width={cellWidth} height={cellHeight} transform={cellTransform} />
                </svg>
            </div>
        )
    }
};

const Grid = connect(mapStateToProps, mapDispatchToProps)(GridComponent);

export default Grid;