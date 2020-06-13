import React from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './components/navbar/navbar.js';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import indexPage from './components/pages/index/index.js';
import loginPage from './components/pages/user/login.js';

import { Form } from 'react-bootstrap';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {   
      userData: {},                        
      isLogged: false
    }
  };

  componentDidMount() {
    axios.get('http://localhost:3000/verify')
      .then(res => {
        console.log(res);
      })
      .catch(e => {console.log(e)})
  }

  login(event) {
    console.log('ok')
    event.preventDeafult();
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <Navbar isLogged={this.state.isLogged}/>

        <Router>
        <Route exact path="/" component={indexPage} />
        <Route exact path="/login" component={loginPage} />
        </Router>

        <Form onSubmit={this.login}>

        </Form>
      </div>
    );
  }
};