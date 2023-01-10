import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { IndexLinkContainer } from "react-router-bootstrap";
import { Link } from 'react-router-dom';
import FirstComponent from './FirstComponent';
import SecondComponent from './SecondComponent';
import Container from 'react-bootstrap/Container';


function ContainerOutsideExample() {
  return (
    <Container>
      <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="#">Navbar</Navbar.Brand>
        </Container>
      </Navbar>
    </Container>
  );
}

function ContainerInsideExample() {
  return (
    <Navbar expand="lg" variant="light" bg="light">
      <Container>
        <Navbar.Brand href="#">Navbar</Navbar.Brand>
      </Container>
    </Navbar>
  );
}


function ColorSchemesExample() {
 
}


const Header: React.FC = () => {

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/components/FirstComponent">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/components/FirstComponent">Home</Nav.Link>
            <Nav.Link href="/components/SecondComponent">Features</Nav.Link>
            <Nav.Link href="./App">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

    </>
  );
  return (
        <header>
            <h1>test</h1>
            <nav>
              <ul>
                <li>
                <Link to="/components/FirstComponent">About</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
        </header>
    );
}

export default Header;