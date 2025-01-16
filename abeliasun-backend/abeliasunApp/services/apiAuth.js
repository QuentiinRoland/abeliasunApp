import axios from "axios";

const API_URL = "https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/auth";

// Fonction pour récupérer la liste des utilisateurs Firebase
export const getAuthUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
};

// Fonction pour supprimer un utilisateur Firebase
export const deleteAuthUser = async (uid) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw error;
  }
};
