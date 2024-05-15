import React, { useEffect, useState, useContext, useId  } from "react"
import { Col, Row, Container, Pagination, Form, Button } from 'react-bootstrap';
import BadgerMessage from './BadgerMessage'; 
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loginStatus] = useContext(BadgerLoginStatusContext);

    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    
    const postTitleId = useId();
    const postContentId = useId();

    const loadMessages = () => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${currentPage}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages || [])
        })
    };

    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(() => {
        loadMessages();
    }, [props.name, currentPage]); 

    const handlePost = (event) => {
    event.preventDefault();
    if (!loginStatus) {
        alert("You must be logged in to post!");
        return;
    }
    if (!postTitle || !postContent) {
        alert("You must provide both a title and content!");
        return;
    }

    fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: 'include',
            body: JSON.stringify({ title: postTitle, content: postContent })
        })
        .then(response => {
            if (!response.ok) throw new Error(error.message);
            return response.json();
        })
        .then(() => {
            setPostTitle('');
            setPostContent('');
            alert("Successfully posted!");
            loadMessages();
        })
        .catch(error => {
            alert(error.message);
        });
    };

    const handleDelete = (messageId) => {    
        fetch(`https://cs571.org/api/s24/hw6/messages?id=${messageId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
        })
        .then(response => {
            if (!response.ok) {
                
                return response.json().then(json => Promise.reject(json));
            }
            return response.json();
        })
        .then(() => {
            alert("Successfully deleted the post!");
            loadMessages(); 
        })
        .catch(error => {
            const errorMessage = error.msg
            console.error(errorMessage);
            alert(errorMessage);
        });
    };

    const renderMessage = (message) => {  
        return (
            <Col key={message.id} sm={12} md={4} lg={4} xl={4}>
                <BadgerMessage 
                    id={message.id} 
                    title={message.title}
                    poster={message.poster}
                    content={message.content}
                    created={message.created}
                    onDelete={() => handleDelete(message.id)}
                />
            </Col>
        );
    };

    const renderForm = () => (
        loginStatus && (
          <Col md={4}> 
            <Form onSubmit={handlePost}>
              <Form.Group>
                <Form.Label htmlFor={postTitleId}>Post Title</Form.Label>
                <Form.Control id={postTitleId} type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor={postContentId}>Post Content</Form.Label>
                <Form.Control id={postContentId} as="textarea" rows={3} value={postContent} onChange={(e) => setPostContent(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit">Create Post</Button>
            </Form>
          </Col>
        )
      );

    // Function to render pagination
    const renderPagination = () => (
        <Pagination className="justify-content-center my-3">
            {[1, 2, 3, 4].map((page) => (
                <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    );

    return (
        <Container>
          <h1>{props.name} Chatroom</h1>
          <hr />
          <Row>
            {renderForm()}
            <Col md={8}> 
              <Row>
                {messages.length > 0 ? messages.map(renderMessage) : <p>No messages to display.</p>}
              </Row>
            </Col>
          </Row>
          {renderPagination()}
        </Container>
      );
    }