import React, { Component } from 'react';

import GComponent from './g.component';

import '../../assets/style/components/grid.component.scss';

class GridComponent extends Component {
    cellWidth = 8;
    cellHeight = 8;
    smallGridPath = `M ${this.cellWidth} 0 L 0 0 0 ${this.cellHeight}`;
    gridPath = `M ${this.cellWidth * 10} 0 L 0 0 0 ${this.cellHeight * 10}`;
    transform = `translate(0,0)`;

    constructor(props) {
        super(props);

        this.state = {
            width: this.props.width,
            height: this.props.height,
            transform: this.transform
        };

        this.mouseMove = this.mouseMove.bind(this);
    }

    mouseMove(e) {
        var x = Math.floor(e.nativeEvent.offsetX / this.cellWidth) * this.cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / this.cellHeight) * this.cellHeight;
        var transform = 'translate(' + x + ',' + y + ')';

        this.setState(state => state.transform = transform);
    }

    render() {
        return (
            <div>
                <div>{this.state.transform}</div>
                <svg className="view-svg" width={this.props.width} height={this.props.height} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="smallGrid" width={this.cellWidth} height={this.cellHeight} patternUnits="userSpaceOnUse">
                            <path d={this.smallGridPath} fill="none" stroke="gray" strokeWidth="0.5"/>
                        </pattern>
                        <pattern id="grid" width={this.cellWidth * 10} height={this.cellHeight * 10} patternUnits="userSpaceOnUse">
                            <rect width={this.cellWidth * 10} height={this.cellHeight * 10} fill="url(#smallGrid)"/>
                            <path d={this.gridPath} fill="none" stroke="gray" strokeWidth="1"/>
                        </pattern>
                    </defs>
            
                    <rect id="rect" width="100%" height="100%" fill="url(#grid)" onMouseMove={this.mouseMove.bind(this)} />
                    <GComponent width={this.cellWidth} height={this.cellHeight} transform={this.state.transform} />
                </svg>
            </div>
        )
    }
};

export default GridComponent;