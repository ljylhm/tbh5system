import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import AccountManage from '@/views/AccountManage.vue'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
