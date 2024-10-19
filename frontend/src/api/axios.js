import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3100/api",
  withCredentials: true,
});

console.log("Axios instance created with baseURL:", instance.defaults.baseURL);

export default instance;
