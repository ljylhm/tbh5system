// 关于邀请的一些接口
import { httpGet, httpPost } from '@/lib/http';
import { ILogin, IRegister } from '@/constance/login';

// 获取邀请记录
export const getInviteList = (form:any = {
    page: 1,
    limit: 20
}) => {
    return httpPost("/api/invited/list",form)
}

// 获取邀请资金记录
export const getInviteChargeList = (form:any = {
    page: 1,
    limit: 20
}) => {
    return httpPost("/api/invited/charge",form)
}