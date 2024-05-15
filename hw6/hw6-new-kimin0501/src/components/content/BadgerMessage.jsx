import React from "react"
import { Card, Button } from "react-bootstrap";

function BadgerMessage(props) {

    const dt = new Date(props.created);

        const loginStatus = sessionStorage.getItem("isLoggedIn") === "true";
        const currentUser = sessionStorage.getItem("loggedInUser");
    
        const canDelete = loginStatus && (props.poster === currentUser);
    
        const handleDeleteClick = () => {
            props.onDelete();
        };

    return <Card style={{margin: "0.5rem", padding: "0.5rem"}}>
        <h2>{props.title}</h2>
        <sub>Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</sub>
        <br/>
        <i>{props.poster}</i>
        <p>{props.content}</p>
        {canDelete && (
            <Button variant="danger" onClick={handleDeleteClick}>Delete</Button>
        )}

    </Card>
}

export default BadgerMessage;

