import axiosClient from './axiosClient'

class AuthApi {
    customerLogin =  async (formData) => {
        const url = '/auth/customer/login';
        return await axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    };

    getById =  async ({params}) => {
        const url = '/brands';
        return await axiosClient.get(url, {params});
    };
}

const authApi = new AuthApi();
export default authApi;