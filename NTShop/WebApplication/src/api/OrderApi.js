import axiosClient from './axiosClient'

class OrderApi {
    getOrders =  async () => {
        const url = '/orders';
        return await axiosClient.get(url);
    };
    getOrderStatus =  async () => {
        const url = '/orders/order-status';
        return await axiosClient.get(url);
    };
    getOrder =  async (id) => {
        const url = '/orders/' + id;
        return await axiosClient.get(url);
    };
    getPaged = async ({params}) => {
        const url = '/orders/get-paged';
        return await axiosClient.get(url, {params});
    };
    updateOrderStatus = async (data) => {
        const url = '/orders/update-status';
        return await axiosClient.post(url, data)
    };

}

const orderApi = new OrderApi();
export default orderApi;