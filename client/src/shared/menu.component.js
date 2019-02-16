import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { store } from '../config/redux/redux.store';

import '../../assets/style/shared/menu.scss';

const mapStateToProps = (state) => state;

class MenuComponent extends Component {
    render() {
        const { token, user } = store.getState();
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="nav-link" to="/">Snapform</NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        { token && user ?
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                        </li>
                        : 
                        null }
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/docs">Docs</NavLink>
                        </li>
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/tutorial">Tutorial</NavLink>
                        </li>
                        <li className="nav-item active">
                            <NavLink className="nav-link" to="/blog">Blog</NavLink>
                        </li>
                    </ul>
                    { !token && !user ?
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/login">Log in</NavLink>
                        </li>
                    </ul>
                    : 
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/login?l=1">Log Out</NavLink>
                        </li>
                    </ul> }
                </div>
            </nav>
        );
    }
};

const Menu = connect(mapStateToProps)(MenuComponent);

export default Menu;