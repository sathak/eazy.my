import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';

export default props => (
    <Navbar collapseOnSelect fixedTop>
        <Navbar.Header>
            <Navbar.Brand>
                <Link to={'/'}><span className="brand-name">eazy</span><span className="brand-subname">.my</span></Link>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse >
            <Nav>
                <LinkContainer to="/counter">
                    <NavItem>Category</NavItem>
                </LinkContainer>
                <LinkContainer to="/notification">
                    <NavItem>Notification</NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                    <NavItem>Login/Sign up</NavItem>
                </LinkContainer>
                <LinkContainer to="/Help">
                    <NavItem>Help</NavItem>
                </LinkContainer>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);
