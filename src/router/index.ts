import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import AccountManage from '@/views/AccountManage.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import CashManage from '@/views/CashManage.vue'
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
