import axios from 'axios';
let baseUrl = 'http://localhost:5000/api/user';

export const register = async (form) => {
    try {
        const response = await axios.post(`${baseUrl}/register`, form);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}

export const login = async (form) => {
    try {
        const response = await axios.post(`${baseUrl}/login`, form);
        return response.data;
    } catch (err) {
        console.log(err);
    }
}