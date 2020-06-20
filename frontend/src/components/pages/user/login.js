import React from "react";
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import  { Redirect } from 'react-router-dom'

export default class login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {   
            username: '',                        
            password: '',
            redirect: false,
            isLogged: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }
    handleSubmit(event) {
        axios.post('http://localhost:3001/user/login', {
            username: this.state.username,
            password: this.state.password
        }, {
            withCredentials: true
        })
            .then(res => {
                console.log(res);
                window.location.href = "/";
            })
        event.preventDefault();
    };


    render() {
        if (this.state.redirect || this.props.isLogged) return <Redirect to="/" /> 
        else return(<React.Fragment>
            <Button onClick = {() => {console.log('clicked');this.props.updateUserData()}} />
            <Container>
                <h2>login page</h2>
                <Form onSubmit={this.handleSubmit}> 
                    <Row>
                        <Col>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" name="username" placeholder="Enter username" value={this.state.username} onChange={this.handleChange} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Enter password" value={this.state.password} onChange={this.handleChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="dark" type="submit" onPress={this.props.updateUserData}>Submit</Button>
                </Form>
            </Container>
        </React.Fragment>);
    };
};