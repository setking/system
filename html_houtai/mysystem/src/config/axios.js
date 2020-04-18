import axios from 'axios'
import QS from 'qs';
//  let baseUrl =  "http://192.168.1.105:8080"  
let baseUrl = "http://39.100.92.34:8081/jzb_houtai"
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true



axios.interceptors.response.use(
    response => {
        localStorage.setItem("resStatus", response.status)
        return response
    }, error => {
        localStorage.setItem("resStatus", 401)
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    })


export function get(url, params) {
    url = baseUrl + url;
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

export function post(url, params) {
    url = baseUrl + url;
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}