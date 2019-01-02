import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: {
      name: 'login'
    }
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }, {
    name: 'home',
    path: '/home',
    component: Home
  }]
})