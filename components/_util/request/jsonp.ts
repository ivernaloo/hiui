interface JsonpOptions {
    timeout ?: number;
    jsonpCallback ?: string;
    jsonpCallbackFunction ?: string;
    charset ?: any
}

const defaultJsonpOptions = {
    timeout : 6000,
    jsonpCallback : 'callback',
}

const generateCallbackFunction = ():string => {
  return `jsonp_${Date.now()}_${Math.ceil(Math.random() * 100000)}`;
}
const clearFunction = (functionName:string) => {
try {
    delete window[functionName];
} catch (e) {
    window[functionName] = undefined;
}
}

const removeScript = (scriptId:string) => {
    const script = document.getElementById(scriptId);
    if (script) {
        document.getElementsByTagName('head')[0].removeChild(script);
    }
}
const jsonp = (_url: string, options: JsonpOptions = defaultJsonpOptions): Promise<any> => {
    const {timeout,jsonpCallback} = options
    let url = _url
    let timeoutId: any
    return new Promise((resolve, reject) => {
        const callbackFunction = options && options.jsonpCallbackFunction ? options.jsonpCallbackFunction : generateCallbackFunction()

        const scriptId = `${jsonpCallback}_${callbackFunction}`;
    
        window[callbackFunction] = (response:any) => {
          resolve({
            ok: true,
            // keep consistent with fetch API
            json: () => Promise.resolve(response),
          });
    
          if (timeoutId) clearTimeout(timeoutId);
    
          removeScript(scriptId);
    
          clearFunction(callbackFunction);
        };
    
        url += (url.indexOf('?') === -1) ? '?' : '&';
    
        const jsonpScript = document.createElement('script');
        jsonpScript.setAttribute('src', `${url}${jsonpCallback}=${callbackFunction}`);
        if (options&&options.charset) {
          jsonpScript.setAttribute('charset', options.charset);
        }
        jsonpScript.id = scriptId;
        document.getElementsByTagName('head')[0].appendChild(jsonpScript);
    
        timeoutId = setTimeout(() => {
          reject(new Error(`JSONP request to ${_url} timed out`));
    
          clearFunction(callbackFunction);
          removeScript(scriptId);
          window[callbackFunction] = () => {
            clearFunction(callbackFunction);
          };
        }, timeout);
    
        // Caught if got 404/500
        jsonpScript.onerror = () => {
          reject(new Error(`JSONP request to ${_url} failed`));
    
          clearFunction(callbackFunction);
          removeScript(scriptId);
          if (timeoutId) clearTimeout(timeoutId);
        };
      });
}
export default jsonp