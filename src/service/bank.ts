import { httpGet, httpPost } from '@/lib/http';

// 新增银行卡的操作
export const addBank = (form:any) => {
    return httpPost("/api/charge/bank_add",form)
}

// 修改银行卡的操作
export const editBank = (form:any) => {
    return httpPost("/api/charge/bank_update",form)
}

// 获取绑定银行卡的信息
export const getBank = () => {
    return httpPost("/api/charge/bank_get")
}

// 删除银行卡
export const deleteBank = (id:any) => {
    return httpPost("/api/charge/bank_delete",{
        id
    })
}

