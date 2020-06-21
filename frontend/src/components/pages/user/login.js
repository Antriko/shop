import React, { useContext } from "react";
import { UserContext } from "../../../userContext";
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import  { Redirect } from 'react-router-dom';
import { useFormFields } from './formField';


const Login = () => {
    const { user } = useContext(UserContext);

    const [form, setForm] = useFormFields({
        username: "",
        password: ""
    });

    async function handleSubmit(event) {
        axios.post('http://localhost:3001/user/login', {
         username: form.username,
         password: form.password
        }, {
            withCredentials: true
        })
            .then(() => window.location.href = "/")
        event.preventDefault();
    }

    if (user.isLogged) return <Redirect to="/" /> 
        else return(<React.Fragment>
            <Container>
                <h2>login page</h2>
                {JSON.stringify(user)}
                <Form onSubmit={handleSubmit}> 
                    <Row>
                        <Col>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="username" name="username" placeholder="Enter username" value={form.username} onChange={setForm}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Enter password" value={form.password} onChange={setForm}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="dark" type="submit">Submit</Button>
                </Form>
            </Container>
        </React.Fragment>);
};

export default Login;