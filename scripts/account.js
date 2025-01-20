let currentOrderPage = 1;
const orderItemsPerPage = 4;
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

    const start = (currentOrderPage - 1) * orderItemsPerPage;
    const end = start + orderItemsPerPage;
    const paginatedOrders = orders.slice(start, end);

    paginatedOrders.forEach(order => {
        const row = document.createElement('tr');

        const orderNumberCell = document.createElement('td');
        orderNumberCell.textContent = '#' + order.id;
        row.appendChild(orderNumberCell);

        const courseNameCell = document.createElement('td');
        courseNameCell.textContent = 'Loading...'; // Placeholder while fetching course name
        getCourse(order.course_id).then(courseData => {
            const courseName = courseData.name !== 'Course not found' && courseData.name !== 'Error fetching course name' ? courseData.name : 'N/A';
            courseNameCell.textContent = courseName;
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
            <button onclick="getCourseRequest(null, ${JSON.stringify(order).replace(/"/g, '&quot;')}, ${order.course_id})" class="action-btn"><svg class="action-button-svg edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1l1-4l9.5-9.5z"/></g></svg></button>
            <button onclick="deleteOrder(${order.id})" class="action-btn"><svg class="action-button-svg delete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94z"/></svg></button>
        `;
        row.appendChild(actionsCell);

        ordersTableBody.appendChild(row);
    });
}

function setupOrderPagination(orders) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const pageCount = Math.ceil(orders.length / orderItemsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.classList.add('page-link', 'btn', 'btn-light');
        button.innerText = i;
        button.addEventListener('click', () => {
            currentOrderPage = i;
            renderOrders(orders);
        });

        paginationContainer.appendChild(button);
    }
}

function getMoreOrderInfo(orderId) {
    fetch(`http://cat-facts-api.std-900.ist.mospolytech.ru/api/orders/${orderId}?api_key=0c1b2740-c0ae-4d9b-8a39-8e26286c824d`)
        .then(response => response.json())
        .then(order => {
            const modalBody = document.getElementById('order-modal-container');

            modalBody.innerHTML = `
          <p class="my-0"><b>Id:</b> ${order.id}</p>
          <p class="my-0"><b>Duration:</b> ${order.duration} days</p>
          <p class="my-0"><b>Persons:</b> ${order.persons}</p>
          <p class="my-0"><b>Price:</b> ${order.price} RUB</p>
          <p class="my-0"><b>Supplementary:</b> ${order.supplementary}</p>
          <p class="my-0"><b>Early Registration:</b> ${order.earlyRegistration}</p>
          <p class="my-0"><b>Group Enrollment:</b> ${order.groupEnrollment}</p>
          <p class="my-0"><b>Intensive Course:</b> ${order.intensiveCourse}</p>
          <p class="my-0"><b>Personalized:</b> ${order.personalized}</p>
          <p class="my-0"><b>Excursions:</b> ${order.excursions}</p>
          <p class="my-0"><b>Assessment:</b> ${order.assessment}</p>
          <p class="my-0"><b>Interactive:</b> ${order.interactive}</p>
          <p class="my-0"><b>Tutor ID:</b> ${order.tutor_id}</p>
          <p class="my-0"><b>Course ID:</b> ${order.course_id}</p>
          <p class="my-0"><b>Start Date:</b> ${order.date_start}</p>
          <p class="my-0"><b>Start Time:</b> ${order.time_start}</p>
          <p class="my-0"><b>Early Registration Flag:</b> ${order.early_registration}</p>
          <p class="my-0"><b>Group Enrollment Flag:</b> ${order.group_enrollment}</p>
          <p class="my-0"><b>Student ID:</b> ${order.student_id}</p>
          <p class="my-0"><b>Created At:</b> ${order.created_at}</p>
          <p class="my-0"><b>Updated At:</b> ${order.updated_at}</p>
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