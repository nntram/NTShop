import axiosClient from './axiosClient'

class CartApi {
    addToCart = async (data) => {
        const url = '/cart';
        return await axiosClient.post(url, data)
    };
    getCartQuantity =  async () => {
        const url = '/cart/quantity';
        return await axiosClient.get(url);
    };
    getCart =  async () => {
        const url = '/cart';
        return await axiosClient.get(url);
    };


}

const cartApi = new CartApi();
export default cartApi;