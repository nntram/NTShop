import axiosClient from './axiosClient'
class AddressApi {
    getProvince =  async () => {
        const url = '/address/provinces';
        return await axiosClient.get(url);
    };

    getDistrict =  async (id) => {
        const url = '/address/districts/' + id;
        return await axiosClient.get(url);
    };

    getWard =  async (id) => {
        const url = '/address/wards/' + id;
        return await axiosClient.get(url);
    };

    getFullAddress =  async (id) => {
        const url = '/address/full-address/' + id;
        return await axiosClient.get(url);
    };

}

const addressApi = new AddressApi();
export default addressApi;