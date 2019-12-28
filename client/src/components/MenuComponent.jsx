import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import uiStrings from '../ui-strings';
import { useUser } from '../contexts/providers/UserContextProvider';
import './MenuComponent.scss';

export default function MenuComponent() {
    const user = useUser();

    const renderAuthSection = useMemo(() => {
        if (user.data) {
            return (
                <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                    <NavLink to="/login?l=1" className="nav-link">{uiStrings.logOut}</NavLink>
                </li>
            );
        }

        return (
            <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                <NavLink to="/login" className="nav-link">{uiStrings.logIn}</NavLink>
            </li>
        );
    }, [user.data]);

    const renderWorkflowLink = useMemo(() => {
        if (user.data) {
            return (
                <li className="nav-item active">
                    <NavLink to="/workspace" className="nav-link">{uiStrings.workspace}</NavLink>
                </li>
            );
        }

        return null;
    }, [user.data]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-fixed-top">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active" data-toggle="collapse" data-target=".navbar-collapse.show">
                    <NavLink to="/" className="nav-link home-anchor">{uiStrings.snapform}</NavLink>
                </li>
            </ul>
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
                <ul className="navbar-nav mr-auto" data-toggle="collapse" data-target=".navbar-collapse.show">
                    {renderWorkflowLink}
                    <li className="nav-item active" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <NavLink to="/docs" className="nav-link">{uiStrings.docs}</NavLink>
                    </li>
                    <li className="nav-item active" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <NavLink to="/tutorial" className="nav-link">{uiStrings.tutorial}</NavLink>
                    </li>
                    <li className="nav-item active" data-toggle="collapse" data-target=".navbar-collapse.show">
                        <NavLink to="/blog" className="nav-link">{uiStrings.blog}</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {renderAuthSection}
                </ul>
            </div>
        </nav>
    );
}
