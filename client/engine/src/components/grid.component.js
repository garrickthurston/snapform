import React, { Component } from 'react';
import { store } from '../../../common/config/redux/redux.store';
import { updateViewSettings, gClicked, updateProjectContainer, updateProjectItems, addProjectForm } from '../config/redux/redux.actions';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import LoadingComponent from '../shared/loading.component';
import { ProjectService } from '../../../common/services/project.service';

import GComponent from './g.component';
import AddComponent from './add/add.component';

import '../../assets/style/components/grid.component.scss';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => {
    return {
        updateViewSettings: payload => dispatch(updateViewSettings(payload)),
        gClicked: payload => dispatch(gClicked(payload)),
        updateProjectContainer: payload => dispatch(updateProjectContainer(payload)),
        updateProjectItems: payload => dispatch(updateProjectItems(payload)),
        addProjectForm: payload => dispatch(addProjectForm(payload))
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

        this.state = {
            
        };

        this.props.addProjectForm({
            workspace_id: this.props.workspace_id,
            project_id: this.props.project_id,
            project_name: this.props.project_name
        })

        // TODO
        this.projectService = new ProjectService();
        this.projectService.get(this.props.workspace_id, this.props.project_id).then(project => {
            const config = JSON.parse(project.config);
            const items = JSON.parse(project.items);
            
            
            this.props.updateViewSettings({
                viewWidth: config.viewWidth || this.props.viewWidth,
                viewHeight: config.viewHeight || this.props.viewHeight,
                cellWidth: config.cellWidth || this.props.cellWidth,
                cellHeight: config.cellHeight || this.props.cellHeight,
                cellTransform: config.cellTransform
            });
            
            this.props.updateProjectItems(items);
        }).catch(e => {

        });

        this.mouseMove = this.mouseMove.bind(this);
        this.handleSvgClick = this.handleSvgClick.bind(this);
    }

    componentDidMount() {
        this.props.updateProjectContainer(this.container);
    }

    mouseMove(e) {
        const { workspace } = store.getState().engineReducer;
        const project = workspace.project;

        if (project.add.addComponent) {
            return;
        }

        var x = Math.floor(e.nativeEvent.offsetX / this.props.cellWidth) * this.props.cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / this.props.cellHeight) * this.props.cellHeight;
        var cellTransform = `translate(${x},${y})`;

        this.props.updateViewSettings({ 
            cellTransform 
        });
    }

    handleSvgClick(e) {
        const { workspace } = store.getState().engineReducer;
        const project = workspace.project;

        var x = Math.floor(e.nativeEvent.offsetX / project.config.cellWidth) * project.config.cellWidth;
        var y = Math.floor(e.nativeEvent.offsetY / project.config.cellHeight) * project.config.cellHeight;
        var cellTransform = `translate(${x},${y})`;

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

        var render_items = [];
        Object.keys(project.items).forEach((key) => {
            const item = project.items[key];
            render_items.push({
                props: Object.assign({}, item, {
                    uid: key
                })
            });
        });


        return (
            <div>
                <ProjectOutputComponent />
                <div className="add-container" ref={container => this.container = container}>
                    <svg ref={node => this.node = node} className="view-svg" width={project.config.viewWidth} height={project.config.viewHeight} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="smallGrid" width={project.config.cellWidth} height={project.config.cellHeight} patternUnits="userSpaceOnUse">
                                <path d={this.smallGridPath} fill="none" stroke="gray" strokeWidth="0.5"/>
                            </pattern>
                            <pattern id="grid" width={project.config.cellWidth * 10} height={project.config.cellHeight * 10} patternUnits="userSpaceOnUse">
                                <rect width={project.config.cellWidth * 10} height={project.config.cellHeight * 10} fill="url(#smallGrid)"/>
                                <path d={this.gridPath} fill="none" stroke="gray" strokeWidth="1"/>
                            </pattern>
                        </defs>
                
                        <rect width="100%" height="100%" fill="url(#grid)" onMouseMove={this.mouseMove} onClick={this.handleSvgClick} />
                        <GComponent ref={g => this.g = g} width={project.config.cellWidth} height={project.config.cellHeight} transform={project.config.cellTransform} node={this.node} container={this.container} add={this.add} />
                    </svg>
                    { project.add.addComponent
                        ? <AddComponent top={project.add.addComponent.props.top} left={project.add.addComponent.props.left} g={this.g} node={this.node} container={this.container} />
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