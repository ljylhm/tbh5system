// 获取买手绑定店铺信息
import { httpGet, httpPost } from '@/lib/http';
import { ILogin, IRegister } from '@/constance/login';

// 获取买手列表
export const getBuyerList = () => {
    return httpPost("/api/buyer/get")
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