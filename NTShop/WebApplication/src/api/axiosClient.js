// api/axiosClient.js
import axios from 'axios';


const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json',
    },
});

// Set the AUTH token for any request
axiosClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem('userAuth');
  if(token) {
    config.headers.Authorization =   `Bearer ${token}`
  }
  return config;
});


// refreshtoken for multiple requests
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

    const accessToken = window.localStorage.getItem('userAuth');
    const bodyFormData = new FormData();
    bodyFormData.append('authorization', accessToken)
    return new Promise(function (resolve, reject) {
       axiosClient.post('https://localhost:7157/auth/refresh', bodyFormData,  {headers: {
        "Content-Type": "multipart/form-data",
      }})
        .then(({data}) => {
            window.localStorage.setItem('userAuth', data);
            axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + data;
            originalRequest.headers['Authorization'] = 'Bearer ' + data;
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