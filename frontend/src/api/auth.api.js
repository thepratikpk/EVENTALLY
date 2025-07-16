import { API } from "../lib/axios"


const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (err) {
    console.error("Registration error:", err.response?.data || err.message);
    throw err;
  }
};

const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};


export {
    registerUser,
    loginUser
}