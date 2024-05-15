const Student = (props) => {   
    let wisconsinStatus;

    if (props.fromWisconsin) {
        wisconsinStatus = "from Wisconsin";
    } else {
        wisconsinStatus = "NOT from Wisconsin";
    }

    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        {/* TODO Student data goes here! */}
        <p><strong>{props.major}</strong> </p>
        <p>{props.name.first} is taking {props.numCredits} credits and is {wisconsinStatus}.</p>
        <p>They have {props.interests.length} interests including...</p>
        <ul>
            {props.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
            ))}
        </ul>
    </div>
}

export default Student;

