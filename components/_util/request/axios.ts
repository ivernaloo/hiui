import axios from "axios"
import qs from 'qs'
import { RequestConfig } from './types'

const axiosIns = (options :RequestConfig, host ?:string) => {
    const { 
        timeout, 
        withCredentials,
        beforeResponse, 
        errorResponse, 
        beforeRequest, 
        errorRequest,
        data,
        type = 'basics',
        file,
        name = 'file',
        params = {},
        headers,
        errorCallback
     } = options
    const url = host ? host + options.url : options.url
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
    if(type === 'upload') {
        const formFile = new FormData()
        if(file) {
            formFile.append(name, file)
        }
        ({options,headers:{...headers,'Content-Type':'multipart/form-data'}})
        // 设置除file外需要带入的参数
        if (params) {
            Object.keys(params).forEach(key=>{
                formFile.append(key, params[key])
            })
        }

        return axiosInstance.post(url ,formFile,options).catch((error)=>{
            errorCallback && errorCallback(error)
            return error
        })
    }
    return axiosInstance ({
        ...options,
        url
    }).then(res=> res)
    .catch(error=>{
        errorCallback && errorCallback(error)
        return error
    })
}
export {axios}
export default axiosIns