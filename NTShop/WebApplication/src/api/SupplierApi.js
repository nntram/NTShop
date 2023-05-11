import axiosClient from './axiosClient'

class SupplierApi {
    getAll =  async () => {
        const url = '/suppliers';
        return await axiosClient.get(url);
    };

    getById =  async (id) => {
        const url = '/suppliers/' + id;
        return await axiosClient.get(url);
    };
  
    create = async (formData) => {
        const url = '/suppliers';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    update = async (formData) => {
        const url = '/suppliers/update';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    delete = async (id) => {
        const url = '/suppliers/delete/' + id;
        return await axiosClient.post(url);
    }
}

const supplierApi = new SupplierApi();
export default supplierApi;