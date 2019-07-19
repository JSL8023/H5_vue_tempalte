/*
 * @Desc: 接口汇总
 * @Author: JSL
 * @Date: 2019-03-05
 */

import {
    GET,
    POST
} from './config/index.js'
import {
    addressCodeUrl,
    addressTest
} from '../config.js'

// 登录短信验证
export const fxCode = (params, options) => {
    let url = addressCodeUrl + 'api/uc/sms/code/get/v3.json'
    return GET(url, params, options)
}
// 最终登录接口 - H5分销登录
export const fxH5Login = param => {
    let url = addressCodeUrl + 'api/uc/auth/h5/fx/login'
    return GET(url, param)
}
// 授权后给后台发送openid
export const saveOpenid = param => {
    let url = addressTest + 'api/lc/user/save.json'
    return GET(url, param)
}
// 登录力哥补录参数
export const saveSpl = param => {
    let url = addressTest + 'api/lc/user/save/spl.json'
    return GET(url, param)
}
