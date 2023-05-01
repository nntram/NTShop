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
        return await axiosClient.post(url, formData, {
            headers:  {
                'content-type': 'multipart/form-data',
            }          
        });
    }
}

const brandApi = new BrandApi();
export default brandApi;