// 获取买手绑定店铺信息
import { httpGet, httpPost } from '@/lib/http';
import { ILogin, IRegister } from '@/constance/login';

// 获取买手列表
export const getBuyerList = () => {
    return httpPost<any>("/api/buyer/get")
} 

// 添加买手
export const addBuyer = (form:{
    name: string
    type: number
    sex: string
    img_url: string[]
}) => {
    return httpPost("/api/buyer/add",form)
}

// 修改买手信息
export const editBuyer = (form:any) => {
    return httpPost("/api/buyer/update",form)
}

// 修改用户信息的一些接口
export const editUserInfo = (editInfo:any) => httpPost("/api/update",editInfo)

// 买手信息的接口
export const getBuyerInfo = (id:any) => httpPost("/api/buyer/info",{
    id
})

// 买手信息的接口
export const checkBuyerInfo = (id:any,confirm:string) => httpPost("/api/buyer/check",{
    id,
    confirm
})