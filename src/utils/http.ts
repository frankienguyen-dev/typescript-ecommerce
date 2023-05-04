import axios, { AxiosError, AxiosInstance, formToJSON } from "axios";
import { toast } from "react-toastify";
import HttpStatusCode from "src/constants/httpStatusCode.enum";
import { AuthResponse, RefreshTokenResponse } from "src/types/auth.type";
import { defaultLocale } from "yup";
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "./auth";
import config from "src/constants/config";
import {
  URL_LOGIN,
  URL_LOGOUT,
  URL_REFRESH_TOKEN,
  URL_REGISTER,
} from "src/apis/auth.api";
import path from "src/constants/path";
import { axiosExpiredTokenError, axiosUnauthorizedError } from "./utils";
import { url } from "inspector";
import { ErrorResponse } from "src/types/utils.type";

class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage();
    this.refreshToken = getRefreshTokenFromLocalStorage();
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "expire-access-token": 10,
        "expire-refresh-token": 60 * 60,
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
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse;
          this.accessToken = data.data.access_token;
          this.refreshToken = data.data.refresh_token;
          setAccessTokenToLocalStorage(this.accessToken);
          setRefreshTokenToLocalStorage(this.refreshToken);
          setProfileToLocalStorage(data.data.user);
        } else if (url === URL_LOGOUT) {
          this.accessToken = "";
          this.refreshToken = "";
          clearLocalStorage();
        }
        return response;
      },
      (error: AxiosError) => {
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
          ].includes(error.response.status as number)
        ) {
          const data: any | undefined = error.response?.data;
          console.log(data, error);
          const message = data?.message || error.message;
          toast.error(message);
        }

        if (
          axiosUnauthorizedError<
            ErrorResponse<{ name: string; message: string }>
          >(error)
        ) {
          const config = error.response.config;
          const { url } = config;
          if (axiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 10000);
                });
            return this.refreshTokenRequest.then((access_token) => {
              return this.instance({
                ...config,
                headers: { ...config.headers, Authorization: access_token },
              });
            });
          }
          clearLocalStorage();
          this.accessToken = "";
          this.refreshToken = "";
          toast.error(
            error.response.data.data.message || error.response.data.message
          );
        }
        return Promise.reject(error);
      }
    );
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken,
      })
      .then((res) => {
        const { access_token } = res.data.data;
        setAccessTokenToLocalStorage(access_token);
        this.accessToken = access_token;
        return access_token;
      })
      .catch((error) => {
        clearLocalStorage();
        this.accessToken = "";
        this.refreshToken = "";
        throw error;
      });
  }
}

const http = new Http().instance;

export default http;
