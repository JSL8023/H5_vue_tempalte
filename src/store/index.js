import Vue from 'vue'
import Vuex from 'vuex'
import wx from './module/wx.js'
import {
    stopScrol,
    openScrol
} from '@/untils/index'
import {
    SET_SHARE,
    SET_DIALOG
} from './mutationTypes.js'

Vue.use(Vuex)

const state = {
    showShare: false,
    showDialog: false,
    dialogType: 1 // -1活动结束  // 1上传成功 2成功点赞 // 3失败点赞
}

const mutations = {
    [SET_SHARE](state, data) {
        if (data) {
            stopScrol() // 关闭滑动
        } else {
            openScrol() // 开启滑动
        }
        state.showShare = data
    },
    [SET_DIALOG](state, data) {
        if (data.showDialog) {
            stopScrol() // 关闭滑动
        } else {
            openScrol() // 开启滑动
        }
        state.showDialog = data.showDialog
        if (data.dialogType) {
            state.dialogType = data.dialogType
        }
    }
}

const actions = {}

export default new Vuex.Store({
    strict: false, // 请确保在发布环境下关闭严格模式，以避免性能损失。
    state,
    mutations,
    actions,
    modules: {
        wx
    }
})
