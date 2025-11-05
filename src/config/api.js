const API_URL = import.meta.env.PROD 
  ? "https://fopsmart-4030403a47a5.herokuapp.com" 
  : "";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export { API_URL, getAuthHeader };