import axiosIns from './axios'
import { RequestConfig } from './types'

const download = (options:RequestConfig, host?: string):void => {
    const {
        filename = '未命名'
    } = options
    Object.assign(options,{responseType: 'blob'})
    axiosIns(options ,host).then((res)=>{
        const blob = new Blob([res.data])
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = filename; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放blob对象
    })
    
}
export default download