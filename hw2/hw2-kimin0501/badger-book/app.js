// sets the URL of the API website
const url = 'https://cs571.org/api/s24/hw2/students';

// initializes an empty list to store the data from the API
let studentData = [];

// fetch data from the API
fetch(url, {
	method: 'GET',
	headers: {
		"X-CS571-ID": 'bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa'
	}
})
.then(response => response.json())
.then(data => {
	// process the API response
	studentData = data;
	console.log(data);
	// Show # of Students
	document.getElementById("num-results").innerText = data.length;
	buildStudents(data);
})
.catch(error => {console.error(error)})


function buildStudents(data) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.
	
	// store and the student information to display
	const student_html = document.getElementById('students');

	// clear the student information
	student_html.innerHTML = ''
	
	// traverse through data to display each student information
	for (const student of data) {
        // Responsive Design
		const student_styling = document.createElement('div');
        student_styling.className = 'col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 student-info';

		// student first & last name
        const student_name = document.createElement('h3');
        student_name.innerText = `${student.name.first} ${student.name.last}`;
        student_styling.appendChild(student_name);

		// studnet major
        const student_major = document.createElement('h6');
        student_major.innerText = student.major;
        student_styling.appendChild(student_major);

		// student from Wisconsin or not + number of credits
        const student_from_wisc = document.createElement('p');
        let fromWisconsinText = 'from Wisconsin.';
		if (!student.fromWisconsin) {
    		fromWisconsinText = 'not from Wisconsin.';
		}
		student_from_wisc.innerText = `${student.name.first} is taking ${student.numCredits} credits and is ${fromWisconsinText}`;
		student_styling.appendChild(student_from_wisc);

		// student interests number
		const student_interests_num = document.createElement('p');
		student_interests_num.innerText = `They have ${student.interests.length} interests including...`;
		student_styling.appendChild(student_interests_num);

		// student interests list
        const student_interests_list = document.createElement('ul');
		for (const interest of student.interests) {
            const interestItem = document.createElement('li');
            interestItem.innerText = interest;
            student_interests_list.appendChild(interestItem);
        }
        student_styling.appendChild(student_interests_list);
		
		// append student styling elements to student html
		student_html.appendChild(student_styling);
	}
}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	// TODO Implement the search

	// gets the value entered in the input field 
	const name_search = document.getElementById('search-name').value.trim().toLowerCase();
	const major_search = document.getElementById('search-major').value.trim().toLowerCase();
	const interest_search = document.getElementById('search-interest').value.trim().toLowerCase();

	// search the student with given input matched by filter method
	const filtered_data = studentData.filter(student => {
		// converts the student data into more flexible search format
		const name_data = `${student.name.first} ${student.name.last}`.toLowerCase();
		const major_data = student.major.toLowerCase();
		const interests_data = student.interests.join(' ').toLowerCase(); 

		// find the student with the given input included
		const name_match = name_data.includes(name_search);
		const major_match = major_data.includes(major_search);
		const interest_match = interests_data.includes(interest_search);
		
		return (name_match && major_match && interest_match);
	});
	
	// update and display the number of filtered students
	document.getElementById("num-results").innerText = `${filtered_data.length}`;
	
	buildStudents(filtered_data);
}



document.getElementById("search-btn").addEventListener("click", handleSearch);