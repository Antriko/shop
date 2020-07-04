import React, { useContext } from 'react';
import { Navbar, Nav, NavDropdown, InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import "./navbar.css";
import { UserContext } from '../../userContext';
import { useFormFields } from '../pages/user/formField';

const Navigationbar = () => {    
    const { user } = useContext(UserContext);
    const [query, setQuery] = useFormFields({
        query: ""
    });

    function totalBasket() {
        var total = 0;
        for (var i=0; i<user.userdata.basket.length; i++) {
            total += user.userdata.basket[i][1];
        }
        return total;
    }

    const history = useHistory();
    function SearchQuery(event) {
        event.preventDefault();
        if (query.query) {
            history.push('/search/'+query.query)
        };
    };

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
        <Form onSubmit={SearchQuery}>
            <Navbar bg="dark" variant="dark">
            <Navbar.Brand> 
                <Link to="/" className="navbar-link">
                    <img 
                        alt=""
                        src="tag.png"
                        width="30"
                        length="30"
                        className="d-inline-block align-top mr-3"/>
                     Shop
                </Link>
            </Navbar.Brand>

            <Navbar.Collapse>
                <InputGroup>
                    <FormControl id="query" value={query.query} onChange={setQuery}/>
                    <InputGroup.Append>
                        <Button variant="outline-secondary" type="submit">Search</Button>
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
    </Form>)
};

export default Navigationbar;