//封装时间插件
//引入moment
import moment from 'moment'

//定义时间对象
var mymoment = {}

//封装插件
mymoment.install = function (Vue) {
    Vue.filter('myfilter',function (value,string) { 
        return moment(value).format(string)
     })
}
//暴露过滤器
 export default mymoment