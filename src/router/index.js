import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.js'
import {
    setTitle
} from '@/untils/index.js'
// 微信二次分享
import {
    verifyOpenid,
    WX_SHARE
} from '@/untils/wx.js'

Vue.use(Router)

const vueRouter = new Router({
    linkActiveClass: 'router-active',
    // linkExactActiveClass: 'router-active',
    mode: 'history',
    // mode: 'hash', // 避免wx签名失效的坑
    routes
})

vueRouter.beforeEach((to, from, next) => {
    next()
})

vueRouter.afterEach((to, from) => {
    // 设置标题
    setTitle(to.meta.title)
})

export default vueRouter
