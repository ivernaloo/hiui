import axios from "axios"
import qs from 'qs'
import { RequestConfig } from './types'

const axiosIns = (options :RequestConfig) => {
    const { 
        timeout, 
        withCredentials,
        beforeResponse, 
        errorResponse, 
        beforeRequest, 
        errorRequest,
        data,
        errorCallback
     } = options
    if (options.headers && options.headers['content-type'] && options.headers['content-type'].toLocaleLowerCase()==='application/x-www-form-urlencoded' && options.data) {
        ({options,data: qs.stringify(data)})
    }
    
    const axiosInstance = axios.create({
        timeout,
        withCredentials
    })
    axiosInstance.interceptors.request.use((config) => {
        if(beforeRequest) {
           return beforeRequest(config)
        }
        return config
    },(error)=> {
        if(errorRequest){
            return errorRequest(error)
        }
        errorCallback && errorCallback(error)
        return error
    })
    axiosInstance.interceptors.response.use((response) => {
        if(beforeResponse) {
           return beforeResponse(response)
        }
        return response
    },(error)=> {
        if(errorResponse){
            return errorResponse(error)
        }
        errorCallback && errorCallback(error)

        return error
    })  
    
    return axiosInstance
}
export {axios}
export default axiosIns