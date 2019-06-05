//自己封装axios插件
//导入axios
import axios from 'axios'

//创建插件对象
var myaxios = {}

myaxios.install = function (Vue) {
    //使用axios拦截器排除login的token
    axios.interceptors.request.use(function (config) {
        if (config.url !== 'login') {
            //设置统一token命令
            config.headers.common['Authorization'] = localStorage.getItem('token') 
        }
        return config
    })

    //添加统一路径
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    //在Vue实例中添加axios
    Vue.prototype.$http = axios
}

//暴露插件对象
export default myaxios