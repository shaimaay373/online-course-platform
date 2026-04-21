import api from "./axios";

export const enrollCourse = (courseId) =>
  api.post(`/enrollments/${courseId}/enroll`);