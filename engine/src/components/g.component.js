import React, { Component } from 'react';

class GComponent extends Component {
    render() {
        return (
            <g id="gid" transform={this.props.transform}>
                <rect id="hoverRect" width={this.props.width} height={this.props.height} /> 
            </g>
        );
    }
}


export default GComponent;