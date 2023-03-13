import axiosClient from './axiosClient'

class ProductApi {
    getAll = () => {
        const url = '/products';
        return axiosClient.get(url);
    };

    getAllCard = ({params}) => {
        const url = '/products/get-all';
        return axiosClient.get(url, {params});
    };

    getById = (id) => {
        const url = `/products/${id}`;
        return axiosClient.get(url);
    };


}

const productApi = new ProductApi();
export default productApi;