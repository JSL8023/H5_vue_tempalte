/*
 * @Description: 公共方法封装
 *
 */

export function getQueryStringByName(name) {
  let result = document.location.search.match(new RegExp('[\?\&]' + name + '=([^\&]+)', 'i'))
  if (result == null || result.length < 1) return ''
  return result[1]
}

/**
 * 获取当前系统
 */

export function getSystem() {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/iPhone/i) === 'iphone') {
    return 'ios'
  } else if (ua.match(/Android/i) === 'android') {
    return 'android'
  }
}

/**
 * 当前打开环境
 */
export function getBrowserType() {
  let type
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    // 在微信中打开
    type = 'wx'
  }
  if (ua.match(/WeiBo/i) == 'weibo') {
    // 在新浪微博客户端打开
    type = 'weibo'
  }
  if (ua.match(/QQ/i) == 'qq') {
    // 在QQ空间打开
    type = 'qq'
  }
  if (ua.versions.ios) {
    // 是否在IOS浏览器打开
    type = 'ios'
  }
  if (ua.versions.android) {
    // 是否在安卓浏览器打开
    type = 'android'
  }

  return type
}

/**
 * 是否是iPhone X
 */
export function isIPhoneX() {
  let iphoneX = false
  var u = navigator.userAgent
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  if (isIOS) {
    if (screen.height == 896 && screen.width == 414) {
      iphoneX = true
    } else if (screen.height == 812 && screen.width == 375) {
      // 是iphoneX
      iphoneX = true
    }
  }
  return iphoneX
}

/**
 1. 设置title，解决微信改不了title的bug
 */
export function setTitle(title) {
  document.title = title
  let userAgent = window.navigator.userAgent.toLowerCase()
  let isiOS = userAgent.indexOf('applewebkit') >= 0
  let isWechat = userAgent.indexOf('micromessenger') >= 0
  if (isiOS && isWechat) {
    let iframe = document.createElement('iframe')
    // iframe.src = 'https://www.baidu.com/favicon.ico'
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onload = function () {
      setTimeout(function () {
        iframe.remove()
      }, 0)
    }
  }
}

// 利用canvas跨域下载图片（图片服务器已设置跨域）
export function imgDownload(imgsrc, name) {
  let image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function () {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    let blob = base64ToBlob(canvas.toDataURL('image/png')) // 得到图片的base64编码数据; base64转blob

    let a = document.createElement('a') // 生成一个a元素
    let event = new MouseEvent('click') // 创建一个单击事件
    a.download = name || 'wxCode' // 设置图片名称
    a.href = URL.createObjectURL(blob) // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  image.src = imgsrc
}

// base64转blob
function base64ToBlob(code) {
  let parts = code.split(';base64,')
  let contentType = parts[0].split(':')[1]
  let raw = window.atob(parts[1])
  let rawLength = raw.length

  let uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], {
    type: contentType
  })
}

// 图片上传

// 滑动限制
export function stopScrol() {
  var mo = function (e) {
    e.preventDefault()
  }
  document.body.style.overflow = 'hidden'
  document.addEventListener('touchmove', mo, false) // 禁止页面滑动
}

// 取消滑动限制
export function openScrol() {
  var mo = function (e) {
    e.preventDefault()
  }
  document.body.style.overflow = '' // 出现滚动条
  document.removeEventListener('touchmove', mo, false)
}
