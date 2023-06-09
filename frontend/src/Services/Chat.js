import axios from 'axios';
let baseUrl = 'http://localhost:5000/api/chat';
const token = localStorage.getItem('token');

export const accessChat = async form => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(`${baseUrl}/`, form, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getChats = async () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(`${baseUrl}/`, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const createGroup = async form => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(`${baseUrl}/group`, form, config);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
