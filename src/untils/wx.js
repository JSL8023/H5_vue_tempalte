/*
 * @Description: 微信相关封装
 */

// 引入全局变量appid 微信授权需用到动态域名
import {
    appId,
    scope,
    addressCodeUrl,
    locationUrl
} from '@/config.js'

// 微信签名接口
import {
    wxSignature
} from '@/api/'

import {
    getQueryStringByName
} from '@/untils/index'
import router from '@/router'
import {
    saveOpenid
} from '@/api/jsl'

// const appId = "wx004631167cb38682"
let wxConfigData // 微信签名数据

export function getOpenid() {
    let dataInfo = {}
    dataInfo.jumpUrlData = window.location.href.split('//')[1]
    dataInfo.jumpUrl = dataInfo.jumpUrlData + '?actId=2'
    dataInfo.jumpUrl = window.btoa(dataInfo.jumpUrl)
    // dataInfo.jumpUrl = window.btoa('https://testactivity.meetao.com/')
    dataInfo.href =
    'http://www.fulibailing.top/service/silence/authBySnsapiUserInfo?appid=wx004631167cb38682&redirect_url=' +
    addressCodeUrl +
    'api/uc/auth/wx/auth/common?zmtUrl=' +
    dataInfo.jumpUrl +
    '&m=h5&v=1.0&pt=fxh5c&flag=44654454545151515132fdsfdf'
    window.location.replace(dataInfo.href)
}

export function getWXOpenid() {
    return new Promise((resolve, reject) => {
        let openid = getQueryStringByName('openid')
        if (!openid) {
            // 没有code获取code
            getOpenid()
        } else {
            // 利用code获取用户信息
            resolve(openid)
        }
    })
}
export function verifyOpenid() {
    // 只用调这一个函数就行
    // 无openid 跳转授权后 回调力哥接口
    // if (!window.localStorage.getItem('openid')) {
    return new Promise((resolve, reject) => {
        getWXOpenid().then(data => {
            // 190329 差力哥回调
            saveOpenid({
                openId: data
            }).then(res => {
                console.log('力哥授权回调', res)
                if (res.tag == 0) {
                    window.localStorage.setItem('openid', data)
                    // 授权成功 跳转来时的页面 不刷新会留白
                    window.location.reload()
                }
            })
        })
    // }
    })
}

// 调起微信用户授权
export function getWXCode() {
    let url = window.location.href
    let redirectUrl = window.encodeURIComponent(url)
    let paramsAppId = appId || 'wx004631167cb38682'
    let paramsScope = scope || 'snsapi_userinfo'
    let authUrl =
    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
    paramsAppId +
    '&redirect_uri=' +
    redirectUrl +
    '&response_type=code&scope=' +
    paramsScope +
    '&state=STATE#wechat_redirect'
    window.location.replace(authUrl)
}

// 授权登录
export function getWXToken() {
    return new Promise((resolve, reject) => {
        let code = getQueryStringByName('code')
        if (!code) {
            // 没有code获取code
            getWXCode()
        } else {
            // 利用code获取用户信息
            resolve()
        }
    })
}

// 微信JSSDK授权
export function WX_INIT() {
    return new Promise((resolve, reject) => {
        let lUrl = window.location.href
        wxSignature({
            url: lUrl
        }).then(function (res) {
            wxConfigData = {
                nonceStr: res.noncestr,
                signature: res.signature,
                timestamp: res.timestamp
            }
            init(wxConfigData)
        })

        function init(data) {
            return new Promise((resolve, reject) => {
                wx.config({
                    debug: false,
                    appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见附录1

                    // 需要微信权限列表
                    jsApiList: [
                        // 分享
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        // 'onMenuShareQQ',
                        // 'onMenuShareQZone',
                        // 'onMenuShareWeibo',

                        // 菜单操作
                        'hideOptionMenu',
                        'showOptionMenu',
                        'hideMenuItems',
                        'showMenuItems',

                        // 图片操作
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage'
                    ]
                })
                wx.ready(function () {
                    console.log('wx分享授权成功')
                    resolve()
                })
            }).catch(error => {
                reject(error)
            })
        }

        wx.error(function (res) {
            // alert(res.toString());
        })
    }).catch(error => {
        console.log('wx分享参数报错', error)
        reject(error)
    })
}

// 微信分享
export function WX_SHARE(shareObj = {}) {
    return new Promise((resolve, reject) => {
        let shareInfo = {
            imgUrl: shareObj.imgUrl || 'http://h5.meetao.com/h5/rice_zmtActive.jpeg',
            desc: shareObj.desc ||
        '描述',
            title: shareObj.title ||
        '标题',
            link: shareObj.link || (locationUrl), // window.location.href,
            success: function () {
                // 分享成功后的回调函数
            },
            cancel: function () {
                // 用户取消分享执行的回调函数
                console.log('取消分享')
            }
        }

        // 签名数据
        let lUrl = window.location.href
        wxSignature({
            url: lUrl
        }).then(function (res) {
            // console.log('微信分享授权', res)
            wxConfigData = {
                nonceStr: res.noncestr,
                signature: res.signature,
                timestamp: res.timestamp
            }
            init(wxConfigData)
        })

        function init(data) {
            return new Promise((resolve, reject) => {
                wx.config({
                    debug: false,
                    appId, // 和获取Ticke的必须一样------必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见附录1

                    // 需要微信权限列表
                    jsApiList: [
                        // 分享
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline'
                    ]
                })
                wx.ready(function () {
                    // 分享给好友
                    wx.onMenuShareAppMessage(shareInfo)

                    // 分享到朋友圈
                    wx.onMenuShareTimeline(shareInfo)
                    resolve()
                })
            })
        }

        wx.error(function (res) {
            console.log('wx分享参数报错1', res)
        })
    }).catch(error => {
        console.log('wx分享参数报错2', error)
        reject(error)
    })
}
