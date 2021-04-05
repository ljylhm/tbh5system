import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import HomeTg from '../views/HomeTg.vue'
import AccountManage from '@/views/AccountManage.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import CashManage from '@/views/CashManage.vue'
import UserOrder from '@/views/UserOrder.vue'
import FlowMission from '@/views/FlowMission.vue'
import SaleMission from '@/views/SaleMission.vue'
import CashOut from '@/views/CashOut.vue'
import ChareManage from '@/views/ChareManage.vue'
import Address from '@/views/Address.vue'
import BindBank from '@/views/BindBank.vue'
import CommentMission from '@/views/CommentMission.vue'
import CommentList from '@/views/CommentList.vue'
import ApplyPay from '@/views/ApplyPay.vue'
import CashPic from '@/views/CashPic.vue'
import WorkOrderDetail from '@/views/WorkOrderDetail.vue'
import WorkOrderList from '@/views/WorkOrderList.vue'
import WorkOrderDetailTwo from '@/views/WorkOrderDetailTwo.vue'
import InviteDetail from '@/views/InviteDetail.vue'
import InviteDetailOne from '@/views/inviteDetailOne.vue'
import InviteCharge from '@/views/InviteCharge.vue'
import RouterHelper from '@/lib/router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      title: "客户端-用户登录"
    }
  },
  {
    path: '/accountManage',
    name: 'AccountManage',
    component: AccountManage,
    meta:{
      title: "买号管理"
    }
  },
  {
    path: '/createAccount',
    name: 'CreateAccount',
    component: CreateAccount,
    meta:{
      title: "编辑管理"
    }
  },
  {
    path: '/cashManage',
    name: 'CashManage',
    component: CashManage,
    meta:{
      title: "编辑管理"
    }
  },
  {
    path: '/userOrder',
    name: 'UserOrder',
    component: UserOrder,
    meta:{
      title: "接手管理"
    }
  },
  {
    path: '/flowMission',
    name: 'FlowMission',
    component: FlowMission,
    meta:{
      title: "流量任务"
    }
  },
  {
    path: '/saleMission',
    name: 'SaleMission',
    component: SaleMission,
    meta:{
      title: "销量任务"
    }
  },
  {
    path: '/cashOut',
    name: 'CashOut',
    component: CashOut,
    meta:{
      title: "销量任务"
    }
  },
  {
    path: '/chareManage',
    name: 'ChareManage',
    component: ChareManage,
    meta:{
      title: "销量任务"
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta:{
      title: "地址选择"
    }
  },
  {
    path: '/bindBank',
    name: 'BindBank',
    component: BindBank,
    meta:{
      title: "绑定银行卡"
    }
  },
  {
    path: '/commentMission',
    name: 'CommentMission',
    component: CommentMission,
    meta:{
      title: "绑定银行卡"
    }
  },
  {
    path: '/commentList',
    name: 'CommentList',
    component: CommentList,
    meta:{
      title: "绑定银行卡"
    }
  },
  {
    path: '/applyPay',
    name: 'ApplyPay',
    component: ApplyPay,
    meta:{
      title: "提现申请"
    }
  },
  {
    path: '/cashPic',
    name: 'CashPic',
    component: CashPic,
    meta:{
      title: "查看截图"
    }
  },
  {
    path: '/workOrderDetail',
    name: 'WorkOrderDetail',
    component: WorkOrderDetail,
    meta:{
      title: "系统工单"
    }
  },
  {
    path: '/workOrderList',
    name: 'WorkOrderList',
    component: WorkOrderList,
    meta:{
      title: "工单列表"
    }
  },
  {
    path: '/workOrderDetailTwo',
    name: 'WorkOrderDetailTwo',
    component: WorkOrderDetailTwo,
    meta:{
      title: "工单详情"
    }
  },
  {
    path: '/inviteDetail',
    name: 'InviteDetail',
    component: InviteDetail,
    meta:{
      title: "邀请明细"
    }
  },
  {
    path: '/inviteCharge',
    name: 'InviteCharge',
    component: InviteCharge,
    meta:{
      title: "邀请资金明细"
    }
  },
  {
    path: '/homeTg',
    name: 'HomeTg',
    component: HomeTg,
    meta:{
      title: "首页"
    }
  },
  {
    path: '/inviteDetailOne',
    name: 'InviteDetailOne',
    component: InviteDetailOne,
    meta:{
      title: "邀请人详情"
    }
  }
]



const router = new VueRouter({
  routes
})

const routerHelper = new RouterHelper(router)

export {
    routerHelper
}


export default router
