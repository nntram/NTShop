import axiosClient from './axiosClient'

class CustomerApi {
    getAll =  async (data) => {
        const url = '/customers';
        return await axiosClient.get(url, data);
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

    changeInfo = async (formData) => {
        const url = '/customers/change-infor';
        return await axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    }
    changeStatus = async (formData) => {
        const url = '/customers/change-status';
        return await axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    }

}

const customerApi = new CustomerApi();
export default customerApi;