import axiosClient from './axiosClient'

class ProductApi {
    getAll = async () => {
        const url = '/products';
        return await axiosClient.get(url);
    };

    getAllCard = async ({params}) => {
        const url = '/products/get-all';
        return await axiosClient.get(url, {params});
    };

    getById = async (id) => {
        const url = `/products/${id}`;
        return await axiosClient.get(url);
    };


}

const productApi = new ProductApi();
export default productApi;