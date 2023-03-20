// api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json',
    },
});

// for multiple requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  })
  
  failedQueue = [];
}

axiosClient.interceptors.response.use(function (response) {
  if (response && response.data) {
    return response.data;
  }
  return response;
}, function (error) {

  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject})
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        })
      }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = window.localStorage.getItem('refreshToken');
    return new Promise(function (resolve, reject) {
       axiosClient.post('http://localhost:8000/auth/refresh', { refreshToken })
        .then(({data}) => {
            window.localStorage.setItem('token', data.token);
            window.localStorage.setItem('refreshToken', data.refreshToken);
            axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
            originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
            processQueue(null, data.token);
            resolve(axiosClient(originalRequest));
        })
        .catch((err) => {
            processQueue(err, null);
            reject(err);
        })
        .finally(() => { isRefreshing = false })
    })
  }

  return Promise.reject(error);
});

export default axiosClient;