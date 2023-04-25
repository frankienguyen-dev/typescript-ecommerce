import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "react-toastify";
import HttpStatusCode from "src/constants/httpStatusCode.enum";
import { AuthResponse } from "src/types/auth.type";
import { defaultLocale } from "yup";
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
} from "./auth";
import path from "src/constants/path";
import config from "src/constants/config";

class Http {
  instance: AxiosInstance;
  private accessToken: string;
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage();
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse;
          this.accessToken = data.data.access_token;
          setAccessTokenToLocalStorage(this.accessToken);
          setProfileToLocalStorage(data.data.user);
        } else if (url === path.logout) {
          this.accessToken = "";
          clearLocalStorage();
        }
        return response;
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data;
          console.log(data, error);
          const message = data?.message || error.message;
          toast.error(message);
        }

        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLocalStorage();
        }
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;

export default http;
