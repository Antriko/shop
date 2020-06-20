import React from 'react';
import { Navbar, Nav, NavDropdown, InputGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./navbar.css";

const Navigationbar = props => {    
    var user = (props.data.isLogged) ? <React.Fragment>
                                            <NavDropdown title={props.data.userData.username}>
                                                <Link className="dropdown-item" to="/profile">Profile</Link>
                                                <NavDropdown.Divider />
                                                <Link className="dropdown-item" to="/logout">Log out</Link>
                                            </NavDropdown>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <Link to="/login" className="nav-link navbar-link">Login</Link>
                                        </React.Fragment>

    return (

    <Navbar bg="dark" variant="dark">
        <Navbar.Brand> 
            <Link to="/" className="navbar-link">
                <img 
                    alt=""
                    src="tag.png"
                    width="30"
                    length="30"
                    className="d-inline-block align-top mr-3"
                    />
                Shop
            </Link>
        </Navbar.Brand>

        <Navbar.Collapse>
            <InputGroup>
                <FormControl />
                <InputGroup.Append>
                    <Button variant="outline-secondary">Search</Button>
                </InputGroup.Append>
            </InputGroup>
        </Navbar.Collapse>
        
        <Navbar.Collapse>
            <Nav>
                {user}
                <Link to="/basket" className="nav-link ml-4">Basket</Link>
            </Nav>
        </Navbar.Collapse>

    </Navbar>
)};

export default Navigationbar;