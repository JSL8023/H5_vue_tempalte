<style scoped lang="less">
.enter-box {
  width: 100%;
  height: 100%;
  background: #ffffff;
}

/*信息录入框*/

.entering-info {
  position: absolute;
  top: 8%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 4px;
  z-index: 20;
  width: 80%;
  max-width: 350px;
  min-width: 290px;
  min-height: 300px;
  margin: 0 auto;
}

.enter-close {
  font-size: 18px;
  float: right;
  display: block;
  width: 28px;
  text-align: center;
  line-height: 28px;
  height: 28px;
  cursor: pointer;
  overflow: hidden;
}

.enter-logo {
  width: 100%;
  text-align: center;
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 1px;
  color: #333333;
  overflow: hidden;
  margin-bottom: 20px;
}

.entering-box {
  width: 100%;
  min-width: 250px;
  max-width: 310px;
  height: 33px;
  line-height: 30px;
  margin: 0 auto;
  border-bottom: 1px solid #e7e7e9;
  margin-bottom: 10px;
  position: relative;
}

.icon-shouji-copy {
  font-size: 28px !important;
}

input {
  display: inline-block;
  font-size: 16px;
  height: 30px;
  color: #321f04;
  width: 100%;
  vertical-align: middle;
  border: none;
  outline: 0 none;
  -webkit-appearance: none;
}

.warringInfo {
  min-width: 250px;
  max-width: 310px;
  color: #ffae00;
  line-height: 22px;
  height: 22px;
  font-size: 14px;
  margin: 0 auto;
  margin-top: -5px;
  position: relative;
}
.warringInfo .pull-right {
  cursor: pointer;
  float: right;
  font-size: 13px;
  color: #999999;
}
.submit-btn {
  min-width: 250px;
  max-width: 310px;
  height: 40px;
  line-height: 40px;
  background-color: #dbdbdb;
  border-radius: 15px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  margin: 0 auto;
  font-weight: bold;
  margin-top: 20px;
}

.submit-btn.active {
  background-color: #ffae00;
  cursor: pointer;
}

.getCode {
  position: absolute;
  right: 0;
  display: inline-block;
  font-size: 13px;
  color: #918f8c;
  letter-spacing: 0.16px;
  width: 90px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  z-index: 2;
  background: #f2f3f5;
  border-radius: 30px;
}

.getCode.active {
  background: #ffae00;
  color: #ffffff;
}

.margin-bom-40 {
  margin-bottom: 40px;
}
.entering-text {
  font-size: 15px;
  color: #999999;
  letter-spacing: 0;
  line-height: 24px;
  text-align: left;
  margin-bottom: 30px;
}
input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #b4b3b0;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #b4b3b0;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #b4b3b0;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #b4b3b0;
}
.enter-code {
  display: inline-block;
  width: 66%;
  border-bottom: 1px solid #e7e7e9;
}
.noborder {
  border: none;
}
</style>

<template>
  <div class="enter-box">
    <div class="entering-info">
      <div class="entering-text">绑定手机号，方便我们向您发送中奖通知，优先领取大奖，姿美堂承诺不会外泄。</div>
      <div class="entering-box margin-bom-40">
        <input maxlength="11"
               v-model="phone"
               type="tel"
               placeholder="请输入手机号"
               @blur="blurMouse"
               value="" />
      </div>
      <div class="entering-box noborder">
        <div class="enter-code">
          <input maxlength="6"
                 v-model="code"
                 type="tel"
                 placeholder="请输入验证码"
                 @blur="blurMouse"
                 value="" />
        </div>
        <span :class="['getCode',codeNum==1?'active':'']"
              v-text="getCodeInfo"
              @click="getCode">获取验证码</span>
      </div>
      <div class="warringInfo">
        <span v-text="warringInfo"></span>
        <span class="pull-right"
              @click='getYYCode'>收不到验证码？</span>
      </div>
      <div class="submit-btn"
           :class="{'active':active}"
           @click="submit">绑定</div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { WX_SHARE } from '@/untils/wx'// 微信分享
import {
    fxCode,
    fxH5Login,
    saveSpl
} from '@/api/jsl.js'
export default {
    name: 'login',

    components: {},

    props: {},
    mounted () {
    // window.wx.hideOptionMenu()
        WX_SHARE()
    },
    data () {
        return {
            getCodeInfo: '获取验证码',
            warringInfo: '',
            phone: '',
            code: '',
            isWx: 1,
            codeNum: 1,
            statusSwitch: 1,
            isYY: 1,
            openId: window.localStorage.getItem('openid'),
            userId: ''
        }
    },

    computed: {
        active () { // 手机号 code监听
            return !!/^1[0-9]\d{9}$/.test(this.phone) && this.code.length == 6
        },
        codeStatus () {
            return !!/^1[0-9]\d{9}$/.test(this.phone)
        }
    },

    methods: {
        blurMouse () { // 解决底部露底bug
            document.body.scrollTop = 0
        },
        saveSplInfo () {
            let that = this
            saveSpl({
                openId: this.openId,
                userId: this.userId,
                phone: this.phone
            }).then(data => {
                console.log('力哥补录参数', data)
                if (data.tag == 0) {
                    that.jump()
                } else {
                    that.warringInfo = data.errMsg
                }
            })
        },
        jump () { // 登录成功跳转填写个人信息
            this.$router.go(-1)
        },
        submit () { // H5分销登录 - 填写手机号
            if (!!this.active && this.statusSwitch == 1) { // 符合点击条件且只点击了一次
                this.statusSwitch = 2
                const that = this
                fxH5Login({
                    phone: this.phone,
                    verifyCode: this.code,
                    type: 1,
                    openId: this.openId,
                    shopCode: ''
                }).then(data => {
                    console.log(data)
                    if (data.tag == 0) { // 保存本地 然后跳转上一页面
                        window.localStorage.setItem('uniqueCode', data.data.result.data.uniqueCode)
                        window.localStorage.setItem('access_token', data.data.result.data.access_token)
                        this.userId = data.data.result.data.uniqueCode
                        that.saveSplInfo()
                    } else {
                        that.warringInfo = data.errMsg
                    };
                    that.statusSwitch = 1
                })
            };
        },
        getYYCode: function () { // 获取语音验证码
            this.warringInfo = ''
            if (this.codeNum == 2) {
                this.$dialog.alert({
                    title: '正在获取短信验证码，请稍后'
                })
            } else if (!(/^1[0-9]\d{9}$/.test(this.phone))) {
                this.warringInfo = '请输入正确手机号'
            } else {
                this.$dialog.confirm({
                    title: '确认接听语音验证码'
                }).then(() => {
                    this.codeNum = 2
                    this.isYY = 0
                    this.getCoding()
                })
            };
        },
        getCode () { // 获取短信验证码
            this.warringInfo = ''
            if (this.codeNum == 1) { // 发送短信 - start
                if (!(/^1[0-9]\d{9}$/.test(this.phone))) {
                    this.warringInfo = '请输入正确手机号'
                } else {
                    this.codeNum = 2
                    this.getCodeInfo = '发送中..'
                    this.isYY = 1
                    this.getCoding()
                };
            }; // 发送短信 - end
        },
        getCoding: function () { //  获取短信code
            const dataInfo = {},
                that = this
            dataInfo.timestamp = new Date().getTime().toString()
            dataInfo.phone = ''
            this.phone.split('').forEach(function (item, index) {
                index == 0 || index == 2 || index == 4 || index == 6 || index == 8 ? dataInfo.phone += item : ''
            })
            dataInfo.phoneNum = md5(md5(this.phone.toString()) + (dataInfo.phone + dataInfo.timestamp).toString())
            fxCode({
                phone: this.phone,
                code: dataInfo.timestamp,
                sign: dataInfo.phoneNum,
                msgType: 'H5FXDLYZM',
                isYY: this.isYY
            }).then(data => {
                console.log(data)
                if (data.tag == 0) {
                    dataInfo.dataTime = 60
                    dataInfo.times = setInterval(function () {
                        if (dataInfo.dataTime <= 1) {
                            that.getCodeInfo = '重新发送'
                            clearInterval(dataInfo.times)
                            that.codeNum = 1
                        } else {
                            that.codeNum = 2
                            that.getCodeInfo = --dataInfo.dataTime + 's'
                        }
                    }, 1000)
                } else {
                    that.codeNum = 1
                    that.getCodeInfo = '重新发送'
                    that.warringInfo = data.errMsg
                };
            })
        }
    }
}
</script>
