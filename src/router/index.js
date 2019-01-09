import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Users from '@/components/users'
import Rights from '@/components/rights'
import Roles from '@/components/roles'
import Goods from '@/components/goods'
import GoodsAdd from '@/components/goodsAdd'
import Params from '@/components/params'
import Categories from '@/components/categories'
import Orders from '@/components/orders'

import {
  Message
} from 'element-ui'

Vue.use(Router)

const router = new Router({
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
    }, {
      name: 'rights',
      path: '/rights',
      component: Rights
    }, {
      name: 'roles',
      path: '/roles',
      component: Roles
    }, {
      name: 'goods',
      path: '/goods',
      component: Goods
    }, {
      name: 'goodsAdd',
      path: '/goodsAdd',
      component: GoodsAdd
    }, {
      name: 'params',
      path: '/params',
      component: Params
    }, {
      name: 'categories',
      path: '/categories',
      component: Categories
    }, {
      name: 'orders',
      path: '/orders',
      component: Orders
    }]
  }]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    if (!localStorage.getItem('token')) {
      Message.warning('请先登录')
      router.push({
        path: '/login'
      })
    } else {
      next()
    }
  }
})

export default router
