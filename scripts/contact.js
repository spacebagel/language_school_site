function sendMessageForm() {
    const tutorRequestForm = document.getElementById('contact-form');
    tutorRequestForm.onsubmit = formSubmitHandler;

    function formSubmitHandler(e) {
        e.preventDefault();

        // I shouldn't implement it.

        alert('Your message has been sent successfully!');
        e.target.reset();
    }
}

sendMessageForm();