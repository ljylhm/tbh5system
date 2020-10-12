import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import Vant from 'vant';

import 'vant/lib/index.css';
import '../style/reset.scss'

Vue.use(Vant);

Vue.config.productionTip = false

router.beforeEach((to,from,next)=>{
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#login')
