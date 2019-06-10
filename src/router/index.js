import Vue from 'vue'
import Router from 'vue-router'

// 引入login组件
const Login = () => import('../components/login/login.vue')
// 引入home组件
const Home = () => import('../components/home/home.vue')
//引入 users 组件
const Users = () => import('../components/users/users.vue')
//引入 rights 组件
const Rights = () => import('../components/rights/rights.vue')
//引入 roles 组件
const Roles = () => import('../components/roles/roles.vue')
//引入 goodslist 组件
const Goods = () => import('../components/goods/goods.vue')
//引入categories 组件
const Categories = () => import('../components/categories/categories.vue')
//引入goodsadd 组件
const Goodsadd = () => import('../components/goodsadd/goodsadd.vue')
//引入orders 组件
const Orders = () => import('../components/orders/orders.vue')
//引入reports 组件
const Reports = () => import('../components/reports/reports.vue')
//引入message  
import { Message } from 'element-ui'


Vue.use(Router)

var router = new Router({
  routes: [
    //重定向根目录
    {path: '/',redirect: {name:'home'}},
    {path: '/login', name: 'login', component: Login},
    {path: '/home', name: 'home', component: Home,
    children:[
      {path:'/users',name:'users',component:Users},//给home添加子路由 users
      {path:'/rights',name:'rights',component:Rights},//给home添加子路由 rights
      {path:'/roles',name:'roles',component:Roles},//给home添加子路由 roles
      {path:'/goods',name:'goodslist',component:Goods},//给home添加子路由 goodslist
      {path:'/categories',name:'categories',component:Categories},//给home添加子路由 categories
      {path:'/goods/add',name:'goodsadd',component:Goodsadd},//给home添加子路由 goodsadd
      {path:'/orders',name:'orders',component:Orders},//给home添加子路由 orders
      {path:'/reports',name:'reports',component:Reports}//给home添加子路由 reports
    ]},
  ],
})
//设置页面导航卫士
router.beforeEach((to,from,next)=>{
  // console.log(to);
  // console.log(from);
  //如果当前页面不是登录页面时执行下面代码
  if(to.path !='/login') {
    if (!localStorage.getItem('token')) {
      Message({
        type:'error',
        message:'还没有登录'
      })
      //跳转到登录页面
      router.push({name:'login'})
      return
    }
  }
  next()
  
  
})

export default router
