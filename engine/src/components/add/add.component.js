import React, { Component } from 'react';
import { store } from '../../config/redux/redux.store';
import { connect } from 'react-redux';
import { gClicked } from '../../config/redux/redux.actions'; 

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

        };

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
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

    render() {
        return (
            <div ref={add => this.add = add} className="add" style={{'top': this.props.top, 'left': this.props.left}}>
                <div className="add-content">
                    ADD
                </div>
            </div>
        //     <div style="position:relative;">
  		// 	<div class="inpTmplClose">
	  	// 		<span class="close hairline"></span>
	  	// 	</div>
	  	// 	<div class="formDiv">
		//   		<label>Input Type</label>
		//   		<div class="inp" style="margin:3px 0 0 0;">
		//   			<select class="inputDiv" name="inputType">
		//   				<option value="">Select...</option>
		//   			</select>
		//   		</div>
		//   		<div class="errorDiv">
		//   			<span class="changeError inputTypeError"></span>
		//   		</div>
	  	// 	</div>
  		// </div>
        );
    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(AddComponent);

export default Add;