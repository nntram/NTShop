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

    getById = ({params}) => {
        const url = '/products';
        return axiosClient.get(url,  {params});
    };

    getCount= ({params}) => {
        const url = '/products/get-count';
        return axiosClient.get(url,  {params});
    };
}

const productApi = new ProductApi();
export default productApi;