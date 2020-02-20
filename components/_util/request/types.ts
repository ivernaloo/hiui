export type Method = 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'

export interface RequestConfig {
    url: string;
    method?: Method;
    baseURL?: string;
    headers?: any;
    params?: any;
    loading?: boolean,
    beforeResponse?: (config:any) => any;
    errorResponse?:(config:any) => any; 
    beforeRequest?:(config:any) => RequestConfig;
    errorRequest?:(config:any) => any;
    errorCallback ?: (error: any) => any;
    paramsSerializer?: (params: RequestConfig) => string;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'; // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    onUploadProgress?: (progressEvent: any) => void;
    onDownloadProgress?: (progressEvent: any) => void;
    maxContentLength?: number;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    httpAgent?: any;
    httpsAgent?: any;
    cancelToken?: any;
    type?: 'basics' | 'upload' | 'jsonp' | 'download',
    file?: any,
    name?: string,
    filename ?: string,
    jsonpCallback ?: string;
    jsonpCallbackFunction ?: string;
    charset ?: any
}

export interface UploadFiles {
  formFile: FormData,
  options: RequestConfig
}
