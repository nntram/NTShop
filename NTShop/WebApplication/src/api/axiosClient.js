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
          originalRequest.headers['authorization'] = 'Bearer ' + token;
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        })
      }

    originalRequest._retry = true;
    isRefreshing = true;

    const user = window.localStorage.getItem('userAuth');
    var bodyFormData = new FormData();
    bodyFormData.append('authorization', user.accessToken)
    return new Promise(function (resolve, reject) {
       axiosClient.post('https://localhost:7157/auth/refresh', bodyFormData)
        .then(({data}) => {
            window.localStorage.setItem('userAuth', data);
            axiosClient.defaults.headers.common['authorization'] = 'Bearer ' + data;
            originalRequest.headers['authorization'] = 'Bearer ' + data;
            processQueue(null, data);
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