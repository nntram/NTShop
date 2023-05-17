import axiosClient from './axiosClient'

class StaffApi {
    getAll =  async (data) => {
        const url = '/staffs';
        return await axiosClient.get(url, data);
    };

    getById =  async (id) => {
        const url = '/staffs/' + id;
        return await axiosClient.get(url);
    };

    create = async (formData) => {
        const url = '/staffs';
        return await axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    }

    isUsernameExist =  async (username) => {
        const url = '/staffs/username/' + username;
        return await axiosClient.get(url);
    };

    changeInfo = async (formData) => {
        const url = '/staffs/change-infor';
        return await axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    }
    changeStatus = async (formData) => {
        const url = '/staffs/change-status';
        return await axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    }

}

const staffApi = new StaffApi();
export default staffApi;