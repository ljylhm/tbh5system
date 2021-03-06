import RouterHelper from '@libs/router';
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../views/Login.vue'
import Forget from '../views/Forget.vue'
import Register from '../views/Register.vue'
import Guide from '../views/Guide.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: {
            title:"客户端-用户登录"
        }
    },
    {
        path: '/forget',
        name: 'Forget',
        component: Forget,
        meta: {
            title: "忘记密码"
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            title: "注册"
        }
    },
    {
        path: '/guide',
        name: 'Guide',
        component: Guide,
        meta: {
            title: "下载"
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
