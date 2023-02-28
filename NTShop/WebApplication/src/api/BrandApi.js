import axiosClient from './axiosClient'

class BrandApi {
    getAll = () => {
        const url = '/brands';
        return axiosClient.get(url);
    };

    getById = (id) => {
        const url = '/brands';
        return axiosClient.get(url, { id });
    };
}

const brandApi = new BrandApi();
export default brandApi;