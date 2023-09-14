import axios from 'axios';


const instance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        common: {
            Authorization: ""
        }
    }
});




export default instance;
