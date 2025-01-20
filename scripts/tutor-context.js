let currentTutorPage = 1;
const tutorsPerPage = 4;

const tutorGetUrl = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/tutors?api_key='  + API_KEY;

function fetchTutors() {
    fetch(tutorGetUrl, {
        method: 'GET',
        headers: {
            'Origin': 'http://cat-facts-api.std-900.ist.mospolytech.ru',
            'X-Requested-With': 'XMLHttpRequest'
        }
        })
        .then(response => response.json())
        .then(data => {
            renderTutors(data);
            setupTutorPagination(data);
        })
        .catch(error => console.error('Error fetching tutors:', error));
}

function renderTutors(tutors) {
    const tutorContainer = document.getElementById('tutor-container');
    tutorContainer.innerHTML = '';

    const start = (currentTutorPage - 1) * tutorsPerPage;
    const end = start + tutorsPerPage;
    const paginatedTutors = tutors.slice(start, end);

    paginatedTutors.forEach(tutor => {
        const tutorElement = document.createElement('div');
        tutorElement.classList.add('tutor-item');

        tutorElement.innerHTML = `
            <h3>${tutor.name}</h3>
            <p><strong>Work Experience:</strong> ${tutor.work_experience} years</p>
            <p><strong>Languages Spoken:</strong> ${tutor.languages_spoken.join(', ')}</p>
            <p><strong>Languages Offered:</strong> ${tutor.languages_offered.join(', ')}</p>
            <p><strong>Language Level:</strong> ${tutor.language_level}</p>
            <p><strong>Price per Hour:</strong> $${tutor.price_per_hour}</p>
            <p><strong>Created At:</strong> ${new Date(tutor.created_at).toLocaleDateString()}</p>
            <p><strong>Updated At:</strong> ${new Date(tutor.updated_at).toLocaleDateString()}</p>
            <button onclick="getMoreTutorInfo()">Send Message</button>
        `;

        tutorContainer.appendChild(tutorElement);
    });
}

function setupTutorPagination(tutors) {
    const paginationContainer = document.getElementById('tutor-pagination-container');
    paginationContainer.innerHTML = '';

    const pageCount = Math.ceil(tutors.length / itemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.classList.add('page-link', 'btn', 'btn-light');
        button.innerText = i;
        button.addEventListener('click', () => {
            currentTutorPage = i;
            renderTutors(tutors);
        });

        paginationContainer.appendChild(button);
    }
}

function handleTutorFilter() {
    const qualificationFilter = document.getElementById('qualificationFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;

    fetch(tutorGetUrl)
        .then(response => response.json())
        .then(data => {
            const filteredTutors = data.filter(tutor => {
                const matchesQualification = qualificationFilter ? tutor.language_level === qualificationFilter : true;
                const matchesExperience = experienceFilter ? tutor.work_experience === parseInt(experienceFilter) : true;
                return matchesQualification && matchesExperience;
            });
            renderTutors(filteredTutors);
            setupTutorPagination(filteredTutors);
        })
        .catch(error => console.error('Error filtering tutors:', error));
}

function getMoreTutorInfo() {
    const modalContainer = document.getElementById('tutor-modal-container');
    modalContainer.classList.remove('hidden');
    modalContainer.classList.add('modal');
    const closeModal = document.getElementById('close-tutor-modal');
    const tutorRequestForm = document.getElementById('tutor-request-form');

    closeModal.onclick = closeModalHandler;
    tutorRequestForm.onsubmit = formSubmitHandler;

    function closeModalHandler() {
        modalContainer.classList.remove('modal');
        modalContainer.classList.add('hidden');
        closeModal.onclick = null;
        tutorRequestForm.onsubmit = null;
    }

    function formSubmitHandler(e) {
        e.preventDefault();

        // There isn't API method for this function (send message "for a tutor") 
        // that implies feedback from the operator, and I shouldn't implement it.

        alert('Your request has been sent successfully!');
        closeModalHandler();
        e.target.reset();
    }
}

function fillExperienceFilter() {
    fetch(tutorGetUrl)
        .then(response => response.json())
        .then(data => {
            const uniqueExperiences = [...new Set(data.map(tutor => tutor.work_experience))];
            const experienceFilter = document.getElementById('experienceFilter');
            uniqueExperiences.sort((a, b) => a - b).forEach(exp => {
                const option = document.createElement('option');
                option.value = exp;
                option.innerText = `${exp} years`;
                experienceFilter.appendChild(option);
            });
        })
        .catch(error => console.error('Error populating experience filter:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('qualificationFilter').addEventListener('change', handleTutorFilter);
    document.getElementById('experienceFilter').addEventListener('change', handleTutorFilter);

    fillExperienceFilter();
    fetchTutors();
});
