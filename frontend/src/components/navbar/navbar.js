import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, InputGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./navbar.css";
import { UserContext } from '../../userContext';

const Navigationbar = () => {    
    const { user } = useContext(UserContext);

    function totalBasket() {
        var total = 0;
        for (var i=0; i<user.userdata.basket.length; i++) {
            total = total + user.userdata.basket[i][1];
            console.log(user.userdata.basket[i][1])
        }
        return total;
    }

    var userNav = (user.isLogged) ? <React.Fragment>
                                            <NavDropdown title={user.userdata.username}>
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
                {userNav}
                <Link to="/basket" className="nav-link ml-4">Basket - {totalBasket()}</Link>
            </Nav>
        </Navbar.Collapse>

    </Navbar>
)};

export default Navigationbar;