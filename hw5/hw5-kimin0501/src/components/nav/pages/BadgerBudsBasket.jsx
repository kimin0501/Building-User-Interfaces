import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext';
  
export default function BadgerBudsBasket() {
    // fetch data using the context
    const budsData = useContext(BadgerBudsDataContext);
    const [savedBuds, setSavedBuds] = useState([]);

    // styles for the card and the image.
    const cardStyle = { width: '100%', marginBottom: '20px' };
    const imgStyle = { height: '400px', objectFit: 'cover', width: '100%' };

    // update the list of saved buds.
    useEffect(() => {
        const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds')) || [];
        const savedBudDetails = budsData.filter(bud => savedCatIds.includes(bud.id));
        setSavedBuds(savedBudDetails);
    }, [budsData]); 

    // function to handle unselecting a bud
    const handleUnselect = (budId) => {
        const newSavedCatIds = savedBuds.filter(bud => bud.id !== budId).map(bud => bud.id);
        sessionStorage.setItem('savedCatIds', JSON.stringify(newSavedCatIds));
        setSavedBuds(prevSavedBuds => prevSavedBuds.filter(bud => bud.id !== budId));
        const budName = budsData.find(bud => bud.id === budId).name;
        
        alert(`${budName} has been removed from your basket!`);
    };

    // function to handle adopting a bud
    const handleAdopt = (id) => {
        const newAdoptedCatIds = [...JSON.parse(sessionStorage.getItem('adoptedCatIds') || '[]'), id];
        sessionStorage.setItem('adoptedCatIds', JSON.stringify(newAdoptedCatIds));
        
        const newSavedCatIds = savedBuds.filter(bud => bud.id !== id).map(bud => bud.id);
        sessionStorage.setItem('savedCatIds', JSON.stringify(newSavedCatIds));
        setSavedBuds(prevSavedBuds => prevSavedBuds.filter(bud => bud.id !== id));

        alert(`Thank you for adopting ${budsData.find(bud => bud.id === id).name}!`);
    };

    // handle No Buds
    if (savedBuds.length === 0) {
        return (
            <div>
                <h1>Badger Buds Basket</h1>
                <p>These cute cats could be all yours!</p>
                <p>You have no buds in your basket!</p>
            </div>
        );
    }

    // mapping through the saved buds to display them
    return (
        <div>
            <h1>Badger Buds Basket</h1>
            <p>These cute cats could be all yours!</p>
            <Row>
                {savedBuds.map(bud => {

                    const imageUrl = `https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${bud.imgIds[0]}`;
                    return (
                        <Col key={bud.id} sm={12} md={6} lg={4} xl={3}>
                            <Card style={cardStyle}>
                                <Card.Img variant="top" src={imageUrl} alt={`A picture of ${bud.name}`} style={imgStyle} />
                                <Card.Body>
                                    <Card.Title>{bud.name}</Card.Title>
                                    <Button variant="secondary" onClick={() => handleUnselect(bud.id)}>Unselect</Button>
                                    <Button variant="primary" onClick={() => handleAdopt(bud.id)}>Adopt</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}