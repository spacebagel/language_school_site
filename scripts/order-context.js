const orderPostUrl = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders?api_key=' + API_KEY;

async function getCourseRequest(course = null, orderData = null, courseId = null) {
    if (courseId !== null) course = await getCourse(courseId);

    const modalHtml = `
        <div class="modal fade" id="courseRequestModal" tabindex="-1" aria-labelledby="courseRequestLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content course">
                    <div class="modal-header">
                        <h5 class="modal-title" id="courseRequestLabel">${orderData ? 'Edit Course Request' : 'Course Request'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="courseRequestForm">
                            <div class="mb-3">
                                <label for="courseName" class="form-label">Course Name</label>
                                <input type="text" class="form-control" id="courseName" value="${course.name}" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="teacherName" class="form-label">Teacher</label>
                                <input type="text" class="form-control" id="teacherName" value="${course.teacher}" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="startDate" class="form-label">Start Date</label>
                                <select class="form-select" id="startDate">
                                    <option value="">Select a date</option>
                                    ${course.start_dates.map(date => `<option value="${date}" ${orderData?.date_start == new Date(date).toISOString().slice(0, 10) ? 'selected' : ''}>${new Date(date).toLocaleDateString()}</option>`).join('')}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="startTime" class="form-label">Start Time</label>
                                <select class="form-select" id="startTime" ${orderData ? '' : 'disabled'}>
                                    <option value="">Select a time</option>
                                    ${orderData?.time_start ? `<option value="${orderData.time_start}" selected>${orderData.time_start}</option>` : ''}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="courseDuration" class="form-label">Course Duration</label>
                                <input type="text" class="form-control" id="courseDuration" value="${course.total_length} weeks" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="numStudents" class="form-label">Number of Students</label>
                                <input type="number" class="form-control" id="numStudents" min="1" max="20" value="${orderData?.persons || 1}">
                            </div>
                            <div class="mb-3">
                                <label>Additional Options</label>
                                <div>
                                    <input type="checkbox" id="supplementary" value="2000" ${orderData?.supplementary ? 'checked' : ''}>
                                    <label for="supplementary">Supply Materials (+2000 per student)</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="personalized" value="1500" ${orderData?.personalized ? 'checked' : ''}>
                                    <label for="personalized">Personalized Sessions (+1500 per week)</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="excursions" value="0.25" ${orderData?.excursions ? 'checked' : ''}>
                                    <label for="excursions">Cultural Excursions (+25%)</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="assessment" value="300" ${orderData?.assessment ? 'checked' : ''}>
                                    <label for="assessment">Language Assessment (+300)</label>
                                </div>
                                <div>
                                    <input type="checkbox" id="interactive" value="1.5" ${orderData?.interactive ? 'checked' : ''}>
                                    <label for="interactive">Interactive Online Platform (x1.5)</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="totalPrice" class="form-label">Total Price</label>
                                <input type="text" class="form-control" id="totalPrice" readonly>
                                <label id="earlyRegistrationLabel" class="hidden bonus-label">✓ Early Registration Bonus</label>
                                <label id="groupEnrollmentLabel" class="hidden bonus-label">✓ Group Enrollment Bonus</label>
                                <label id="intensiveCourseLabel" class="hidden bonus-label">✓ Intensive Course</label>
                            </div>
                            <div class="container text-center">
                                <button type="submit" class="main-wave-button">${orderData ? 'Update' : 'Submit'}</button>
                                <button type="button" class="main-wave-button secondary" data-bs-dismiss="modal">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modalElement = document.getElementById('courseRequestModal');
    const modal = new bootstrap.Modal(modalElement);

    modal.show();

    modalElement.addEventListener('hidden.bs.modal', function () {
        modalElement.remove();
    });

    document.getElementById('startDate').addEventListener('change', function (event) {
        populateTimes(course, event.target.value, course.week_length);
    });

    function calculateTotalPrice() {
        const courseFeePerHour = course.course_fee_per_hour;
        const durationInHours = course.total_length * course.week_length;
        const isWeekendOrHoliday = checkWeekendOrHoliday(document.getElementById('startDate').value);
        const startTime = document.getElementById('startTime').value;

        const startTimeArr = startTime.split(':');
        const startHour = parseInt(startTimeArr[0]);
        const startMinute = parseInt(startTimeArr[1]);
        const endHour = Math.floor((startHour + course.week_length) % 24);
        const endMinute = startMinute + Math.floor((course.week_length * 60) % 60);
        const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

        const morningSurcharge = /^(09|10|11|12)/.test(startTime) ? 400 : 0;
        const eveningSurcharge = (/^(18|19|20)/.test(startTime) || /^(18|19|20)/.test(endTime)) ? 1000 : 0;

        const registrationDate = new Date(document.getElementById('startDate').value);
        const currentDate = new Date();
        const oneMonthInMs = 2_592_000_000; //average milliseconds per month
        const isEarlyRegistration = registrationDate.getTime() > (currentDate.getTime() + oneMonthInMs);

        const studentsNumber = parseInt(document.getElementById('numStudents').value);

        let baseCost = courseFeePerHour * durationInHours * isWeekendOrHoliday;

        let intensiveCourseLabel = document.getElementById('intensiveCourseLabel');
        if (course.week_length > 20) {
            baseCost *= 1.2;
            intensiveCourseLabel.classList.remove("hidden");
        }
        else intensiveCourseLabel.classList.add("hidden");

        let groupEnrollmentLabel = document.getElementById('groupEnrollmentLabel');
        if (studentsNumber >= 5) {
            baseCost *= 0.85;
            groupEnrollmentLabel.classList.remove("hidden");
        }
        else groupEnrollmentLabel.classList.add("hidden");

        let earlyRegistrationLabel = document.getElementById('earlyRegistrationLabel');
        if (isEarlyRegistration) {
            baseCost *= 0.9;
            earlyRegistrationLabel.classList.remove("hidden");
        }
        else earlyRegistrationLabel.classList.add("hidden");

        let totalPrice = baseCost + morningSurcharge + eveningSurcharge;

        totalPrice *= studentsNumber;

        const supplementary = document.getElementById('supplementary').checked ? parseInt(document.getElementById('supplementary').value) * studentsNumber : 0;
        const personalized = document.getElementById('personalized').checked ? parseInt(document.getElementById('personalized').value) * course.total_length : 0;
        const excursions = document.getElementById('excursions').checked ? totalPrice * parseFloat(document.getElementById('excursions').value) : 0;
        const assessment = document.getElementById('assessment').checked ? parseInt(document.getElementById('assessment').value) : 0;
        const interactive = document.getElementById('interactive').checked ? totalPrice * (parseFloat(document.getElementById('interactive').value) - 1) : 0;

        totalPrice += supplementary + personalized + excursions + assessment + interactive;
        document.getElementById('totalPrice').value = totalPrice.toFixed(2) + ' $';
    }

    document.getElementById('courseRequestForm').addEventListener('input', calculateTotalPrice);
    document.getElementById('courseRequestForm').addEventListener('change', calculateTotalPrice);
    document.getElementById('courseRequestForm').addEventListener('submit', formCourseSubmitHandler);

    async function formCourseSubmitHandler(e) {
        console.log();
        e.preventDefault();
        const formData = {
            course_id: course.id,
            date_start: new Date(document.getElementById('startDate').value).toISOString().split("T")[0],
            time_start: document.getElementById('startTime').value,
            duration: course.week_length,
            persons: parseInt(document.getElementById('numStudents').value),
            price: parseInt((document.getElementById('totalPrice').value).substring(0, (document.getElementById('totalPrice').value).indexOf(" "))),
            early_registration: !(document.getElementById('earlyRegistrationLabel').classList.contains("hidden")),
            group_enrollment: !(document.getElementById('groupEnrollmentLabel').classList.contains("hidden")),
            intensive_course: (course.week_length > 20),
            supplementary: document.getElementById('supplementary').checked,
            personalized: document.getElementById('personalized').checked,
            excursions: document.getElementById('assessment').checked,
            assessment: document.getElementById('assessment').checked,
            interactive: document.getElementById('interactive').checked
        };

        try {
            let response = null;
            if (orderData == null) {
                response = await fetch(orderPostUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }
            else {
                response = await fetch(`http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders/${orderData.id}?api_key=${API_KEY}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                fetchOrders();
            }

            if (response.ok) {
                alert(`${orderData ? 'Your request has been updated' : 'Your request has been sent'} successfully!`);
                modal.hide();
                e.target.reset();
            } else {
                console.error('Order POST/PUT error message:', response.status);
            }

        } catch (error) {
            console.error('Order POST/PUT error message:', error);
        }
    }

    calculateTotalPrice();
}

function checkWeekendOrHoliday(dateString) {
    const date = new Date(dateString);
    const day = date.getDay();

    const holidays = [
        '01-01',
        '01-02',
        '01-03',
        '01-04',
        '01-05',
        '01-06',
        '01-07',
        '01-08',
        '02-23',
        '03-08',
        '05-01',
        '05-09',
        '06-12',
        '11-04',
    ];

    const monthDay = date.toISOString().slice(5, 10);

    if (day === 0 || day === 6) return 1.5;
    if (holidays.includes(monthDay)) return 1.5;

    return 1;
}

function populateTimes(course, selectedDate, weekLength) {
    const startTimeSelect = document.getElementById('startTime');
    startTimeSelect.innerHTML = '<option value="">Select a time</option>';
    startTimeSelect.disabled = !selectedDate;

    if (selectedDate) {
        const times = course.start_dates.filter(date => date.startsWith(selectedDate)).map(date => {
            const startTime = new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTime = new Date(new Date(date).getTime() + weekLength * 3_600_000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `<option value="${startTime}">${startTime} - ${endTime}</option>`;
        });

        startTimeSelect.innerHTML += times.join('');
    }
}

async function getCourse(courseID) {
    const courseGetUrl = `http://cat-facts-api.std-900.ist.mospolytech.ru/api/courses/${courseID}?api_key=${API_KEY}`;
    try {
        const response = await fetch(courseGetUrl);
        if (response.ok) {
            const courseData = await response.json();
            return courseData;
        } else if (response.status === 404) {
            console.error(`Course with ID ${courseID} not found.`);
            return 'Course not found';
        } else {
            throw new Error(`Error fetching course data: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        return 'Error fetching course name';
    }
}