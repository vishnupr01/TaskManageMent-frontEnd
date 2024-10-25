import axios from 'axios';


const Api = axios.create({
  baseURL: 'https://taskmanagement.vkart.fun',
  withCredentials: true,
});

export default Api;


