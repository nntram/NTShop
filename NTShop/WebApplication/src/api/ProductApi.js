import axiosClient from './axiosClient'

class ProductApi {
    getAll = () => {
        const url = '/products';
        return axiosClient.get(url);
    };

    getAllCard = () => {
        const url = '/products/get-all';
        return axiosClient.get(url);
    };

    getById = (id) => {
        const url = '/products';
        return axiosClient.get(url, { id });
    };
}

const productApi = new ProductApi();
export default productApi;