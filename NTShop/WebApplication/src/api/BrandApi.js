import axiosClient from './axiosClient'

class BrandApi {
    getAll =  async () => {
        const url = '/brands';
        return await axiosClient.get(url);
    };

    getById =  async (id) => {
        const url = '/brands/' + id;
        return await axiosClient.get(url);
    };
  
    create = async (formData) => {
        const url = '/brands';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    update = async (formData) => {
        const url = '/brands/update';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    delete = async (id) => {
        const url = '/brands/delete/' + id;
        return await axiosClient.post(url);
    }
}

const brandApi = new BrandApi();
export default brandApi;