import React, { useRef, useContext, useId } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogin() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [ , setLoginStatus] = useContext(BadgerLoginStatusContext);

    const usernameId = useId();
    const passwordId = useId();

    const handleLogin = (event) => {
        event.preventDefault();

        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        if (!username || !password) {
            alert("You must provide both a username and password!");
            return;
        }

        fetch('https://cs571.org/api/s24/hw6/login', { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        })  .then(response => {
            if (!response.ok && (response.status === 400 || response.status === 401)) {
                alert('Incorrect username or password!'); 
                return; 
            }
            if (response.ok) {
                return response.json();
            }
            throw new Error(data.msg); 
        })
        .then(data => {
            if (data.user) {
                alert("Login was successful!"); 
                setLoginStatus(true);
                sessionStorage.setItem("isLoggedIn", true);
                sessionStorage.setItem("loggedInUser", data.user.username);
                navigate('/');
            }
        })
        .catch(error => {
            alert(error.message);
        });
    };

    return (
        <Container>
            <h1>Login</h1>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label htmlFor={usernameId}>Username</Form.Label> 
                    <Form.Control 
                        id={usernameId} 
                        type="text" 
                        placeholder="Enter username" 
                        ref={usernameRef} />
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor={passwordId}>Password</Form.Label> 
                    <Form.Control 
                        id={passwordId} 
                        type="password" 
                        placeholder="Password" 
                        ref={passwordRef} />
                </Form.Group>

                <Button 
                    variant="primary" 
                    type="submit">
                    Login
                </Button>
            </Form>
        </Container>
    );
}