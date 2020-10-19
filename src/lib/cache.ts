// 设置localstorage的方法
export const AUTH_TOKEN = 'auth_token'
export const LAST_PATH = 'login_register_last_path'

export const setCache = (key:string,value:string) => {
    window.localStorage.setItem(key,value)
}

export const getCache = (key:string) => {
    return window.localStorage.getItem(key)
}

export const clearCache = (key:string) => {
    return window.localStorage.removeItem(key)
}


export const getToken = () => {
    return getCache(AUTH_TOKEN)
}

export const setToken = (value:string)=>{
    setCache(AUTH_TOKEN,value)
}

export const clearToken = () => {
    clearCache(AUTH_TOKEN)
}

export const getLastPath = () => {
    return getCache(LAST_PATH)
}

export const setLastPath = (value:string)=>{
    setCache(LAST_PATH,value)
}

export const clearLastPath = () => {
    clearCache(LAST_PATH)
}