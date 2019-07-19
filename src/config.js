// 微信相关
const appId = 'wx004631167cb38682'
// snsapi_userinfo:弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息
// snsapi_base: 不弹出授权页面，直接跳转，只能获取用户openid;
const scope = 'snsapi_userinfo'

// 配置编译环境和线上环境之间的切换
let sitUrl = '' // 新接口域名
let commonUrl = '' // 认证接口
let baseUrl = '' // 分销接口
let addressTest = '' // 分销接口`
let addressCodeUrl = '' // 认证接口
let addressUrl = '' // fx - 未用到
let locationUrl = 'http://0.0.0.0:8080/'
if (process.env.NODE_ENV === 'development') {
    addressCodeUrl = 'https://testoauth.meetao.com/' // code - 开发
    // addressCodeUrl = "https://preoauth.meetao.com/"; //code - 预生产
    // addressCodeUrl = "https://oauth.meetao.com/"; //code - 生产

    addressTest = 'https://testsvr.meetao.com/' // 开发
    // addressTest = 'https://presvr.meetao.com/' // 预生产
    // addressTest = 'https://svr.meetao.com/' // 生产

    addressUrl = 'https://testfx.meetao.com/' // 分销封闭开发海林替换专用
    // addressUrl = "https://prefx.zimeitang.cn/"; //分销-预生产
    // addressUrl = "https://svr.meetao.com/"; //分销-生产

    sitUrl = 'https://devsit.meetao.com/' // 新接口域名
} else if (process.env.NODE_ENV === 'production') {
    // 打包上线环境

    // 根据不同的环境切换接口请求路径
    switch (window.location.origin) {
    // 开发环境
    case 'https://devaiskc.meetao.com':
        addressCodeUrl = 'https://testoauth.meetao.com/'
        baseUrl = 'https://testsvr.meetao.com/'
        addressTest = 'https://testsvr.meetao.com/'
        locationUrl = 'https://devaiskc.meetao.com/'
        sitUrl = 'https://devsit.meetao.com/' // 新接口域名
        break

        // 预生产环境
    case 'https://fataiskc.meetao.com':
        addressCodeUrl = 'https://preoauth.meetao.com/'
        baseUrl = 'https://prefx.zimeitang.cn/'
        addressTest = 'https://presvr.meetao.com/'
        locationUrl = 'https://fataiskc.meetao.com/'
        sitUrl = 'https://fatsit.meetao.com/' // 新接口域名
        break

        // 灰度环境
    case 'https://uataiskc.meetao.com':
        addressCodeUrl = 'https://grayoauth.meetao.com/'
        baseUrl = 'https://grayfx.meetao.com/'
        addressTest = 'https://graysvr.meetao.com/'
        locationUrl = 'https://uataiskc.meetao.com/'
        sitUrl = 'https://uatsit.meetao.com/' // 新接口域名

        break

        // 生产环境
    case 'https://aiskc.meetao.com':
        addressCodeUrl = 'https://oauth.meetao.com/'
        baseUrl = 'https://fx.zimeitang.cn/'
        addressTest = 'https://svr.meetao.com/'
        locationUrl = 'https://aiskc.meetao.com/'
        sitUrl = 'https://sit.meetao.com/' // 新接口域名
        break
    }
}
export {
    appId,
    scope,
    baseUrl,
    commonUrl,
    addressCodeUrl,
    locationUrl,
    addressTest,
    sitUrl
}
