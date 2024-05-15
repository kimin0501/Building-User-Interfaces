import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function BadgerRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault(); 

        if (!username || !password) {
            alert("You must provide both a username and password!");
            return;
        }

        if (password !== repeatPassword) {
            alert("Your passwords do not match!");
            return;
        }

    fetch('https://cs571.org/api/s24/hw6/register', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CS571-ID": CS571.getBadgerId()
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    })
    .then(response => response.json().then(data => ({ status: response.status, data })))
    .then(({ status, data }) => {
        if (status === 200) {
            alert("Registration was successful!");
        } else if (status === 409) {
            alert("That username has already been taken!");
        } else {
            alert(data.msg);
        }
    })
    .catch(error => {
        alert(error.message);
    });
};

    const formLayout = (
        <Form onSubmit={handleRegister}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formBasicRepeatPassword">
                <Form.Label htmlFor="repeatPassword">Repeat Password</Form.Label>
                <Form.Control
                    id="repeatPassword"
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    );


    return (
        <Container>
            <Row>
                <Col xs={12} md={6} lg={4}>
                    <h1>Register</h1>
                    {formLayout}
                </Col>
            </Row>
        </Container>
    );
}

