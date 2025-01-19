let currentPage = 1;
const itemsPerPage = 4;
const orderGetUrl = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders?api_key=' + API_KEY;
async function fetchOrders() {
    try {
        const response = await fetch(orderGetUrl);
        const data = await response.json();

        renderOrders(data);
        setupOrderPagination(data);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function renderOrders(orders) {
    const ordersTableBody = document.getElementById('orders-table-body');
    ordersTableBody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedOrders = orders.slice(start, end);

    paginatedOrders.forEach(order => {
        const row = document.createElement('tr');

        const orderNumberCell = document.createElement('td');
        orderNumberCell.textContent = '#' + order.id;
        row.appendChild(orderNumberCell);

        const courseNameCell = document.createElement('td');
        courseNameCell.textContent = 'Loading...'; // Placeholder while fetching course name
        getCourseName(order.course_id).then(courseName => {
            courseNameCell.textContent = courseName !== 'Course not found' && courseName !== 'Error fetching course name' ? courseName : 'N/A';
        });
        row.appendChild(courseNameCell);

        const sessionDateCell = document.createElement('td');
        const sessionDate = new Date(order.date_start);
        sessionDateCell.textContent = sessionDate.toLocaleDateString();
        row.appendChild(sessionDateCell);

        const totalCostCell = document.createElement('td');
        totalCostCell.textContent = '$' + order.price;
        row.appendChild(totalCostCell);

        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <button onclick="getMoreOrderInfo(${order.id})" class="action-btn"><svg class="action-button-svg info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></g></svg></button>
            <button class="action-btn"><svg class="action-button-svg edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1l1-4l9.5-9.5z"/></g></svg></button>
            <button onclick="deleteOrder(${order.id})" class="action-btn"><svg class="action-button-svg delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94z"/></svg></button>
        `;
        row.appendChild(actionsCell);

        ordersTableBody.appendChild(row);
    });
}

function setupOrderPagination(orders) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const pageCount = Math.ceil(orders.length / itemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.classList.add('page-link', 'btn', 'btn-light');
        button.innerText = i;
        button.addEventListener('click', () => {
            currentPage = i;
            renderOrders(orders);
        });

        paginationContainer.appendChild(button);
    }
}

function getMoreOrderInfo(orderId) {
    fetch(`http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders/${orderId}?api_key=0c1b2740-c0ae-4d9b-8a39-8e26286c824d`)
      .then(response => response.json())
      .then(data => {
        const modalBody = document.getElementById('order-modal-container');

        modalBody.innerHTML = `
          <p class="my-0"><b>Id:</b> ${data.id}</p>
          <p class="my-0"><b>Duration:</b> ${data.duration} days</p>
          <p class="my-0"><b>Persons:</b> ${data.persons}</p>
          <p class="my-0"><b>Price:</b> ${data.price} RUB</p>
          <p class="my-0"><b>Supplementary:</b> ${data.supplementary}</p>
          <p class="my-0"><b>Early Registration:</b> ${data.earlyRegistration}</p>
          <p class="my-0"><b>Group Enrollment:</b> ${data.groupEnrollment}</p>
          <p class="my-0"><b>Intensive Course:</b> ${data.intensiveCourse}</p>
          <p class="my-0"><b>Personalized:</b> ${data.personalized}</p>
          <p class="my-0"><b>Excursions:</b> ${data.excursions}</p>
          <p class="my-0"><b>Assessment:</b> ${data.assessment}</p>
          <p class="my-0"><b>Interactive:</b> ${data.interactive}</p>
          <p class="my-0"><b>Tutor ID:</b> ${data.tutor_id}</p>
          <p class="my-0"><b>Course ID:</b> ${data.course_id}</p>
          <p class="my-0"><b>Start Date:</b> ${data.date_start}</p>
          <p class="my-0"><b>Start Time:</b> ${data.time_start}</p>
          <p class="my-0"><b>Early Registration Flag:</b> ${data.early_registration}</p>
          <p class="my-0"><b>Group Enrollment Flag:</b> ${data.group_enrollment}</p>
          <p class="my-0"><b>Student ID:</b> ${data.student_id}</p>
          <p class="my-0"><b>Created At:</b> ${data.created_at}</p>
          <p class="my-0"><b>Updated At:</b> ${data.updated_at}</p>
        `;
        showModal('orderModal');
      })
      .catch(error => {
        console.error('Error fetching order data:', error);
      });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        document.body.removeChild(backdrop);
    }
}

async function getCourseName(courseID) {
    const courseGetUrl = `http://cat-facts-api.std-900.ist.mospolytech.ru/api/courses/${courseID}?api_key=${API_KEY}`;
    try {
        const response = await fetch(courseGetUrl);
        if (response.ok) {
            const courseData = await response.json();
            return courseData.name;
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

function deleteOrder(orderID) {
    const orderDeleteUrl = `http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders/${orderID}?api_key=0c1b2740-c0ae-4d9b-8a39-8e26286c824d`;

    fetch(orderDeleteUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log(`Order ${orderID} has been deleted.`);
                fetchOrders();
            } else {
                console.error(`Error deleting order ${orderID}: ${response.status} - ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error(`Error deleting order ${orderID}: ${error}`);
        });
}

window.onload = function () {
    fetchOrders();
};