import React, { Component } from 'react';
import { store } from '../../config/redux/redux.store';
import { connect } from 'react-redux';
import { updateProject, updateProjectConfig } from '../../config/redux/redux.actions'; 
import Loadable from 'react-loadable';
import { ProjectService } from '../../../../app/src/shared/services/project.service';

const uuid = require('uuid');

import LoadingComponent from '../../shared/loading.component';

const HeaderComponent = Loadable({
    loader: () => import ('./header.component'),
    loading: LoadingComponent
});
const TextComponent = Loadable({
    loader: () => import ('./text.component'),
    loading: LoadingComponent
});
const TextAreaComponent = Loadable({
    loader: () => import ('./text-area.component'),
    loading: LoadingComponent
});

import '../../../assets/style/components/add/add.scss';

const mapStateToProps = (state) => state;

function mapDispatchToProps(dispatch) {
    return {
        updateProject: payload => dispatch(updateProject(payload)),
        updateProjectConfig: payload => dispatch(updateProjectConfig(payload))
    };
}

class AddComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputTypes: [
                {
                    value: 'header',
                    text: 'Header'
                },
                {
                    value: 'text',
                    text: 'Text'
                },
                {
                    value: 'text-area',
                    text: 'Text Area'
                }
            ],
            selectedInputType: {
                value: null,
                text: 'Select...'
            },
            selectedInputComponent: null

        };

        this.projectService = new ProjectService();

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleInputTypeClick = this.handleInputTypeClick.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleOutsideClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick, false);
    }

    handleOutsideClick(e) {
        if (this.add.contains(e.target)) {
            return;
        }

        const { workspace } = store.getState();
        this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
            ui: Object.assign({}, workspace.project.config.ui, {
                g_class_list: 'gid',
                add: {
                    component: null,
                    tag: null,
                    value: null
                }
            })
        }));
    }

    handleCloseClick() {
        const { workspace } = store.getState();
        this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
            ui: Object.assign({}, workspace.project.config.ui, {
                g_class_list: 'gid',
                add: {
                    component: null,
                    tag: null,
                    value: null
                }
            })
        }));
    }

    handleInputTypeClick(e) {
        const value = e.target.name;
        const text = e.target.innerText;

        const { workspace } = store.getState();

        var selectedInputComponent = null;
        switch (value) {
            case 'header':
                selectedInputComponent = (<HeaderComponent />);
                this.props.updateProjectConfig(Object.assign({}, workspace.project.config, {
                    ui: Object.assign({}, workspace.project.config.ui, {
                        add: Object.assign({}, workspace.project.config.ui.add, {
                            tag: 'h6',
                            value: ''
                        })
                    })
                }));
                break;
            case 'text':
                selectedInputComponent = (<TextComponent />);
                break;
            case 'text-area':
                selectedInputComponent = (<TextAreaComponent />);
                break;
        }

        this.setState(Object.assign({}, this.state, {
            selectedInputComponent: selectedInputComponent,
            selectedInputType: {
                value: value,
                text: text
            }
        }));
    }

    async handleAddClick() {
        const { workspace } = store.getState();
        const project = workspace.project;

        var item = {
            uid: uuid(),
            tag: {
                name: project.config.ui.add.tag,
                value: project.config.ui.add.value
            },
            x: project.config.ui.current_x,
            y: project.config.ui.current_y,
            z: 0,
            h: 'auto'
        };

        if (project.items) {
            for (var key in project.items) {
                if (project.items[key].z > item.z) {
                    item.z = project.items[key].z;
                }
            }
            item.z += 1;
        }

        switch (this.state.selectedInputType.value) {
            case "header":
                item.w = 'auto';
                item.tag.innerValue = true;
                break;
            case "text":
                item.w = 200;
                item.tag.innerValue = false;
                break;
            case "text-area":
                item.w = 200;
                item.tag.innerValue = false;
                break;
        }

        this.props.updateProject({
            path: item.uid,
            value: item
        });

        this.handleCloseClick();

        const updated_workspace = store.getState().workspace;
        this.add.dispatchEvent(new CustomEvent('sf.workspace.project.update', {
            bubbles: true,
            detail: { 
                workspace_id: updated_workspace.id,
                project: updated_workspace.project 
            }
        }));
    }

    render() {
        const { selectedInputComponent, selectedInputType } = this.state;
        const { workspace } = store.getState();
        const project = workspace.project;

        return (
            <div ref={add => this.add = add} className="add" style={{'top': this.props.top, 'left': this.props.left}}>
                <div className="close-icon-container" onClick={this.handleCloseClick}>
                    <span className="close-icon"></span>
                </div>
                <div className="add-content">
                    <div className="input-component">
                        <div className="dropdown">
                            <button className="btn dropdown-toggle shadow-none g-valid" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span>{selectedInputType.text}</span>
                            </button>
                            <span>Input Type</span>
                            <div className="dropdown-menu">
                                {this.state.inputTypes.map((inputType, i) => {   
                                    return (<a key={i} className="dropdown-item" onClick={this.handleInputTypeClick} name={inputType.value}>{inputType.text}</a>) 
                                })}
                            </div>
                        </div>
                    </div>
                    {selectedInputComponent}
                    <div className={
                        selectedInputComponent && project.config.ui.add.value && project.config.ui.add.value.length 
                            ? 'show-btn-group' 
                            : 'hide-btn-group'}>
                        <div className="add-btn-group btn-group text-center">
                            <button type="button" className="btn shadow-none add-btn" onClick={this.handleCloseClick}><span className="close-icon"></span></button>
                            <button type="button" className="btn shadow-none add-btn" onClick={this.handleAddClick}><span className="check-icon"></span></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(AddComponent);

export default Add;