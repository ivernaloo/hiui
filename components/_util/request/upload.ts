import { RequestConfig, UploadFiles} from './types'

const upload = (options: RequestConfig) :UploadFiles => {
    const {
        file,
        name = 'file',
        params = {},
        headers,
    } = options
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
    return { formFile, options }
}
export default upload