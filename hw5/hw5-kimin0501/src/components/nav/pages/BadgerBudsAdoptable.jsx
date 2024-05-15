import React, { useContext, useState, useEffect } from 'react';
import BadgerBudSummary from './BadgerBudSummary'; 
import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext';
import { Row, Col } from 'react-bootstrap';

export default function BadgerBudsAdoptable() {
    // fetch data using the context
    const data = useContext(BadgerBudsDataContext);
    
    // state for managing available and saved buds
    const [availableBuds, setAvailableBuds] = useState([]);
    const [savedBuds, setSavedBuds] = useState(JSON.parse(sessionStorage.getItem('savedCatIds') || "[]"));
    
    // declare a list of adopted cat ID
    const adoptedBudsList = JSON.parse(sessionStorage.getItem("adoptedCatIds")) || [];

    // update the list of available cats
    useEffect(() => {
        setAvailableBuds(data.filter(bud => !savedBuds.includes(bud.id) && !adoptedBudsList.includes(bud.id)));
    }, [data, savedBuds, adoptedBudsList]);

    // function for "Save" button
    const handleSave = (id, name) => {
        if (!savedBuds.includes(id) && !adoptedBudsList.includes(id)) {
            const newSavedCatIds = [...savedBuds, id];
            setSavedBuds(newSavedCatIds);
            sessionStorage.setItem('savedCatIds', JSON.stringify(newSavedCatIds));
            alert(`${name} has been added to your basket!`);
        }
    };

    // function for "Adopt" button
    const handleAdopt = (id, name) => {
        if (!adoptedBudsList.includes(id)) {
            const newAdoptedCatIds = [...adoptedBudsList, id];
            sessionStorage.setItem('adoptedCatIds', JSON.stringify(newAdoptedCatIds));
            setAvailableBuds(prevBuds => prevBuds.filter(bud => bud.id !== id));
            alert(`${name} has been adopted!`);
        }
    };

    // handle No Buds
    if (availableBuds.length === 0) {
        return (
            <div>
                <h1>Available Badger Buds</h1>
                <p>The following cats are looking for a loving home! Could you help?</p>
                <p>No buds are available for adoption!</p>
            </div>
        );
    }

    // render available buds for adoption
    return <div>
    <h1>Available Badger Buds</h1>
    <Row>
        {availableBuds.map(bud => (
            <Col sm={12} md={6} lg={4} xl={3} key={bud.id}>
                <BadgerBudSummary bud={bud} saveCat={handleSave} adoptCat={handleAdopt} />
            </Col>
        ))}
    </Row>
</div>;
}