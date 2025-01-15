import axios from "axios";

const API_URL = "http://localhost:4000/api/employees";

export const getEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'employé:", error);
    throw error;
  }
};

export const createEmployee = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'employé:", error);
    throw error;
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé:", error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'employé:", error);
    throw error;
  }
};
