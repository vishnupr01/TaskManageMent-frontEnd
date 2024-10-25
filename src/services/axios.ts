import axios from 'axios';


const Api = axios.create({
  baseURL: 'http://taskmanagent.vkart.fun',
  withCredentials: true,
});

export default Api;


