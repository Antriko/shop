import React from 'react';
import axios from 'axios';
import Navigationbar from './components/navbar/navbar.js';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import indexPage from './components/pages/index/index.js';
import loginPage from './components/pages/user/login.js';
import logoutPage from './components/pages/user/logout.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {   
      userData: {},                        
      isLogged: false
    }
    this.updateUserData = this.updateUserData.bind(this);
  };

  componentDidMount() {
    axios.get('http://localhost:3001/user/verify', {
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({userData: res.data, isLogged: true})
        }
      })
      .catch(e => {console.log(e)})
  }


  updateUserData() { 
    console.log('Updated userData');
    axios.get('http://localhost:3001/user/verify', {
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({userData: res.data, isLogged: true})
        }
      })
      .catch(e => {console.log(e)})
  }

  componentDidUpdate() {
    console.log('Updated component')
  }

  render() {
    return (
      <div className="App">
        {JSON.stringify(this.state)}
        <Router>
          <Navigationbar data={this.state}/>
          <Route exact path="/" component={indexPage} />
          <Route exact path="/login" component={loginPage} updateUserData={this.updateUserData}/>
          <Route exact path="/logout" component={logoutPage} />
        </Router>

      </div>
    );
  }
};