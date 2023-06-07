import axios from 'axios';
let baseUrl = 'http://localhost:5000/api/user';
const token = localStorage.getItem('token');

export const register = async form => {
  try {
    const response = await axios.post(`${baseUrl}/register`, form);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const login = async form => {
  try {
    const response = await axios.post(`${baseUrl}/login`, form);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getUsers = async form => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${baseUrl}/getUsers?search=${form}`,
      config
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
