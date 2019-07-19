<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />

    <!-- 分享 -->
    <transition name="fade">
      <div class="share-mark"
           @touchmove.prevent
           v-show="wxShare"
           @click="hideShare">
        <img src="./assets/imgs/wx-share.png"
             class="img">
      </div>
    </transition>
    <!-- @touchmove.prevent -->
  </div>
</template>

<script>

export default {
    name: 'App',
    components: {},
    data () {
        return {}
    },
    computed: {
        wxShare () {
            return this.$store.state.showShare
        }
    },
    beforeCreate () {
    },
    created () {
    // test
    // window.localStorage.setItem('openid', 'o4voFwE_VoVnufwKLIIBe-Obr308') // 上线注销
    // window.localStorage.setItem('uniqueCode', 'U096256') // 上线注销
    // window.localStorage.setItem('access_token', '36f4e28c9b0f54b07d802e0555ae4bcc') // 上线注销
    },
    methods: {
        hideShare () {
            this.$store.commit('SET_SHARE', false)
        }
    }
}
</script>

<style lang="less">
@import "./assets/css/reset.css";
@import "./assets/css/vant-customer.less";
@import "./assets/css/common.less";

#app {
  max-width: 768px;
  font-size: 16px;
  width: 100%;
  height: 100%;
  position: relative;
  margin: 0 auto;
  background: #fff;
}

// 分享浮框
.share-mark {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: right;

  .img {
    width: 235px;
    height: 100px;
    margin: 10px 7px 0 0;
  }
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
