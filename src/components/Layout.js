import React from 'react';
import NavMenu from './NavMenu';

export default props => (
    <div className="main">
        <NavMenu />
        <div className="container container-body">
            {props.children}
        </div>
    </div>
);
