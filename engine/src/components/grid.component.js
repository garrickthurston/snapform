import React, { Component } from 'react';
import { store } from '../config/redux/redux.store';
import { updateViewSettings, gClicked } from '../config/redux/redux.actions';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import LoadingComponent from '../shared/loading.component';

import GComponent from './g.component';
import AddComponent from './add/add.component';

import '../../assets/images/mgt-logo.png';
import '../../assets/style/components/grid.component.scss';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return {
        updateViewSettings: payload => dispatch(updateViewSettings(payload)),
        gClicked: payload => dispatch(gClicked(payload))
    };
}

const ProjectOutputComponent = Loadable({
    loader: () => import ('./project-output.component'),
    loading: LoadingComponent
});
const ItemComponent = Loadable({
    loader: () => import('./item/item.component'),
    loading: LoadingComponent
});

class GridComponent extends Component {
    smallGridPath = `M ${this.props.cellWidth} 0 L 0 0 0 ${this.props.cellHeight}`;
    gridPath = `M ${this.props.cellWidth * 10} 0 L 0 0 0 ${this.props.cellHeight * 10}`;

    constructor(props) {
        super(props);

        this.props.updateViewSettings({
            viewWidth: this.props.viewWidth,
            viewHeight: this.props.viewHeight,
            cellWidth: this.props.cellWidth,
            cellHeight: this.props.cellHeight,
            cellTransform: this.props.cellTransform
        });

        this.state = {
            
        }

        this.mouseMove = this.mouseMove.bind(this);
        this.handleSvgClick = this.handleSvgClick.bind(this);
        this.processProject = this.processProject.bind(this);
    }

    mouseMove(e) {
        const { workspace } = store.getState();
        const project = workspace.project;

        if (project.add.addComponent) {
            return;
        }

        var x = Math.floor(e.nativeEvent.offsetX / this.props.cellWidth) * this.props.cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / this.props.cellHeight) * this.props.cellHeight;
        var cellTransform = 'translate(' + x + ',' + y + ')';

        this.props.updateViewSettings({ 
            cellTransform 
        });
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

    processProject(items) {
        var render_items = [];

        for (var key in items) {
            const item = items[key];
            render_items.push({
                props: item
            });
        }

        return render_items;
    }

    render() {
        const { workspace } = store.getState();
        const project = workspace.project;
        
        const project_items = this.processProject(project.items);

        return (
            <div>
                <ProjectOutputComponent />
                <div className="add-container" ref={container => this.container = container}>
                    <svg ref={node => this.node = node} className="view-svg" width={project.viewWidth} height={project.viewHeight} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="smallGrid" width={project.cellWidth} height={project.cellHeight} patternUnits="userSpaceOnUse">
                                <path d={this.smallGridPath} fill="none" stroke="gray" strokeWidth="0.5"/>
                            </pattern>
                            <pattern id="grid" width={project.cellWidth * 10} height={project.cellHeight * 10} patternUnits="userSpaceOnUse">
                                <rect width={project.cellWidth * 10} height={project.cellHeight * 10} fill="url(#smallGrid)"/>
                                <path d={this.gridPath} fill="none" stroke="gray" strokeWidth="1"/>
                            </pattern>
                        </defs>
                
                        <rect width="100%" height="100%" fill="url(#grid)" onMouseMove={this.mouseMove} onClick={this.handleSvgClick} />
                        <GComponent ref={g => this.g = g} width={project.cellWidth} height={project.cellHeight} transform={project.cellTransform} node={this.node} container={this.container} add={this.add} />
                    </svg>
                    { project.add.addComponent
                        ? <AddComponent top={project.add.addComponent.props.top} left={project.add.addComponent.props.left} g={this.g} node={this.node} container={this.container} />
                        : null }
                    {project_items.map((item, i) => {
                        return <ItemComponent key={i} {...item.props} />;
                    })}
                </div>
            </div>
        )
    }
};

const Grid = connect(mapStateToProps, mapDispatchToProps)(GridComponent);

export default Grid;