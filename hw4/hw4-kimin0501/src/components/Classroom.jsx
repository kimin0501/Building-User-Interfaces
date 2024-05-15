import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";
import Student from './Student';

const Classroom = () => {
    // state variables for managing student data
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchMajor, setSearchMajor] = useState('');
    const [searchInterest, setSearchInterest] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(24);

    // fetch student data
    useEffect(() => {       
        const badgerID = 'bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa';
        fetch('https://cs571.org/api/s24/hw4/students', {
            method: 'GET',
            headers: {
                "X-CS571-ID": badgerID
            }
        })
        .then(res => res.json())
        .then(data => {
            setStudents(data);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    // implement search functionality
    useEffect(() => {
        const filterStudents = () => {
        // create an object with lowercase and trimmed search terms 
        const searchFilters = {
            name: searchName.toLowerCase().trim(),
            major: searchMajor.toLowerCase().trim(),
            interest: searchInterest.toLowerCase().trim()
        }; 
        // filter students to include matching terms
        const filtered = students.filter(({name, major, interests}) => {
            const fullName = `${name.first} ${name.last}`.toLowerCase();
            return (
              (!searchFilters.name || fullName.includes(searchFilters.name)) &&
              (!searchFilters.major || major.toLowerCase().includes(searchFilters.major)) &&
              (!searchFilters.interest || interests.some(interest => interest.toLowerCase().includes(searchFilters.interest)))
            );
        });
        setFilteredStudents(filtered);
        };
        filterStudents();
    }, [searchName, searchMajor, searchInterest, students]);

    // update current page
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // state variables for managing pagination
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    // create pagination button by traversing
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredStudents.length / studentsPerPage); i++) {
        pageNumbers.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageClick(i)}>
                {i}
            </Pagination.Item>
        );
    }

    // handle input fields states
    const handleSearchName = (e) => setSearchName(e.target.value);
    const handleSearchMajor = (e) => setSearchMajor(e.target.value);
    const handleSearchInterest = (e) => setSearchInterest(e.target.value);
    
    // reset the search state
    const resetSearch = () => {
        setSearchName('');
        setSearchMajor('');
        setSearchInterest('');
        setFilteredStudents(students);
        setCurrentPage(1);
    };
    
    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control id="searchName" value={searchName} onChange={handleSearchName}/>
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control id="searchMajor" value={searchMajor} onChange={handleSearchMajor}/>
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control id="searchInterest" value={searchInterest} onChange={handleSearchInterest}/>
        <br />
            <Button variant="neutral" onClick={resetSearch}>Reset Search</Button>
        </Form>
        <p>There are {filteredStudents.length} student(s) matching your search.</p>
        <Pagination>
            <Pagination.Prev onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} />
            {pageNumbers}
            <Pagination.Next onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === pageNumbers.length} />
        </Pagination>
            <Container fluid>
        <Row>
            {currentStudents.map((student) => (
            <Col xs={12} sm={12} md={6} lg={4} xl={3} key={student.id}> 
                <Student {...student}/>
            </Col>
            ))}
        </Row>
        </Container>
    </div>
}

export default Classroom;