import {Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./pages/Register/Register";
import Courses from './Pages/Courses/Course'
import CourseDetails from "./Pages/CourseDetails/CourseDetails";
import Profile from "./Pages/Profile/Profile";
import InstructorGuard from "./Components/Instructor/InstructorGuard";
import InstructorLayout from "./Pages/Instructor/InstructorLayout";
import InstructorDashboard from "./Pages/Instructor/InstructorDashboard";
import InstructorMyCourses from "./Pages/Instructor/InstructorMyCourses";
import InstructorCourseForm from "./Pages/Instructor/InstructorCourseForm";
import InstructorCourseDetail from "./Pages/Instructor/InstructorCourseDetail";
import InstructorStudents from "./Pages/Instructor/InstructorStudents";
import InstructorFeedback from "./Pages/Instructor/InstructorFeedback";
import InstructorAnalytics from "./Pages/Instructor/InstructorAnalytics";
import InstructorSettings from "./Pages/Instructor/InstructorSettings";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/dashboard"
          element={
            <InstructorGuard>
              <InstructorLayout />
            </InstructorGuard>
          }
        >
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorMyCourses />} />
          <Route path="courses/new" element={<InstructorCourseForm />} />
          <Route path="courses/:courseId/edit" element={<InstructorCourseForm />} />
          <Route path="courses/:courseId" element={<InstructorCourseDetail />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route path="feedback" element={<InstructorFeedback />} />
          <Route path="analytics" element={<InstructorAnalytics />} />
          <Route path="settings" element={<InstructorSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;