import axiosClient from './axiosClient'

class AuthApi {
    customerLogin = async (formData) => {
        const url = '/auth/customer/login';
        return await axiosClient.post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
            }
        });
    };

    forgotPassword = async (data) => {
        const url = '/auth/customer/forgot-password';
        return await axiosClient.post(url, {Username: data});
    };

    resetPassword = async (data, token) => {
        const url = '/auth/customer/reset-password';
        
        if(token){
            const headers = {
                authorization: 'Bearer ' + token,
            }
            return await axiosClient.post(url, {Password: data}, {headers})
        }

        return await axiosClient.post(url, data)
       
    };
}

const authApi = new AuthApi();
export default authApi;