import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // 1. GET ALL (For Table)
  fetchAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data.data;
    } catch (error) {
      console.error("Fetch All Failed", error);
      return [];
    }
  },

  // 2. DELETE (Remove from Real DB)
  deleteRecord: async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      return true;
    } catch (error) {
      console.error("Delete Failed", error);
      return false;
    }
  },

  // 3. UPDATE (Edit Real DB)
  updateRecord: async (id, newData) => {
    try {
      await axios.put(`${API_URL}/update/${id}`, newData);
      return true;
    } catch (error) {
      console.error("Update Failed", error);
      return false;
    }
  },

  // --- EXISTING FUNCTIONS ---
  fetchLatest: async () => {
    try { const res = await axios.get(`${API_URL}/latest`); return res.data; } catch (e) { return null; }
  },
  computeFinancials: async (inputs) => {
    const res = await axios.post(`${API_URL}/compute`, inputs); return res.data;
  },
  analyzeKPI: async (kpiName, kpiValue, fullBusinessData) => {
    try { const res = await axios.post(`${API_URL}/analyze`, { kpi_name: kpiName, kpi_value: kpiValue, business_data: fullBusinessData }); return res.data.analysis; } catch (e) { return "AI Offline"; }
  }
};