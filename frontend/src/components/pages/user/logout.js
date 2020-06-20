import React from "react";
import axios from 'axios';

export default class login extends React.Component {
    componentDidMount() {
        axios.get('http://localhost:3001/user/logout', {
            withCredentials: true
        })
            .then(res => {
                console.log(res);
                window.location.href = "/";
            })
            .catch(e => {
                console.log(e);
                window.location.href = "/login";
                
            })
    }
    render() {
        return <React.Fragment>Logging out...</React.Fragment>
    }
    
};