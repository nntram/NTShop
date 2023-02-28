import axiosClient from './axiosClient'

class CategoryApi {
    getAll = () => {
        const url = '/categories';
        return axiosClient.get(url);
    };

    getById = (id) => {
        const url = '/categories';
        return axiosClient.get(url, { id });
    };
}

const categoryApi = new CategoryApi();
export default categoryApi;