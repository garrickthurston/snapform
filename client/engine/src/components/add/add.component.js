import React, { Component } from 'react';
import { store } from '../../../../common/config/redux/redux.store';
import { connect } from 'react-redux';
import { gClicked, updateProject, addInputTagChanged, addInputValueChanged } from '../../config/redux/redux.actions'; 
import Loadable from 'react-loadable';
import { ProjectService } from '../../../../common/services/project.service';

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
        gClicked: payload => dispatch(gClicked(payload)),
        updateProject: payload => dispatch(updateProject(payload)),
        addInputTagChanged: payload => dispatch(addInputTagChanged(payload)),
        addInputValueChanged: payload => dispatch(addInputValueChanged(payload))
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
        if (this.props.node.contains(e.target) || this.add.contains(e.target)) {
            return;
        }

        this.props.gClicked({
            addComponent: null,
            gClassList: 'gid'
        });
    }

    handleCloseClick() {
        this.props.gClicked({
            addComponent: null,
            gClassList: 'gid'
        });
        this.props.addInputTagChanged(null);
    }

    handleInputTypeClick(e) {
        const value = e.target.name;
        const text = e.target.innerText;

        var selectedInputComponent = null;
        switch (value) {
            case 'header':
                selectedInputComponent = (<HeaderComponent />);
                this.props.addInputTagChanged('h6');
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
        const { workspace } = store.getState().engineReducer;
        const project = workspace.project;

        var item = {
            uid: uuid(),
            tag: {
                name: project.add.addInputTag,
                value: project.add.addInputValue
            },
            x: project.config.current_x,
            y: project.config.current_y,
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

        await this.projectService.put(workspace.id, workspace.project.id, project);
    }

    render() {
        const { selectedInputComponent, selectedInputType } = this.state;
        const { workspace } = store.getState().engineReducer;
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
                        selectedInputComponent && project.add.addInputValue && project.add.addInputValue.length 
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