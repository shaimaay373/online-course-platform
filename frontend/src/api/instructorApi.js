import api from "./axios";

export const getInstructorStats = () => api.get("/instructor/stats");

export const getMyCourses = (params) => api.get("/instructor/courses", { params });

export const getCourse = (courseId) => api.get(`/courses/${courseId}`);

export const createCourse = (formData) =>
  api.post("/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCourse = (courseId, body) => {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  return api.patch(`/courses/${courseId}`, body, {
    headers: isForm ? { "Content-Type": "multipart/form-data" } : undefined,
  });
};

export const deleteCourse = (courseId) => api.delete(`/courses/${courseId}`);

export const createLesson = (courseId, payload) =>
  api.post(`/courses/${courseId}/lessons`, payload);

export const updateLesson = (lessonId, payload) =>
  api.patch(`/courses/lessons/${lessonId}`, payload);

export const deleteLesson = (lessonId) =>
  api.delete(`/courses/lessons/${lessonId}`);

export const getInstructorEnrollments = () =>
  api.get("/enrollments/instructor");

export const getCourseComments = (courseId) =>
  api.get(`/comments/${courseId}`);

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`);
