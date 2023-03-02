import axiosClient from './axiosClient'

class CategoryApi {
    getAll = () => {
        const url = '/categories';
        return axiosClient.get(url);
    };

    getById = ({params}) => {
        const url = '/categories';
        return axiosClient.get(url, {params});
    };
}

const categoryApi = new CategoryApi();
export default categoryApi;