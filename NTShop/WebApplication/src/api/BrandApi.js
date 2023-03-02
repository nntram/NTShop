import axiosClient from './axiosClient'

class BrandApi {
    getAll = () => {
        const url = '/brands';
        return axiosClient.get(url);
    };

    getById = ({params}) => {
        const url = '/brands';
        return axiosClient.get(url, {params});
    };
}

const brandApi = new BrandApi();
export default brandApi;