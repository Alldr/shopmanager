import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Users from '@/components/users'

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
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: Users
    }]

  }]
})
