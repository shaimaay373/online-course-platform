import api from "./axios";

export const getCourseComments = (courseId) =>
  api.get(`/comments/${courseId}`);

export const createComment = (courseId, text) =>
  api.post(`/comments/${courseId}`, { text });