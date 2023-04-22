import axiosClient from './axiosClient'

class OrderApi {
    getOrder =  async () => {
        const url = '/orders';
        return await axiosClient.get(url);
    };
    getOrderStatus =  async () => {
        const url = '/orders/order-status';
        return await axiosClient.get(url);
    };


}

const orderApi = new OrderApi();
export default orderApi;