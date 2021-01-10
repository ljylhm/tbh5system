import { httpGet, httpPost } from '@/lib/http';
import { ILogin, IRegister } from '@/constance/login';

// 接手订单
export const receiveOrder = (type:number,id:number) => {
   return httpPost("/api/order/get",{
       type,
       id
   })
}

// 获取订单列表
export const getOrderList = (form:any) => {
    return httpPost("/api/order/list",form)
}

export const getChareList = (form:any = {}) => {
    return httpPost<any>("/api/charge/list",form)
}

// 获取单条订单的详情
export const getOrderDetail = (id:any) => {
    return httpPost("/api/order/one",{
        id
    })
}

// 验证流量任务
export const verifyFlowMission = (id:any,verify:any) => {
    return httpPost("/api/order/verify",{
        id,
        task_type: 1,
        verify
    })
}

// 验证流量任务
export const verifySaleMission = (id:any,verify:any) => {
    return httpPost("/api/order/verify",{
        id,
        task_type: 0,
        verify
    })
}

// 收货接口
export const confirmGoods = (id:any) => {
    return httpPost("/api/order/take",{
        id
    })
}

// 提现申请
export const cashOut = (form:any) => {
    return httpPost("/api/charge/advance",form)
}

// 验证店铺
export const verifyStep = (form:any) => {
    return httpPost("/api/order/verify_buyer",form)
}


// 第一步接单
export const getStepOneOrder = (form:any) => {
    return httpPost("/api/order/buyer_step",form)
}

// 查询转账管理
export const getTransFer = (form:any = {}) => {
    return httpPost<any>("/api/transfer/list",form)
}

// 更新状态
export const upDateTransFer = (id:any,status:any) =>{
    return httpPost("/api/transfer/update",{
        id,
        status
    })  
}

// 更新状态
export const advanceAction = (form:any) =>{
    return httpPost("/api/charge/advance",form)  
}

// 更新状态
export const getAdvanceList = () =>{
    return httpPost<any>("/api/charge/advance_list")  
}

// 获取每天能接入多少单
export const getUserOrderNum = () => {
    return httpPost("/api/order_num")
}

// 获取评论列表
// is_evaluate
export const getCommentList = (form:any) => {
    return httpPost("/api/task/evaluate_list_buyer",form)
}

// 取消任务
export const cancelOrder = (id:any) => {
    return httpPost("/api/order/cancel",{
        id,
        type: 0
    })
}

// 开始任务
export const completeOrder = (form:any) => {
    return httpPost("/api/task/evaluate_complete",form)
}

export const completeOrderGo = (form:any) => {
    return httpPost("/api/task/evaluate_complete_go",form)
}


// 转账评论
export const transferComment = (form:any) => {
    return httpPost("/api/transfer/comment",form)
}

export const getTransferComment = (id:any) => {
    return httpPost("/api/transfer/comment_list",{
        id
    })
}

// 获取工单列表
export const getWorkList = (form:any) => {
    return httpPost("/api/work/list",form)
}


// 新建工单
export const addWorkItem = (form:any) => {
    return httpPost("/api/work/add",form)
}

// 修改工单状态
export const upDateWorkOrderStatus = (id:number,status:any) => {
    return httpPost("/api/work/update",{
        id,
        status
    })
}

// 获取工单详情
export const getWorkOrderDetailInfo = (id:number) => {
    return httpPost("/api/work/get",{
        id
    })
}

// 获取工单评论的接口
export const getWorkComment = (id:number) => {
    return httpPost("/api/work/comment_list",{
        id
    })
}

// 工单评论的接口
export const workOrderComment = (form:any) => {
    return httpPost("/api/work/comment",form)
}


// 反馈
export const feedBack = (id:any) => {
    return httpPost("/api/task/evaluate_buyer_feedback",{
        id
    })
}