/**
 * @description 网络请求框架封装
 * 190713 更改全局变量 去除登录跳转 JSL
 */

import Axios from 'axios'
import QS from 'querystring'
import router from '../../router/index'
import {
    sitUrl
} from '../../config.js'
import {
    Toast
} from 'vant'

// TODO 设置请求基本路径，所有请求路径之前会加上基本路径
Axios.defaults.sitUrl = sitUrl

// TODO 设置超时时间
Axios.defaults.timeout = 100000

// TODO 设置请求头
Axios.defaults.headers = {
    // 'Content-Type': 'application/json; charset=utf-8'
    // 'Content-Type': 'application/x-www-form-urlencoded'
    // 'Content-Type': 'multipart/form-data'
}

// TODO http code 校验
Axios.defaults.validateStatus = function (status) {
    return status
}

// TODO GET 请求 params 序列化
Axios.defaults.paramsSerializer = function (params) {
    return QS.stringify(params)
}

// TODO 设置POST等请求 body 序列化
Axios.defaults.transformRequest = [function (body) {
    let data = body || {}
    if (body instanceof window.FormData) {
        return body
    }
    return JSON.stringify(data)
}]

// TODO 设置统一请求拦截
Axios.interceptors.response.use(response => {
    // if (response.data && response.data.tag !== 0) {
    //     console.log('************tag !== 0*************', response)
    // }
    if (response.data && response.data.tag === 1 && response.data.errMsg === 'token time out.') {
        console.log('登录过期，请重新登录！')
        setTimeout(function () {
            Dialog.alert({
                // message: '登录过期，请重新登录！'
                message: response.data.errMsg
            }).then(() => {
                // on close
                // router.push('/login')
            })
        }, 100)
    }
    return response.data
}, error => {
    console.log('网络连接失败！请检查网络状态')
    return Promise.reject(error)
})

/**
 * @description 统一 GET 请求
 * @param url
 */
function GET(url, params, option) {
    // 2019 年7月17日  连续点击事件防重校验 此项目用不到！
    // const toast = Toast.loading({
    //     mask: true,
    //     message: '加载中...'
    // })

    url = url.indexOf('//') > -1 ? url : sitUrl + url
    if (option) {
        for (var property in option) {
            Axios.defaults[property] = option[property]
        }
    }
    // 公共参数

    let userId = window.localStorage.getItem('userId')
    let simtToken = window.localStorage.getItem('simt_token')
    params.userId = userId
    params.simt_token = simtToken
    // access_token ? params.access_token = access_token : ''
    // params.m_ = 'h5'
    // params.v_ = '1.0'
    // params.pt_ = 'fxh5c'
    // params.actId = window.sessionStorage.getItem('actId') || 2

    return new Promise((resolve, reject) => {
        Axios.get(url, {
            params
        })
            .then(response => {
                // toast.clear()
                resolve(response)
            })
            .catch(error => {
                // toast.clear()
                reject(error)
            })
    })
}
// GET2 为不带通用参数封装请求方法
function GET2(url, params, option) {
    url = url.indexOf('//') > -1 ? url : sitUrl + url
    if (option) {
        for (var property in option) {
            Axios.defaults[property] = option[property]
        }
    }
    return new Promise((resolve, reject) => {
        Axios.get(url, {
            params
        })
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    })
}

/**
 * @description 统一 POST 请求
 * @param url
 * @param body --> POST 请求 data
 */
function POST(url, body, option) {
    url = url.indexOf('//') > -1 ? url : sitUrl + url
    if (option) {
        for (var property in option) {
            Axios.defaults[property] = option[property]
        }
    }
    // 公共参数
    let userId = window.localStorage.getItem('userId')
    let simtToken = window.localStorage.getItem('simt_token')
    body.userId = userId
    body.simt_token = simtToken

    body = window.encodeURI(JSON.stringify(body))
    return new Promise(function (resolve, reject) {
        Axios.post(url, body)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export {
    GET,
    GET2,
    POST
}
