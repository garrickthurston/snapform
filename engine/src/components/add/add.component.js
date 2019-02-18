import React, { Component } from 'react';
import { store } from '../../config/redux/redux.store';
import { connect } from 'react-redux';
import { gClicked } from '../../config/redux/redux.actions'; 
import Loadable from 'react-loadable';

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
        gClicked: payload => dispatch(gClicked(payload))
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
                text: 'Select Input Type'
            },
            selectedInputComponent: null
        };

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleInputTypeClick = this.handleInputTypeClick.bind(this);
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

    handleCloseClick(e) {
        this.props.gClicked({
            addComponent: null,
            gClassList: 'gid'
        });
    }

    handleInputTypeClick(e) {
        const value = e.target.name;
        const text = e.target.innerText;
        
        this.setState(Object.assign({}, this.state, {
            selectedInputType: {
                value: value,
                text: text
            }
        }));

        switch (value) {
            case 'header':
                this.setState(Object.assign({}, this.state, {
                    selectedInputComponent: (<HeaderComponent />)
                }));
                break;
            case 'text':
                this.setState(Object.assign({}, this.state, {
                    selectedInputComponent: (<TextComponent />)
                }));
                break;
            case 'text-area':
                this.setState(Object.assign({}, this.state, {
                    selectedInputComponent: (<TextAreaComponent />)
                }));
                break;
        }
    }

    render() {
        const { selectedInputComponent } = this.state;
        return (
            <div ref={add => this.add = add} className="add" style={{'top': this.props.top, 'left': this.props.left}}>
                <div className="close-icon-container" onClick={this.handleCloseClick}>
                    <span className="close-icon"></span>
                </div>
                <div className="add-content">
                    <div>
                        <div className="dropdown">
                            <button className="btn dropdown-toggle shadow-none" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span>{this.state.selectedInputType.text}</span>
                            </button>
                            <div className="dropdown-menu">
                                {this.state.inputTypes.map((inputType, i) => {   
                                    return (<a key={i} className="dropdown-item" onClick={this.handleInputTypeClick} name={inputType.value}>{inputType.text}</a>) 
                                })}
                            </div>
                        </div>
                    </div>
                    {selectedInputComponent}
                    <div>
                        <div className="add-btn-group btn-group text-center">
                            <button type="button" className="btn shadow-none add-btn"><span className="close-icon"></span></button>
                            <button type="button" className="btn shadow-none add-btn"><span className="check-icon"></span></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(AddComponent);

export default Add;