import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogout() {
    const navigate = useNavigate();
    const [, setLoginStatus] = useContext(BadgerLoginStatusContext);

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        }).then(res => res.json()).then(json => {
            alert("You have been successfully logged out!");
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("loggedInUser");
            setLoginStatus(false);
            navigate('/');
        }).catch((error) => {
            alert(error.message);
        });
    }, [setLoginStatus, navigate]);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
