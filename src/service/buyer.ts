// 获取买手绑定店铺信息
import { httpGet, httpPost } from '@/lib/http';
import { ILogin, IRegister } from '@/constance/login';


export interface IBuyerInfo{
    consumers_id: number;
    created_at: string;
    description?: string;
    id: number;
    img_url: string;
    name: string;
    sex: number;
    status: number;
    type: number;
    updated_at: string;
}

export const DEFAULT_BUYERINFO = {
    consumers_id: 0,
    created_at: "",
    description: "",
    id: 0,
    img_url: "",
    name: "",
    sex: 0,
    status: 0,
    type: 0,
    updated_at: ""
}

// 获取买手列表
export const getBuyerList = () => {
    return httpPost<IBuyerInfo[]>("/api/buyer/get")
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