import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const mapStateToProps = (state) => state;

class MenuComponent extends Component {
    render() {
        return (
            <div>
                <NavLink to="/">Dashboard</NavLink>
                <NavLink to="/Login">Log In</NavLink>
            </div>
        );
    }
};

const Menu = connect(mapStateToProps)(MenuComponent);

export default Menu;