import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/login')
const Home = () => import('@/components/home')
const Users = () => import('@/components/users')
const Rights = () => import('@/components/rights')
const Roles = () => import('@/components/roles')
const Goods = () => import('@/components/goods')
const GoodsAdd = () => import('@/components/goodsAdd')
const Params = () => import('@/components/params')
const Categories = () => import('@/components/categories')
const Orders = () => import('@/components/orders')
const Reports = () => import('@/components/reports')

Vue.use(VueRouter)

const router = new VueRouter({
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
    }, {
      name: 'reports',
      path: '/reports',
      component: Reports
    }]
  }]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    if (!localStorage.getItem('token')) {
      router.push({
        path: '/login'
      })
    } else {
      next()
    }
  }
})

export default router
