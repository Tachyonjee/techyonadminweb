import axios from "axios";

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL; // Replace with actual API URL

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// ✅ Register API
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data; // Expecting { message, role, user }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getClassList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/upload/classes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};

export const getSubjects = async (classId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/upload/subjects`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

export const getTopics = async (subjectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/upload/topics/${subjectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
};

export const getSubtopics = async (topicId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/upload/subtopics/${topicId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subtopics:", error);
    return [];
  }
};

export const insertQuestion = async (questionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/questions`, questionData);
    return response.data;
  } catch (error) {
    console.error("Error inserting question:", error);
    throw error;
  }
};
// Fetch questions with role-based filtering
export const getQuestionsByTopic = async (topicId) => {
  const response = await axios.get(`${API_BASE_URL}/questions/topic/${topicId}`);
  return response.data;
};

// Fetch questions by subtopic
export const getQuestionsBySubtopic = async (subtopicId) => {
  const response = await axios.get(`${API_BASE_URL}/questions/subtopic/${subtopicId}`);
  return response.data;
};

// Fetch questions by subject with role-based filtering
export const getQuestionsBySubject = async (subjectId) => {
  const response = await axios.get(`${API_BASE_URL}/questions/subject/${subjectId}`);
  return response.data;
};

export const updateQuestion = async (questionData,id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/roles`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};