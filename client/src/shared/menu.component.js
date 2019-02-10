import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import '../../assets/style/shared/menu.scss';

const mapStateToProps = (state) => state;

class MenuComponent extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Snapform</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/">Dashboard</NavLink>
                        </li>
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/documentation">Documentation</NavLink>
                        </li>
                    </ul>                    
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/login">Log in</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
};

const Menu = connect(mapStateToProps)(MenuComponent);

export default Menu;