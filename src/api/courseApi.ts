// src/api/courseApi.ts
import axios from 'axios';

export const enrollInCourse = async (courseId: number) => {
  const response = await axios.post(`/api/protected/enrollments/enroll?courseId=${courseId}`);
  return response.data.data; // returns the Enrollment object
};


export const enrolledCourses = async () => {
    const response = await axios.get('/api/protected/enrollments/enroll/courses');
    return response.data.data;
}

// export const fetchCourses = async () => {
//     const response = await axios.get()
// }
