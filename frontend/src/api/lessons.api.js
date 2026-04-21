// src/api/instructorApi.js
import api from './axios';

// ── Courses ──
export const getMyCourses     = (params) => api.get('/courses/my', { params });
export const getCourse        = (id)     => api.get(`/courses/${id}`);
export const createCourse     = (data)   => api.post('/courses', data);
export const updateCourse     = (id, data) => api.patch(`/courses/${id}`, data);
export const deleteCourse     = (id)     => api.delete(`/courses/${id}`);

// ── Stats ──
export const getInstructorStats = () => api.get('/courses/my/stats');

// ── Lessons ──
export const createLesson = (courseId, data) => api.post(`/courses/${courseId}/lessons`, data);
export const updateLesson = (id, data)       => api.patch(`/lessons/${id}`, data);
export const deleteLesson = (id)             => api.delete(`/lessons/${id}`);

// ── Enrollments ──
export const getInstructorEnrollments = () => api.get('/enrollments/instructor');

// ── Comments ──
export const getCourseComments = (courseId) => api.get(`/comments/${courseId}`);
export const deleteComment     = (id)       => api.delete(`/comments/${id}`);