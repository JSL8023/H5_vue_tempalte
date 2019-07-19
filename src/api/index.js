/**
 * @describe  存放各种API请求
 * @example GET(url, query, options)
 *          POST(url, body, options)
 */

import {
    GET,
    GET2,
    POST
} from './config/index.js'
import {
    addressCodeUrl
} from '../config.js'

// 微信签名
export function wxSignature(params, options) {
    let url = addressCodeUrl + 'api/uc/auth/getSignature/v2'
    // let url = 'https://testoauth.meetao.com/api/uc/auth/getSignature/v2'
    return GET2(url, params, options)
}
