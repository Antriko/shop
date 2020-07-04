import React, { useMemo, useEffect, useState } from "react";
import Navigationbar from './components/navbar/navbar.js';
import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";

import indexPage from './components/pages/index/index.js';
import loginPage from './components/pages/user/login.js';
import logoutPage from './components/pages/user/logout.js';
import basketPage from './components/pages/user/basket.js'

import searchPage from './components/pages/shop/searchPage.js';
import categoryPage from './components/pages/shop/category.js';
import categoryList from './components/pages/shop/categoryList.js'
import shopItem from './components/pages/shop/item.js'

import { UserContext } from './userContext.js';
import axios from "axios";
import { Container } from 'react-bootstrap';

function App() {
    const [user, setUser] = useState({userdata: {basket:[]}, isLogged: false});

    // FIXME Sometimes sends multiple requests to server when refreshing???
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:3001/user/verify', {
                withCredentials: true
            })
                .then(res => {
                    setUser({userdata: res.data, isLogged: true});
                })
                .catch(e => {   
                    console.log(e)
                })
            };
    
        fetchData();
    }, []);

    const value = useMemo(() => ({ user, setUser }), [user, setUser]);
        return (
            <div className="App">
                    <Router>
                        <UserContext.Provider value={value}>
                            <Navigationbar />
                            <Container>
                                <Route exact path="/" component={indexPage} />
                                <Route exact path="/login" component={loginPage} />
                                <Route exact path="/logout" component={logoutPage} />

                                <Route exact path="/search/:search" component={searchPage} />
                                <Route exact path="/category/" component={categoryPage} />
                                <Route exact path="/category/:category" component={categoryList} />
                                <Route exact path="/shop/:id" component={shopItem} />

                                <Route exact path="/basket" component={basketPage} />
                            </Container>
                        </UserContext.Provider>
                    </Router>

            </div>
        );
    }
export default App;