// 请求封装的一些东西
import axios, { AxiosResponse } from "axios"
import { isDev } from "@/lib/env"
import { showLoading,openAlertError } from "@/lib/notice"
import { Toast } from 'vant';
import { ElLoadingComponent } from 'element-ui/types/loading'
import { getToken } from './cache'
import { VanToast } from 'vant/types/toast';


// http://129.211.87.79

const access_token = getToken()

export const TB_DOMAIN = "http://129.211.87.79"

const site_url = isDev() ? "" : TB_DOMAIN
const STATUS_SUCCESS = 1001

interface IParam{
    [key: string]: any
}

interface IProtocol<T>{
    code:number
    msg:string
    data:T
}

interface IRes<T = any>{
    status: boolean
    data?: T
    origin_data: IProtocol<T>
}

let loadingIns:VanToast
const closeLoading = () => {
    if(loadingIns && loadingIns.clear) loadingIns.clear()
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    loadingIns = Toast.loading({
        message: '加载中...',
        forbidClick: false,
    }); 
    return config;
  }, function (error) {
    return Promise.reject(error);
})


// 接收到数据后处理
const afterResponse = <T>(data:AxiosResponse<IProtocol<T>>):IRes<T> =>{
    closeLoading()
    const Data = data.data
    const ResError = {
        status: false,
        origin_data: Data
    }
    if(Data) {
        if(Data.code == STATUS_SUCCESS) {
            return {
                status: true,
                data: Data.data,
                origin_data:Data
            }
        }
        return ResError
    }
    return ResError
}
// 异常错误处理
const afterCatch = (err:any)=>{
    closeLoading()
    console.log("err err",err)
    openAlertError("异常错误")
}

export const httpGet = <T>(url:string,params:IParam = {},options:IParam = {}) => {
    return axios.get<IProtocol<T>>(site_url + url,{
        params:{
            ...params,
            token:access_token
        },
        headers:{
            "Accept": "application/prs.myapp.v1+json",
            "content-type": "application/x-www-form-urlencoded",
            ...options
        }
    }).then(afterResponse)
    .catch(afterCatch)
}

export const httpPost = <T>(url:string,params:IParam = {},options:IParam = {}) => {
    console.log("post的地址",site_url+url)
    return axios.post<IProtocol<T>>(site_url + url + `?token=${access_token}`, params,{
        headers:{
            "Accept": "application/prs.myapp.v1+json",
            ...options
        }
    }).then(afterResponse)
    .catch(afterCatch)
}

export const httpGetCommon = <T>(url:string,params:IParam = {},options:IParam = {}) => {
    return axios.get<IProtocol<T>>(url,{
        params:{
            ...params
        },
        headers:{
            "content-type": "application/x-www-form-urlencoded",
            ...options
        }
    }).catch(afterCatch)
}
