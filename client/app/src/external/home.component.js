import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => state;

class HomeComponent extends Component {
    render() {
        return (
            <div>
                <h2>Home</h2>
            </div>
        );
    }
};

const Home = connect(mapStateToProps)(HomeComponent);

export default Home;