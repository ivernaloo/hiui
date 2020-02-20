import Cookies from 'js-cookie'
import jsonp from './jsonp'
import download from './download'
import upload from './upload'
import axiosIns ,{ axios } from './axios'
import { RequestConfig } from './types'


/**
 * 请求方法
 * @param options 
 * @param host 
 */
const instance = axiosIns({
    timeout: 5000,
    type: 'basics',
    url: ''
})
const HiRequest = (options :RequestConfig, host ?:string) => {
    const {type ='basics'} = options
    const url = host ? host + options.url : options.url
    if(type === 'jsonp' || type === 'download' ){
        return type === 'jsonp' ? jsonp : download
    } 
        return type === 'basics' ? instance({...options,url}) : instance.post(url,upload(options).formFile,upload(options).options)
    

}


// 请求语法糖： reguest.get HiRequest.post ……
const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
METHODS.forEach(method => {
    HiRequest[method] = (url:string, options?:any) => HiRequest({ ...options, method, url });
});
// 取消请求
HiRequest.CancelToken = () => {
    return axios.CancelToken
}
/**
 * 获取cookies中的值作为参数使用
 * @param key 
 */
HiRequest.getCookiesParam = (key :string) :any => {
    return Cookies.get(key)
}
// add jsonp
HiRequest.jsonp = jsonp
// download
HiRequest.download = download


export default HiRequest