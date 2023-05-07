import axiosClient from './axiosClient'

class ProductApi {
    getAll = async () => {
        const url = '/products';
        return await axiosClient.get(url);
    };

    getAllCard = async ({params}) => {
        const url = '/products/get-all';
        return await axiosClient.get(url, {params});
    };

    getById = async (id) => {
        const url = `/products/${id}`;
        return await axiosClient.get(url);
    };

    create = async (formData) => {
        const url = '/products';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    update = async (formData) => {
        const url = '/products/update';
        return await axiosClient.post(url, formData,{
            headers:  {
                'Content-Type': 'multipart/form-data',
            }          
        });
    }

    delete = async (id) => {
        const url = '/products/delete/' + id;
        return await axiosClient.post(url);
    }

}

const productApi = new ProductApi();
export default productApi;