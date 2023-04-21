import axiosClient from './axiosClient'

class CheckoutApi {
    checkout = async (formData) => {
        const url = '/checkout';
        return await axiosClient.post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
            }
        });
    };


}

const checkoutApi = new CheckoutApi();
export default checkoutApi;