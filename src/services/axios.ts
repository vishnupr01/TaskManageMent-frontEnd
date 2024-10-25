import axios from 'axios';


const Api = axios.create({
  baseURL: 'http://taskmanagement.vkart.fun',
  withCredentials: true,
});

export default Api;


