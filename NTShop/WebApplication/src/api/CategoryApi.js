import axiosClient from './axiosClient'

class CategoryApi {
    getAll = async () => {
        const url = '/categories';
        return await axiosClient.get(url);
    };

    getById = async (id) => {
        const url = '/categories/' + id;
        return await axiosClient.get(url);
    };

    create = async (formData) => {
        const url = '/categories';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    update = async (formData) => {
        const url = '/categories/update';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    delete = async (id) => {
        const url = '/categories/delete/' + id;
        return await axiosClient.post(url);
    }
}

const categoryApi = new CategoryApi();
export default categoryApi;