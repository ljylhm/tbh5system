// 判断环境的一些方法
export const isWx = () => {
    let ua = navigator.userAgent.toLowerCase();
    let res = ua.match(/MicroMessenger/i)
    console.log("res res",res)
    if (res && res[0] == "micromessenger") {
        return true
    }else {
        return false
    }
}