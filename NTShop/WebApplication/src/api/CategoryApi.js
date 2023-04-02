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
}

const categoryApi = new CategoryApi();
export default categoryApi;