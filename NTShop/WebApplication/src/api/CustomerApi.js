import axiosClient from './axiosClient'

class CustomerApi {
    getAll =  async () => {
        const url = '/customers';
        return await axiosClient.get(url);
    };

    getById =  async (id) => {
        const url = '/customers/' + id;
        return await axiosClient.get(url);
    };

    create = async (formData) => {
        const url = '/customers';
        return await axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    }

    isUsernameExist =  async (username) => {
        const url = '/customers/username/' + username;
        return await axiosClient.get(url);
    };

}

const customerApi = new CustomerApi();
export default customerApi;