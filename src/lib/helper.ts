import { TB_DOMAIN } from './http'
export const completeImgUrl = (url: string) => {
    return TB_DOMAIN + url
}

// 计算时间的方法
export const transformTimeStampToDays = (time: string) => {
    const diff = Date.now() - new Date(time).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// 返回平台类型
export const getPlatFormByType = (type: number | string) => {
    return type == 1 ? "淘宝" : type == 2 ? "京东" : "拼多多"
}