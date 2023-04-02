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
}

const brandApi = new BrandApi();
export default brandApi;