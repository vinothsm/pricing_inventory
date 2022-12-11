import axios from "axios";

const API_URL = "http://localhost:8200/user/";

// Register a new user
const register = async (userData) => {
  const respone = await axios.post(API_URL +  "register", userData);
  if(respone.data){
    localStorage.setItem("user", JSON.stringify(respone.data));
  }
  return respone.data;
}

// Login a user
const login = async (userData) => {
  const respone = await axios.post(API_URL + "login", userData);
  if(respone.data){
    localStorage.setItem("user", JSON.stringify(respone.data));
  }
  return respone.data;
}

// Logout a user
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
}

export default authService