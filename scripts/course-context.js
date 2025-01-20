let currentPage = 1;
const itemsPerPage = 4;

const courseGetUrl = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/courses?api_key=' + API_KEY;

function fetchCourses() {
    fetch(courseGetUrl, {
        method: 'GET',
        headers: {
            'Origin': 'http://cat-facts-api.std-900.ist.mospolytech.ru',
            'X-Requested-With': 'XMLHttpRequest'
        }
        })    
        .then(response => response.json())
        .then(data => {
            renderCourses(data);
            setupPagination(data);
        })
        .catch(error => console.error('Error fetching courses:', error));
}

function renderCourses(courses) {
    const courseContainer = document.getElementById('course-container');
    courseContainer.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedCourses = courses.slice(start, end);

    paginatedCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.classList.add('course-item');

        courseElement.innerHTML = `
            <h3>${course.name}</h3>
            <p><strong>Teacher:</strong> ${course.teacher}</p>
            <p><strong>Level:</strong> ${course.level}</p>
            <p><strong>Total Length:</strong> ${course.total_length} weeks</p>
            <p><strong>Week Length:</strong> ${course.week_length} hours/week</p>
            <p><strong>Course Fee per Hour:</strong> $${course.course_fee_per_hour}</p>
            <p class="description" title="${course.description}">
                <strong>Description:</strong> ${truncateText(course.description, 100)}
            </p>
            <button onclick='getCourseRequest(${JSON.stringify(course)}, null, null)'>Get Course</button>
        `;

        courseContainer.appendChild(courseElement);
    });
}

function setupPagination(courses) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const pageCount = Math.ceil(courses.length / itemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.classList.add('page-link', 'btn', 'btn-light');
        button.innerText = i;
        button.addEventListener('click', () => {
            currentPage = i;
            renderCourses(courses);
        });

        paginationContainer.appendChild(button);
    }
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function handleSearchAndFilter() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const levelFilter = document.getElementById('levelFilter').value;

    fetch(courseGetUrl)
        .then(response => response.json())
        .then(data => {
            const filteredCourses = data.filter(course => {
                const matchesSearch = course.name.toLowerCase().includes(searchQuery) ||
                    course.teacher.toLowerCase().includes(searchQuery);
                const matchesLevel = levelFilter ? course.level === levelFilter : true;
                return matchesSearch && matchesLevel;
            });
            renderCourses(filteredCourses);
            setupPagination(filteredCourses);
        })
        .catch(error => console.error('Error filtering courses:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput').addEventListener('input', handleSearchAndFilter);
    document.getElementById('levelFilter').addEventListener('change', handleSearchAndFilter);

    const levelButtons = [
        { id: 'beginnerBtn', value: 'Beginner' },
        { id: 'intermediateBtn', value: 'Intermediate' },
        { id: 'advancedBtn', value: 'Advanced' }
    ];

    levelButtons.forEach(button => {
        const btnElement = document.getElementById(button.id);
        if (btnElement) {
            btnElement.addEventListener('click', function () {
                document.getElementById('levelFilter').value = button.value;
                handleSearchAndFilter();
            });
        }
    });

    fetchCourses();
});
