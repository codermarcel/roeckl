import Axios from "axios";
import config from "./config"
import auth from "./auth"

export interface ServerResponse<T> {
    success: boolean
    message: string
    data: T
}

const axiosInstane = Axios.create({
    baseURL: config.getBasePath(),
    timeout: config.getDefaultTimeout(),
});

axiosInstane.interceptors.request.use(function (config) {
    config.headers["Authorization"] = auth.jwt
    return config;
  }, function (error) {
    return Promise.reject(error);
});

export default axiosInstane;