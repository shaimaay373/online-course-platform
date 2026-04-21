import api from "./axios"; 

export const getAllCourses = async () => {
    const response = await api.get("/courses");
    return response.data;
};

export const createCourse = async (courseData) => {
    const response = await api.post("/courses", courseData);
    return response.data;
};

export const updateCourse = async (id, courseData) => {
    const response = await api.patch(`/courses/${id}`, courseData);
    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
};