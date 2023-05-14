import axiosClient from './axiosClient'

class StatisticsApi {
    getProductCount =  async () => {
        const url = '/statistics/all-products';
        return await axiosClient.get(url);
    };
    getStaffCount =  async () => {
        const url = '/statistics/all-staffs';
        return await axiosClient.get(url);
    };
    getOrderCount =  async () => {
        const url = '/statistics/all-orders';
        return await axiosClient.get(url);
    };
    getCustomerCount =  async () => {
        const url = '/statistics/all-customers';
        return await axiosClient.get(url);
    };

    getBestSellingProudcts =  async (data) => {
        const url = '/statistics/best-selling-products';
        return await axiosClient.get(url, data);
    };
    
    getInvoiceStatistics =  async (data) => {
        const url = '/statistics/invoice-statistics';
        return await axiosClient.get(url, data);
    };

}

const statisticsApi = new StatisticsApi();
export default statisticsApi;