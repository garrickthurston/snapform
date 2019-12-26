import React from 'react';
import { A } from 'hookrouter';
import './MenuComponent.scss';

export default function MenuComponent() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-fixed-top">
            <A href="/" className="nav-link">Snapform</A>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <A href="/workspace" className="nav-link">Workspace</A>
                    </li>
                    <li className="nav-item active">
                        <A href="/docs" className="nav-link">Docs</A>
                    </li>
                    <li className="nav-item active">
                        <A href="/tutorial" className="nav-link">Tutorial</A>
                    </li>
                    <li className="nav-item active">
                        <A href="/blog" className="nav-link">Blog</A>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <A href="/login" className="nav-link">Log in</A>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
