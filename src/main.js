// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
//引入elementUi的样式文件
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
//引入axios插件
import myaxios from './assets/js/myaixos.js'
//引入css样式
import './assets/css/index.css'
// 使用axios插件
Vue.use(myaxios)
// 使用ElementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
