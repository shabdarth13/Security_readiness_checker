import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api"
});


/* AUTH APIs */

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);


/* QUESTIONS APIs */

export const fetchQuestions = () =>
  API.get("/questions/");

export const addQuestion = (data) =>
  API.post("/questions/add", data);


/* SCORING APIs */

export const calculateScore = (data) =>
  API.post("/scoring/calculate", data);


/* REPORT APIs */

export const generateReport = (data) =>
  API.post("/report/generate", data);

export const fetchReports = (userId) =>
  API.get(`/report/all/${userId}`);


/* COMPLIANCE APIs */

export const fetchComplianceMapping = (userId) =>
  API.get(`/compliance/map/${userId}`);


/* ADMIN APIs */

export const fetchUsers = () =>
  API.get("/admin/all-users");