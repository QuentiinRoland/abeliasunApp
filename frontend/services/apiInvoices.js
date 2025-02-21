import axios from "axios";

const API_URL =
  "https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/invoices";

// Récupérer toutes les factures
export const getInvoices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Récupérer une facture par ID
export const getInvoiceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Créer une facture
export const createInvoice = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

// Mettre à jour une facture
export const updateInvoice = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// Supprimer une facture
export const deleteInvoice = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
