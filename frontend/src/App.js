import React, { useMemo, useEffect, useState } from "react";
import Navigationbar from './components/navbar/navbar.js';
import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";

import indexPage from './components/pages/index/index.js';
import loginPage from './components/pages/user/login.js';
import logoutPage from './components/pages/user/logout.js';
import { UserContext } from './userContext.js';
import axios from "axios";

function App() {
    const [user, setUser] = useState({userdata: {}, isLogged: false});

    // FIXME Sometimes sends multiple requests to server when refreshing???
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('http://localhost:3001/user/verify', {
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data)
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
                        <Route exact path="/" component={indexPage} />
                        <Route exact path="/login" component={loginPage} />
                        <Route exact path="/logout" component={logoutPage} />
                    </UserContext.Provider>
                </Router>

            </div>
        );
    }
export default App;