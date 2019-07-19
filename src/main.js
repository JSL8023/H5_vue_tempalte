// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import vFilters from './untils/filter.js'

// 按需引入vant组件
import {
    Loading,
    Swipe,
    SwipeItem,
    Toast,
    Dialog,
    Icon,
    Row,
    Col,
    Tab,
    Tabs,
    Popup,
    List
} from 'vant'

// 调试工具，上线注销
// import './untils/vconsole.min'
// var vConsole = new VConsole()

Vue.use(Loading).use(Swipe).use(SwipeItem).use(Toast).use(Icon).use(Row).use(Col).use(Dialog).use(Popup).use(Tab).use(Tabs).use(List)
// 注册全局过滤器

Object.keys(vFilters).forEach(key => Vue.filter(key, vFilters[key]))

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>'
})
