import axiosClient from './axiosClient'
import { Buffer } from "buffer";

class ResourceApi {
    getImage = async (name) => {
        const url = process.env.REACT_APP_API_IMAGE_BASE_URL + name;
        return axiosClient.get(url, {
            withCredentials: false,
            responseType: 'arraybuffer',
            
        }).then(response => Buffer.from(response, 'binary').toString('base64'));
    };

}

const resourceApi = new ResourceApi();
export default resourceApi;