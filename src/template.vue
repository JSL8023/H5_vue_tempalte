<style scoped lang="less">
.upload-img-page {
  .img-list {
    overflow: hidden;
  }
  .img-item {
    position: relative;
    float: left;
    width: calc(33.33% - 4px);
    height: calc(33.33vw - 14.65px);
    margin: 0 6px 6px 0;
    overflow: hidden;

    .close {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 99;
      width: 16px;
      height: 16px;
    }

    .paly {
      width: 36px;
      height: 36px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 99;
    }

    .img {
      // position: relative;
      // top: 50%;
      // transform: translateY(-50%);
      width: 100%;
      height: 100%;
      // height: auto;
    }

    .video {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      //   height: 100%;
      height: auto;
    }

    .banner-img-w {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: auto;
    }
    .banner-img-h {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      height: 100%;
      width: auto;
    }
  }
  .add-img {
    background: url("../assets/imgs/icon/camera.png") no-repeat center;
  }

  .add-video {
    background: url("../assets/imgs/icon/video.png") no-repeat center;
  }
  .add {
    position: relative;
    // background: url("../assets/imgs/icon/camera.png") no-repeat center;
    background-size: 36px 34px;
    background-color: #f2f3f5;

    .add-btn {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .img-item:nth-child(3n) {
    margin-right: 0;
  }
}
</style>

<template>
  <div class="upload-img-page">
    <ul class="img-list">

      <li class="img-item"
          v-for="(item, index) in localImageList"
          :key="'img' + index">
        <img src="../assets/imgs/icon/close.png"
             class="close"
             @click="deleteImage(index)">
        <img :src="item"
             class="img"
             @click="previewImage(index)">
      </li>

      <!-- wx添加 -->
      <!-- <li class="img-item img-add"
          v-show="!hiddenAddImage"
          @click="chooseByWX">
        WX
      </li> -->

      <!-- h5原生图片选取 -->
      <li class="img-item add add-img"
          v-show="!hiddenAddImage">
        <input type="file"
               id="photo"
               @change="imgChooseByH5"
               accept="image/*"
               class="input-file add-btn" />
        <!-- accept="image/jpeg,image/x-png" -->
      </li>

      <!-- 视频展示 -->
      <li class="img-item"
          v-for="(item, index) in localVideoList"
          :key="'video' + index">
        <img src="../assets/imgs/icon/close.png"
             class="close"
             @click="deleteVideo(index)">
        <img src="../assets/imgs/icon/play.png"
             class="paly"
             @click="previewVideo(index)">
        <video :src="item.url"
               preload
               class="video"></video>
      </li>

      <!-- h5原生视频选取 -->
      <!-- <li class="img-item add add-video"
          v-show="!hiddenAddVideo">
        <input type="file"
               id="video"
               accept="video/*"
               @change="vChooseByH5"
               class="input-file add-btn" />
      </li> -->
    </ul>
  </div>

</template>

<script>
import Axios from 'axios'
import EXIF from 'exif-js'
// import TcVod from 'vod-js-sdk-v6'
import { WX_INIT } from '@/untils/wx'
const wx = window.wx

export default {
    name: 'uploadImg',

    components: {},

    props: {
        size: {
            // 图片数量上限
            type: Number,
            default: 9,
            require: true
        },
        vSize: {
            // 视频数量上限
            type: Number,
            default: 1,
            require: false
        },
        serverMedia: {
            type: Array,
            default: function () {
                return []
            },
            required: false
        }
    },

    data () {
        return {
            tcVod: {}, // 腾讯云
            orientation: '', // 图片是否旋转
            localImageList: [], // 本地选择图片列表
            serverImageList: [], // 已上传图片列表
            localVideoList: [], // 本地视频
            serverVideoList: [] // 视频列表
        }
    },

    computed: {
        hiddenAddVideo () {
            // 有一个视频 或 六张图时
            return this.localVideoList.length >= this.vSize || this.localImageList.length >= this.size
        },
        hiddenAddImage () {
            // 六张图 或 五张图 + 一个视频
            return this.localImageList.length >= this.size || (this.localVideoList.length > 0 && this.localImageList.length >= this.size - this.localVideoList.length)
        }
    },

    watch: {
    },

    created () {
        let _this = this
        this.serverMedia.forEach(function (item) {
            if (item.type === 'img') {
                _this.localImageList.push(item.url)
                _this.serverImageList.push(item.url)
            } else if (item.type === 'video') {
                _this.localVideoList.push(item)
                _this.serverVideoList.push(item)
            }
        })
        // 腾讯云签名
        this.tcVod = new TcVod.default({
            getSignature: _this.getSignature
        })
        // 微信授权
        WX_INIT()
    },

    mounted () {
        this.$emit('syncImages', this.serverImageList)
        this.$emit('syncVideos', this.serverVideoList)
    },

    destroyed () { },

    methods: {
    // 通过H5选择图片
        imgChooseByH5 () {
            let f = document.getElementById('photo').files[0]
            if (/image\/\w+/.test(f.type)) { // 如果是图片的话就返回true
                this.checkout('img', f)
            } else {
                this.$toast('请选择图片!')
            }
        },

        // 通过H5选择视频
        vChooseByH5 () {
            let f = document.getElementById('video').files[0]
            console.log(f.type)
            if (/video\/\w+/.test(f.type)) {
                // 视频
                this.checkout('video', f)
            } else {
                this.$toast('请选择视频!')
            }
        },

        // 上传校验
        checkout (type, file) {
            let _this = this
            // 上传loading
            this.$toast({
                type: 'loading',
                mask: true,
                message: '上传中...',
                duration: 0,
                forbidClick: true
            })

            // 上传处理
            if (type === 'img') {
                // 图片
                var reader = new FileReader()
                reader.onload = function () {
                    var result = this.result
                    var img = new Image()
                    img.onload = function () {
                        // 判断长图还是宽图

                        // 判断图片是否旋转
                        EXIF.getData(img, function () {
                            _this.orientation = EXIF.getTag(this, 'Orientation')
                        })
                        // 压缩图片
                        var data = _this.compress(img)
                        // base64转blob, 上传
                        _this.syncUploadImg([_this.getBlob(data, file.type)])
                    }
                    img.src = result
                }
                reader.readAsDataURL(file)
            } else if (type === 'video') {
                // 视频
                _this.syncUploadVideo(file)
            }
        },

        // 通过WX选择图片
        chooseByWX () {
            var that = this
            let oldLength = this.localImageList.length // 已选的数量
            let nowLength = this.size - oldLength // 可选择数量
            nowLength = nowLength > this.size ? this.size : nowLength // 最大数量限制
            wx.chooseImage({
                count: nowLength,
                sourceType: ['album', 'camera'], // 拍照或相册
                sizeType: ['compressed'], // 压缩compressed或原图original
                success: function (res) {
                    // 上传loading
                    that.$toast({
                        type: 'loading',
                        mask: true,
                        message: '图片上传中...',
                        duration: 0,
                        forbidClick: true
                    })
                    console.log('微信选择的图片数据', res.localIds)
                    that.syncUploadImgWX(res.localIds)
                }
            })
        },

        // 图片压缩
        compress (img) {
            console.log('*******开始压缩*******')
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')

            let initSize = img.src.length
            let width = img.width
            let height = img.height

            if (this.orientation === 6) { // 左右相反
                canvas.width = height
                canvas.height = width
                // 铺底色
                ctx.fillStyle = '#fff'
                ctx.rotate(90 * Math.PI / 180) // 进行旋转
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, img.width, -img.height)
            } else {
                canvas.width = width
                canvas.height = height
                // 铺底色
                ctx.fillStyle = '#fff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, width, height)
            }

            // 进行最小压缩
            let ndata = canvas.toDataURL('image/jpeg', 0.3)
            console.log('*******压缩后的图片大小*******')
            console.log('压缩前：' + initSize)
            console.log('压缩后：' + ndata.length)
            console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
            return ndata
        },
        compress2 (img) {
            console.log('*******开始压缩*******')
            var initSize = img.src.length
            var width = img.width
            var height = img.height
            var canvas = document.createElement('canvas')
            var ctx = canvas.getContext('2d')
            //    瓦片canvas
            var tCanvas = document.createElement('canvas')
            var tctx = tCanvas.getContext('2d')

            // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
            var ratio
            if ((ratio = width * height / 4000000) > 1) {
                ratio = Math.sqrt(ratio)
                width /= ratio
                height /= ratio
            } else {
                ratio = 1
            }

            canvas.width = width
            canvas.height = height

            //        铺底色
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // 如果图片像素大于100万则使用瓦片绘制
            var count
            if ((count = width * height / 1000000) > 1) {
                count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片

                //            计算每块瓦片的宽和高
                var nw = ~~(width / count)
                var nh = ~~(height / count)

                tCanvas.width = nw
                tCanvas.height = nh

                for (var i = 0; i < count; i++) {
                    for (var j = 0; j < count; j++) {
                        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)

                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
                    }
                }
            } else {
                ctx.drawImage(img, 0, 0, width, height)
            }

            // 进行最小压缩
            var ndata = canvas.toDataURL('image/jpeg', 0.3)

            console.log('压缩前：' + initSize)
            console.log('压缩后：' + ndata.length)
            console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')

            tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0

            return ndata
        },

        // base64 转 bolb
        getBlob (basestr, type) {
            var text = window.atob(basestr.split(',')[1])
            var buffer = new ArrayBuffer(text.length)
            var ubuffer = new Uint8Array(buffer)

            for (var i = 0; i < text.length; i++) {
                ubuffer[i] = text.charCodeAt(i)
            }

            var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder
            var blob

            if (Builder) {
                var builder = new Builder()
                builder.append(buffer)
                blob = builder.getBlob(type)
            } else {
                blob = new window.Blob([buffer], { type: type })
            }

            return blob
        },

        // 图片点击预览
        previewImage (index) {
            var current = this.localImageList[index]
            wx.previewImage({
                current: current,
                urls: this.localImageList
            })
        },

        // 视频点击预览
        previewVideo (index) {
            this.$router.push({
                path: '/video',
                query: this.serverVideoList[index]
            })
        },

        // 删除图片
        deleteImage (index) {
            this.localImageList.splice(index, 1)
            this.serverImageList.splice(index, 1)
            this.$emit('syncImages', this.serverImageList)
        },

        // 删除视频
        deleteVideo (index) {
            this.localVideoList.splice(index, 1)
            this.serverVideoList.splice(index, 1)
            this.$emit('syncVideos', this.serverVideoList)
        },

        // 上传图片
        syncUploadImg (images) {
            let that = this
            let item = images.shift() // 获取第一个图片并删除

            let formData = new FormData()
            formData.append('imgFile', item)

            const instance = Axios.create({
                withCredentials: true
            })

            instance.post('https://fdfs.meetao.com/fdfs/uploadMulti', formData).then(res => {
                if (res.data.status === 'success') {
                    // success
                    document.getElementById('photo').value = ''

                    // 本地添加显示上传成功的图片
                    let r = new FileReader()
                    r.onload = function (e) {
                        that.localImageList.push(this.result)
                    }
                    r.readAsDataURL(item)

                    // 线上图片链接列表
                    that.serverImageList.push(res.data.data[0]) // 线上图片链接列表
                    if (images.length > 0) {
                        // 上传下一张
                        that.syncUploadImg(images)
                    } else {
                        // 上传完毕
                        that.$emit('syncImages', that.serverImageList)
                        // 关闭loading
                        this.$toast.clear('clearAll')
                    }
                } else {
                    // false
                    console.error('图片上传失败！')
                    // 关闭loading
                    this.$toast.clear('clearAll')
                }
            })
        },

        // 上传视频
        syncUploadVideo (videoFile) {
            let _this = this
            try {
                const uploader = this.tcVod.upload({
                    videoFile: videoFile // 视频，类型为 File
                })

                uploader.on('video_progress', function (info) {
                    console.log(info.percent) // 进度
                })

                uploader.done().then(
                    res => {
                        // success
                        console.log(res)
                        // 本地添加显示上传成功的视频
                        document.getElementById('photo').value = ''

                        let r = new FileReader()
                        r.onload = function () {
                            _this.localVideoList.push({ type: 'video', url: this.result })
                        }
                        r.readAsDataURL(videoFile)

                        // 传出上传的视频url
                        let video = {
                            type: 'video',
                            url: res.video.url,
                            fileId: res.fileId,
                            verify_content: res.video.verify_content
                        }
                        this.serverVideoList.push(video)
                        this.$emit('syncVideos', this.serverVideoList)

                        // 关闭loading
                        this.$toast.clear('clearAll')
                    }
                )
            } catch (error) {
                console.log('上传失败')
                // 关闭loading
                this.$toast.clear('clearAll')
            }
        }
    }
}
</script>
