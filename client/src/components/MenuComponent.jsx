import React from 'react';
import { A } from 'hookrouter';
import uiStrings from '../ui-strings';
import './MenuComponent.scss';

export default function MenuComponent() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-fixed-top">
            <A href="/" className="nav-link">{uiStrings.snapform}</A>
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
                        <A href="/workspace" className="nav-link">{uiStrings.workspace}</A>
                    </li>
                    <li className="nav-item active">
                        <A href="/docs" className="nav-link">{uiStrings.docs}</A>
                    </li>
                    <li className="nav-item active">
                        <A href="/tutorial" className="nav-link">{uiStrings.tutorial}</A>
                    </li>
                    <li className="nav-item active">
                        <A href="/blog" className="nav-link">{uiStrings.blog}</A>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <A href="/login" className="nav-link">{uiStrings.logIn}</A>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
