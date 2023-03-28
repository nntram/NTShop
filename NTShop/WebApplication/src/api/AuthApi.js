import axiosClient from './axiosClient'

class AuthApi {
    customerLogin = (formData) => {
        const url = '/auth/customer/login';
        return axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    };

    getById = ({params}) => {
        const url = '/brands';
        return axiosClient.get(url, {params});
    };
}

const authApi = new AuthApi();
export default authApi;