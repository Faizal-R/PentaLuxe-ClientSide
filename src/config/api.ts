import axios from "axios";
import { AppHttpStatusCodes } from "../types/statusCode";
import { errorToast } from "@/utils/customToast";
import store from "@/store/store";
import { logOut } from "@/store/slices/userSlice";

const baseURL=import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:7000/api'

const dispatch=store.dispatch
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
             
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const adminToken=localStorage.getItem('adminToken')
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    if(adminToken){
      config.headers['x-admin-authorization']=`Bearer ${adminToken}`
    }
    console.log("ApiRq:",config," URL:",config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Responses",response)
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === AppHttpStatusCodes.UNAUTHORIZED) {
        console.log("Unauthorized Access:", data);
        errorToast(data.message)
        dispatch(logOut())
        setTimeout(() => {
          if (window.location.pathname !== "/login") {
             
              window.location.href = "/login";
          }
      }, 1000);
      
      } else if (status === AppHttpStatusCodes.FORBIDDEN) {
        console.log("Forbidden Access:", data);
        errorToast(data.message)
        setTimeout(()=>{
          if (window.location.pathname !== "/admin"){

            window.location.href = "/admin";
          }
        },1500)
      
      } else {
        console.error("Error Response:", data);
      }
    } else {
      // Handle network or other errors
      console.error("Request Error:", error);
    }
    return Promise.reject(error);
  }     
);

export default api;
