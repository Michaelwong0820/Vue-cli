import Vue from 'vue'
import Router from 'vue-router'

// 引入login组件
import Login from '../components/login/login.vue'
// 引入home组件
import Home from '../components/home/home.vue'
//引入 users 组件
import Users from '../components/users/users.vue'


Vue.use(Router)

export default new Router({
  routes: [
    //重定向根目录
    {path: '/',redirect: {name:'home'}},
    {path: '/login', name: 'login', component: Login},
    {path: '/home', name: 'home', component: Home,
    children:[
      {path:'/users',name:'users',component:Users}//给home添加子路由
    ]},
  ]
})
