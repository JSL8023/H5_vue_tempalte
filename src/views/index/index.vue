<style lang="less">
</style>
<template>
  <!-- 首页 -->
  <div id="">
    <div>首页测试</div>
    <transition name="van-slide-up">
      <div v-show="visible">Slide Up</div>
    </transition>
  </div>
</template>

<script>
import { WX_SHARE } from '@/untils/wx' // 微信分享 测试记录页使用
export default {
    name: '',
    props: {},
    data () {
        return {
            visible: true
        }
    },
    mounted () {
        WX_SHARE()
    },
    methods: {
        discernCode () { // 图片放大
            wx.previewImage({
                current: 'http://h5.meetao.com/h5/rice_active_code.jpeg',
                urls: ['http://h5.meetao.com/h5/rice_active_code.jpeg']
            })
        }
    }
}
</script>
