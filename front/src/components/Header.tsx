import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { IndexLinkContainer } from "react-router-bootstrap";
import { Link } from 'react-router-dom';
import FirstComponent from './FirstComponent';
import SecondComponent from './SecondComponent';

 export const Header = () => {
    return (
        <Navbar>
                <Navbar.Brand>
                    <Link to="/">dankNotDank</Link>
                </Navbar.Brand>     
            <Nav>
                <IndexLinkContainer to="/FirstComponent">
                    <NavItem>Page 1</NavItem>
                </IndexLinkContainer>
                <IndexLinkContainer to="/SecondComponent">
                    <NavItem>Page 2</NavItem>
                </IndexLinkContainer>
            </Nav>
        </Navbar>
    );
}