import axios from "axios";

const API_URL = "http://localhost:4000/api/services";

export const getServices = async () => {
  try {
    console.log("Appel API vers:", API_URL); // Pour le debug
    const response = await axios.get(API_URL);
    console.log("Réponse API:", response.data); // Pour le debug
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error);
    throw error;
  }
};
