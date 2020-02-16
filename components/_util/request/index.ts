import Cookies from 'js-cookie'
import jsonp from './jsonp'
import download from './download'
import axiosIns ,{ axios } from './axios'
import { RequestConfig } from './types'

/**
 * 请求方法
 * @param options 
 * @param host 
 */
const HiRequest = (options :RequestConfig, host ?:string) => {
    return axiosIns(options ,host)
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