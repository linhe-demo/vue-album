import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REQUEST_URL,
    headers: {
        common: {
            Authorization: sessionStorage.getItem('token')
        }
    }
});

export default instance;
