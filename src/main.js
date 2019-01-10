// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import Http from '@/plugins/http.js'
import App from './App'
import MyBread from '@/components/cusBread.vue'
import router from '@/router'
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(Http)
Vue.use(ELEMENT)
Vue.component(MyBread.name, MyBread)
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
