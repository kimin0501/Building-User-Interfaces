function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!

    // TODO: Alert the user of the job that they applied for!
    
    // get the list of radio input elements and initialize the selected job
    const jobRadio = document.getElementsByName('job');
    let selectedJob = '';

    // traverse the list of radio to find the checked job
    for (const job of jobRadio) {
        if (job.checked) {
            selectedJob = job.value; 
            break; 
        }
    }

    // alert the appropriate message
    if (selectedJob) {
        alert("Thank you for applying to be a " + selectedJob + "!");
    } else {
        alert("Please select a job!");
    }

}