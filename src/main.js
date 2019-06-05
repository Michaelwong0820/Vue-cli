// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
//引入element-tree-grid 插件
import ElTreeGrid from 'element-tree-grid'
//引入elementUi的样式文件
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
//引入axios插件
import myaxios from './assets/js/myaixos.js'
//引入moment插件
import mymoment from './assets/js/myfilter.js'
//引入css样式
import './assets/css/index.css'
//引入富文本
import VueQuillEditor from 'vue-quill-editor'

// require styles
import '../node_modules/quill/dist/quill.core.css'
import '../node_modules/quill/dist/quill.snow.css'
import '../node_modules/quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

// 使用axios插件
Vue.use(myaxios)
//使用moment插件
Vue.use(mymoment)
// 使用ElementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

//使用全局element-tree-grid
Vue.component(ElTreeGrid.name,ElTreeGrid)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
