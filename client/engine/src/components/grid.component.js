import React, { Component } from 'react';
import { store } from '../../../common/config/redux/redux.store';
import { updateProjectContainer, updateProjectItems, initProject, updateProjectConfig } from '../config/redux/redux.actions';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import LoadingComponent from '../shared/loading.component';

import GComponent from './g.component';
import AddComponent from './add/add.component';

import '../../assets/style/components/grid.component.scss';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return {
        updateProjectContainer: payload => dispatch(updateProjectContainer(payload)),
        updateProjectItems: payload => dispatch(updateProjectItems(payload)),
        initProject: payload => dispatch(initProject(payload)),
        updateProjectConfig: payload => dispatch(updateProjectConfig(payload))
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

    constructor(props) {
        super(props);

        const { config } = this.props.project;

        this.state = {
            smallGridPath: `M ${config.cellWidth} 0 L 0 0 0 ${config.cellHeight}`,
            gridPath: `M ${config.cellWidth * 10} 0 L 0 0 0 ${config.cellHeight * 10}`
        };

        this.handleMouseMove = this.handleMouseMove.bind(this);

        this.props.initProject({
            workspace_id: this.props.workspace_id,
            project: this.props.project
        });
    }

    componentDidMount() {
        this.props.updateProjectContainer(this.container);
    }

    handleMouseMove(e) {
        const { workspace } = store.getState().engineReducer;
        const { config } = workspace.project;

        if (config.ui.add.component) {
            return;
        }

        const x = Math.floor(e.nativeEvent.offsetX / config.cellWidth) * config.cellWidth;
        const y = Math.floor(e.nativeEvent.offsetY / config.cellHeight) * config.cellHeight;
        const cellTransform = `translate(${x},${y})`;

        this.props.updateProjectConfig(Object.assign({}, config, {
            ui: Object.assign({}, config.ui, {
                cellTransform
            })
        }));
    }

    render() {
        const { workspace } = store.getState().engineReducer;
        const project = workspace.project;

        var render_items = [];
        Object.keys(project.items).forEach((key) => {
            const item = project.items[key];
            render_items.push({
                props: Object.assign({}, item, {
                    uid: key
                })
            });
        });

        const { smallGridPath, gridPath } = this.state;
        return (
            <div>
                <ProjectOutputComponent />
                <div className="add-container" ref={container => this.container = container}>
                    <svg ref={node => this.node = node} className="view-svg" width={project.config.viewWidth} height={project.config.viewHeight} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="smallGrid" width={project.config.cellWidth} height={project.config.cellHeight} patternUnits="userSpaceOnUse">
                                <path d={smallGridPath} fill="none" stroke="gray" strokeWidth="0.5"/>
                            </pattern>
                            <pattern id="grid" width={project.config.cellWidth * 10} height={project.config.cellHeight * 10} patternUnits="userSpaceOnUse">
                                <rect width={project.config.cellWidth * 10} height={project.config.cellHeight * 10} fill="url(#smallGrid)"/>
                                <path d={gridPath} fill="none" stroke="gray" strokeWidth="1"/>
                            </pattern>
                        </defs>
                
                        <rect width="100%" height="100%" fill="url(#grid)" onMouseMove={this.handleMouseMove} />
                        <GComponent ref={g => this.g = g} />
                    </svg>
                    { project.config.ui.add.component
                        ? <AddComponent top={project.config.ui.add.component.top} left={project.config.ui.add.component.left} g={this.g} node={this.node} container={this.container} />
                        : null }
                    {render_items.map((item) => {
                        return <ItemComponent key={item.props.uid} {...item.props} />;
                    })}
                </div>
            </div>
        )
    }
};

const Grid = connect(mapStateToProps, mapDispatchToProps)(GridComponent);

export default Grid;