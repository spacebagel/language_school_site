# 📝 Russian language school site - Exam task 
**Problem description:** develop a website for a language school where international students can make request to learn Russian in courses or with a tutor.

**Recommended stack:** HTML, CSS, JS, Bootstrap.

## 📃 Description

> *There will be a description with pictures when I'm done...*

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