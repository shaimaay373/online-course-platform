# mongo DB Connection String 
* MONGO_URI=mongodb://localhost:27017/

* Remote Server: mongodb+srv://OnlineCourses_db_user:qR5XusOvpyw7QC2L@onlinecourses.r5p42hp.mongodb.net/



qR5XusOvpyw7QC2L
OnlineCourses_db_user

## To connect With mongoDb
* native code ⇒ mongodb 
* ORM ⇒ object Rational Mapper 
* ODM ⇒ Object Document Mapper  (Mongoose)

## our Project is Online Course PlatForm
# 🎓 LearnHub — Online Course Platform

A full-stack online learning platform where students can browse, enroll in, and comment on courses, while instructors can create and manage their own courses and lessons through a dedicated dashboard.

---

## 🖼️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React.js (Vite) | UI Framework |
| React Router v6 | Client-side Routing |
| Axios | HTTP Requests |
| Bootstrap 5 | Base Styling |
| Custom CSS | Design System & Animations |

### Backend
| Tech | Purpose |
|---|---|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| Multer | File / Image Uploads |
| dotenv | Environment Variables |

---

##  Project Structure

```
online-course-platform/
│
├── backend/
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   │   ├── course.controller.js
│   │   │   ├── lesson.controller.js
│   │   │   ├── enrollment.controller.js
│   │   │   ├── comment.controller.js
│   │   │   └── auth.controller.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── Course.model.js
│   │   │   ├── Lesson.model.js
│   │   │   ├── Enrollment.model.js
│   │   │   ├── Comment.model.js
│   │   │   └── User.model.js
│   │   ├── routes/             # Express routers
│   │   │   ├── course.routes.js
│   │   │   ├── lesson.routes.js
│   │   │   ├── enrollment.routes.js
│   │   │   ├── comment.routes.js
│   │   │   └── auth.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── multer.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── validators/
│   │   └── utils/
│   │       └── HttpError.js
│   ├── upload/
│   │   └── upload.js
│   ├── uploads/                # Stored images
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   └── instructorApi.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── Components/
    │   │   ├── Navbar/
    │   │   └── Instructor/
    │   │       ├── InstructorSidebar.jsx
    │   │       └── ConfirmModal.jsx
    │   ├── Pages/
    │   │   ├── Home/
    │   │   ├── Login/
    │   │   ├── Register/
    │   │   ├── Courses/
    │   │   │   └── Course.jsx
    │   │   ├── CourseDetails/
    │   │   │   └── CourseDetails.jsx
    │   │   └── Instructor/
    │   │       ├── InstructorLayout.jsx
    │   │       ├── InstructorDashboard.jsx
    │   │       ├── InstructorMyCourses.jsx
    │   │       ├── InstructorCourseDetail.jsx
    │   │       ├── InstructorCourseForm.jsx
    │   │       ├── InstructorStudents.jsx
    │   │       ├── InstructorAnalytics.jsx
    │   │       ├── InstructorFeedback.jsx
    │   │       └── InstructorSettings.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

##  Environment Variables

Create a `.env` file inside the `backend/` folder with the following:

```env
PORT=4000
MONGO_URI=mongodb+srv://OnlineCourses_db_user:qR5XusOvpyw7QC2L@onlinecourses.r5p42hp.mongodb.net/
JWT_ACCESS_TOKEN_SECRET=your_jwt_secret_key
```

>  Never share your `.env` file publicly or push it to GitHub.

---

##  How to Run the Project

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/online-course-platform.git
cd online-course-platform
```

---

### 2. Run the Backend

```bash
cd backend
npm install
```

Create your `.env` file as shown above, then:

```bash
node server.js
```

Or with auto-restart using nodemon:

```bash
npm run dev
```

Backend will run at: `http://localhost:4000`

---

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

### 4. Create the uploads folder

Make sure this folder exists inside `backend/`:

```bash
mkdir backend/uploads
```

> Multer will store uploaded images here automatically.

---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get token |

### Courses
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/courses` | ❌ | Get all courses (pagination + filter) |
| GET | `/api/courses/my` | Instructor | Get instructor's own courses |
| GET | `/api/courses/my/stats` | Instructor | Get instructor dashboard stats |
| GET | `/api/courses/:id` | ❌ | Get course details + lessons |
| POST | `/api/courses` | Instructor | Create new course (with image) |
| PATCH | `/api/courses/:id` | Instructor | Update course |
| DELETE | `/api/courses/:id` | Instructor | Delete course |

### Lessons
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/courses/:courseId/lessons` | ❌ | Get all lessons for a course |
| POST | `/api/courses/:courseId/lessons` | Instructor | Add lesson to course |
| PATCH | `/api/lessons/:id` | Instructor | Update lesson |
| DELETE | `/api/lessons/:id` | Instructor | Delete lesson |

### Enrollments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/enrollments/:courseId/enroll` | Student | Enroll in a course |
| GET | `/api/enrollments/my` | Student | Get my enrollments |
| GET | `/api/enrollments/instructor` | Instructor | Get all enrollments for instructor courses |
| DELETE | `/api/enrollments/:id` | Student | Cancel enrollment |

### Comments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/comments/:courseId` | ❌ | Get comments for a course |
| POST | `/api/comments/:courseId` | Student | Add a comment |
| DELETE | `/api/comments/:id` | Student | Delete own comment |

---

##  User Roles

### Student
- Browse and search all courses
- View course details and lessons
- Enroll in courses
- Add comments on courses
- View enrolled courses in profile

### Instructor
- Full access to Instructor Dashboard
- Create, edit, and delete courses with thumbnail upload
- Add, edit, and delete lessons per course
- View students enrolled in their courses
- Manage and delete student comments
- View analytics: revenue, total students, published courses

---

##  Key Features

- **JWT Authentication** — Secure login with role-based access control
- **Image Upload** — Course thumbnails uploaded via Multer and served statically
- **Pagination & Filtering** — Courses support page, limit, category, level, search, minPrice, maxPrice
- **Instructor Dashboard** — Full course and lesson management with real-time stats
- **Student Experience** — Course browsing, enrollment with toast notifications, community comments
- **Responsive Design** — Works across desktop and mobile screens
- **Animations** — Smooth page transitions, hover effects, and entrance animations

---

##  Security Notes

- Passwords are hashed before storing in the database
- JWT tokens are required for all protected routes
- Role-based middleware (`allowedTo`) prevents unauthorized access
- File upload is restricted to images and videos only
- Max file size is 500MB

---

##  Dependencies

### Backend
```json
{
  "express": "^4.x",
  "mongoose": "^7.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "multer": "^1.x",
  "dotenv": "^16.x",
  "cors": "^2.x",
  "express-validator": "^7.x"
}
```

### Frontend
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "bootstrap": "^5.x"
}
```

---
