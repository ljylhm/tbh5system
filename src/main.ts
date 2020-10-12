import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'lib-flexible/flexible'
import { httpGet } from './lib/http';
import { setProvinceData } from '@/config/province';
import { getProvinceNet } from '@/service/province';
import Vant from 'vant';

import 'vant/lib/index.css';
import 'element-ui/lib/theme-chalk/index.css';
import './style/reset.scss'
import './style/base.scss'

Vue.use(Vant);
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),

  async created(){
    await getProvinceNet()
  }

}).$mount('#app')
