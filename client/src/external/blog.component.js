import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => state;

class BlogComponent extends Component {
    render() {
        return (
            <div>
                <h2>Blog</h2>
            </div>
        );
    }
};

const Blog = connect(mapStateToProps)(BlogComponent);

export default Blog;