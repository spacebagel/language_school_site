# 📝 Russian language school site - Exam task 
**Problem description:** develop a website for a language school where international students can make request to learn Russian in courses or with a tutor.

**Recommended stack:** HTML, CSS, JS, Bootstrap.

## 📃 Description

### *---HTTP requests don't work on modern hosting services, including Github Pages---*

### Main Page
The main page provides a brief overview of the language school, highlighting the advantages of learning the Russian language. It includes a link to the placement test to assess the user's proficiency in Russian. The page features functional buttons for filtering the list of courses by proficiency level, displaying available courses with options for selection. Additionally, it showcases accessible instructors and includes an interactive map with thematic locations related to Russian language schools.

![Main Page](https://github.com/user-attachments/assets/a46d571f-26b4-46f0-965a-ee14e6cc5c65)

![Main Page](https://github.com/user-attachments/assets/212977ae-33ff-480d-b95c-85894e06735b)

![Main Page](https://github.com/user-attachments/assets/d6407ef5-06fa-47c8-bfcd-6e2b488063d5)

![Main Page](https://github.com/user-attachments/assets/cb28bfba-cb00-48bd-b566-a83dd424653b)

The enrollment form allows users to select a course, along with the desired date and time for their sessions. It dynamically calculates the total cost, taking into account bonuses, additional options, and promotions. 

![Cet Course Form](https://github.com/user-attachments/assets/0dea2953-3c04-41a9-8161-56149b3913ba)

![Send Message Form](https://github.com/user-attachments/assets/fe2a93c8-e00e-46b4-b946-c82af0a0051b)

### Placment Test Page
The placement test, available in Russian, consists of 15 questions. The answers help determine the user's proficiency level, enabling the system to suggest the most appropriate course based on their skills.

![Placment Test](https://github.com/user-attachments/assets/430ad57e-2221-49d9-9cb6-ff71412cca68)

![Placment Test Result](https://github.com/user-attachments/assets/afe0f395-0557-4479-a4c0-40c984b96b55)

### About Page
This page introduces the mission, values, and history of RuWave. It highlights the goal of breaking language barriers and making Russian language and culture accessible to learners around the world.

![About Page](https://github.com/user-attachments/assets/6d8a2b26-e8d6-44fc-82a5-4d0a364b7df6)

![About Page](https://github.com/user-attachments/assets/a49bc85c-4e1a-4840-b813-33748424d1e3)

![About Page](https://github.com/user-attachments/assets/469b18a4-015f-4f29-9576-b3fa8a34486f)

### Account Page
This page is designed to manage course applications and study requests with tutors. It provides an overview of the user's orders, including the course name, session date, total cost, and actions available for each order. Users can view and track their requests, and interact with them by taking actions like modifying or canceling an order.

![Account Page](https://github.com/user-attachments/assets/7f9d0c4a-4e6a-4056-8b8b-eedea5692240)

![Account Page Order Info](https://github.com/user-attachments/assets/2b265001-713a-4711-819b-4d60806c606e)

### Mobile version

![Mobile Version](https://github.com/user-attachments/assets/ac004f0b-bfa7-4f66-8625-ea88d2d5fdf3)

![Mobile Version](https://github.com/user-attachments/assets/f40ae90c-63cd-4c84-8ef0-b592ce25bfd5)

![Mobile Version](https://github.com/user-attachments/assets/37a482b9-5db2-49a8-a20f-71a40f3e7d8d)

![Mobile Version](https://github.com/user-attachments/assets/1f1179d9-cebf-4c00-8741-c6c028cc49ef)


## 💾 Data
### Tutor
Example of **Tutor** GET-request JSON-data:
```JSON
{
    "id": 1,
    "name": "Irina Petrovna",
    "work_experience": 5,
    "languages_spoken": [
        "English",
        "Spanish",
        "Russian"
    ],
    "languages_offered": [
        "Russian",
        "English"
    ],
    "language_level": "Advanced",
    "price_per_hour": 500,
    "created_at": "2025-01-10T14:02:06.176121072",
    "updated_at": "2025-01-10T14:02:06.176134771"
}
```
**Tutor** data description:
| Name        | Type      | Constraint     | Read-only      | Required       | Note           |
|-------------|-----------|----------------|----------------|----------------|----------------|
| id          | int       |                |                | Y              | Set by server  |
| name        | string    | max 255 chars  |                | Y              |                |
| work_experience | int   |                |                | Y              |                |
| languages_spoken | Array[String] |       |                | Y              |                |
| languages_offered | Array[String] |      |                | Y              |                |
| language_level | string |                |                | Y              |                |
| price_per_hour | int    |                |                | Y              |                |
| created_at  | DateTime  |                |                | Y              | Set by server  |
| updated_at  | DateTime  |                |                | Y              | Set by server  |

### Course
Example of **Course** GET-request JSON-data:
```JSON
{
    "id": 1,
    "name": "Introduction to Russian language",
    "description": "A beginner course on Russian language learning.",
    "teacher": "Viktor Sergeevich",
    "level": "Beginner",
    "total_length": 8,
    "week_length": 2,
    "start_dates": [
        "2025-02-01T09:00:00",
        "2025-02-01T12:00:00",
        "2025-02-01T17:00:00",
        "2025-03-01T09:00:00",
        "2025-03-01T12:00:00",
        "2025-03-01T17:00:00"
    ],
    "course_fee_per_hour": 200,
    "created_at": "2025-01-10T14:02:06.170310084",
    "updated_at": "2025-01-10T14:02:06.170348154"
}
```

**Course** data description:
| Name    | Type           | Constraint     | Required       | Read-only      | Note           |               
|---------|----------------|----------------|----------------|----------------|----------------|
| id      | int            |                |                | Y              | Set by server  |               
| name    | string         | max 255 chars  |                | Y              | Course name    |               
| description | string     |                |                | Y              | Course description |           
| teacher | string         |                |                | Y              | Teacher's name |              
| level   | string         |                |                | Y              | Course level   |               
| total_length | int       |                |                | Y              | Course duration in weeks |     
| week_length | int        |                |                | Y              | Hours per week  |              
| start_dates | Array[DateTime] |           |                | Y              | List of available start dates | 
| course_fee_per_hour | int |               |                | Y              | Base cost per hour of training |
| created_at | DateTime    |                |                | Y              | Set by server   |              
| updated_at | DateTime    |                |                | Y              | Set by server   |              


### Order
Example of **Order** GET-request JSON-data:
```JSON
{
    "id": 1,
    "tutor_id": 0,
    "course_id": 2,
    "date": "2025-01-15",
    "time": "14:00",
    "duration": 1,
    "persons": 2,
    "price": 2500,
    "early_registration": true,
    "group_enrollment": false,
    "intensive_course": true,
    "supplementary": true,
    "personalized": false,
    "excursions": false,
    "assessment": false,
    "interactive": true,
    "student_id": 1
}
```

**Order** data description:
Here is the table with the new information:

| Name     | Type      | Constraint     | Required       | Read-only      | Note           |
|----------|-----------|----------------|----------------|----------------|----------------|
| id       | int       |                | Y              | Y              | Set by server  |
| tutor_id | int       |                | Y              |                | Only one of these two fields |
| course_id| int       |                | Y              |                | should be filled |
| date_start | date    |                | Y              |                | Passed in the format YYYY-MM-DD |
| time_start | time    |                | Y              |                | Passed in the format HH:MM |
| duration | int       | 1 to 40        | Y              |                | Duration in hours, for courses it is calculated automatically based on course data |
| persons  | int       | 1 to 20        | Y              |                |                |
| price    | int       |                | Y              |                | Total cost     |
| early_registration | bool |           | Y              |                | Additional options, their absence in the request body is considered as false |
| group_enrollment | bool |             | Y              |                | Additional option               |
| intensive_course | bool |             | Y              |                | Additional option               |
| supplementary | bool |                | Y              |                | Additional option               |
| personalized | bool |                 | Y              |                | Additional option               |
| excursions | bool |                   | Y              |                | Additional option               |
| assessment | bool |                   | Y              |                | Additional option               |
| interactive | bool |                  | Y              |                | Additional option               |
| student_id | int |                    |                | Y              | ID of the current user, set by the server |
| created_at | DateTime |               |                | Y              | Set by the server |
| updated_at | DateTime |               |                | Y              | Set by the server |
