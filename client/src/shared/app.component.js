import React, { Component } from 'react';
import MenuComponent from './menu.component';

class AppComponent extends Component {
    render() {
        return (
            <div>
                <MenuComponent />
                <div className="body-content">
                    {this.props.children}
                </div>
                
            </div>
        );
    }
}

export default AppComponent;