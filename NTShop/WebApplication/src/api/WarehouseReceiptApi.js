import axiosClient from './axiosClient'

class WarehouseReceiptApi {
    getAll =  async () => {
        const url = '/warehouseReceipts';
        return await axiosClient.get(url);
    };

    getById =  async (id) => {
        const url = '/warehouseReceipts/' + id;
        return await axiosClient.get(url);
    };
  
    create = async (formData) => {
        const url = '/warehouseReceipts';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    update = async (formData) => {
        const url = '/warehouseReceipts/update';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    delete = async (id) => {
        const url = '/warehouseReceipts/delete/' + id;
        return await axiosClient.post(url);
    }
}

const warehouseReceiptApi = new WarehouseReceiptApi();
export default warehouseReceiptApi;