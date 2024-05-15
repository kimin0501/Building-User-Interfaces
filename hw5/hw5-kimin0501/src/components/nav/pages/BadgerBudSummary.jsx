import React, { useState } from 'react';
import { Button, Card, Carousel } from 'react-bootstrap';

// styles for the card and the image
const cardStyle = { marginBottom: '2rem', width: '100%'};  
const imgStyle = { height: '400px', objectFit: 'cover', width: '100%'};
  
const BadgerBudSummary = ({ bud, saveCat }) => {
    
    // URL for the cat's image
    const imageUrls = bud.imgIds.map(
        (imgId) => `https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${imgId}`
      );
    
    // initialize 'showDetails' state
    const [showDetails, setShowDetails] = useState(false);

    // initialize 'activeIndex' state 
    const [activeIndex, setActiveIndex] = useState(0);
    
    // function to control when a user selects a slide
    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    // define buttonText based on showDetails state
    let buttonText;
    if (showDetails) {
        buttonText = 'Show Less';
    } else {
        buttonText = 'Show More';
    }
    
    // function to handle the 'showDetails' state
    const handleShowMore = () => {
        setShowDetails(!showDetails);
    };
    
    // function for "Save" button
    const handleSave = () => {
        saveCat(bud.id, bud.name);
    };
    
    // renders a cat card with image carousel 
    return (
        <Card style={cardStyle}>
          {showDetails ? (
            <Carousel 
              activeIndex={activeIndex} 
              onSelect={handleSelect} 
            >
              {imageUrls.map((url, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100"
                    src={url}
                    alt={`Slide ${idx + 1}`}
                    style={imgStyle}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Card.Img
              variant="top"
              src={imageUrls[0]}
              alt={`A picture of ${bud.name}`}
              style={imgStyle}
            />
          )}
          <Card.Body>
            <Card.Title>{bud.name}</Card.Title>
            {showDetails && (
              <>
                <Card.Text>{bud.gender}</Card.Text>
                <Card.Text>{bud.breed}</Card.Text>
                <Card.Text>{bud.age}</Card.Text>
                {bud.description && <Card.Text>{bud.description}</Card.Text>}
              </>
            )}
            <Button variant="secondary" onClick={handleShowMore}>
              {buttonText}
            </Button>
            <Button variant="success" onClick={handleSave}>Save</Button>
          </Card.Body>
        </Card>
      );
    };
    
    export default BadgerBudSummary;