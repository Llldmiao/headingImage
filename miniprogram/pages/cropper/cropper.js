const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    src: '',
    width: 200, //宽度
    height: 200, //高度
    max_width: 400,
    max_height: 400,
    disable_rotate: true, //是否禁用旋转
    disable_ratio: true, //锁定比例
    limit_move: true, //是否限制移动
    quality: 0.001,
    disable: false,
  },
  onLoad: function (options) {
    this.cropper = this.selectComponent('#image-cropper')
    this.cropper.upload() //上传图片
  },
  cropperload(e) {
    console.log('cropper加载完成')
  },
  loadimage(e) {
    wx.hideLoading()
    console.log('图片')
    this.cropper.imgReset()
  },
  clickcut(e) {
    console.log(e.detail)
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url], // 需要预览的图片http链接列表
    })
  },
  upload() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '加载中',
        })
        const tempFilePaths = res.tempFilePaths[0]
        console.log('tempFilePath', tempFilePaths)
        that.cropper.imgReset()

        that.setData({
          src: tempFilePaths,
        })
        //重置图片角度、缩放、位置
      },
    })
  },

  submit() {
    if (this.data.disable) return
    else {
      this.setData({
        disable: true,
      })
      console.log('----------')

      this.cropper.getImg((obj) => {
        let that = this
        this.originPic = obj.url
        console.log('submit')
        /*wx.showLoading({
        title: '校验中',
        loading: 4000,
        success: function () {
          app.globalData.cutImage = obj.url
          wx.navigateTo({
            url: '../madeph/madeph',
          })
        },
      })*/
        //wx.hideLoading()
        wx.showLoading({
          title: '校验中',
        })
        /*app.globalData.cutImage = obj.url
      wx.navigateTo({
        url: '../madeph/madeph',
      })*/
        //this.security(obj)
        wx.getImageInfo({
          src: obj.url,
          success: function (res) {
            var canvasWidth = res.width //图片原始长宽
            var canvasHeight = res.height
            var ratio = 2
            while (canvasWidth > 50 || canvasHeight > 50) {
              // 保证宽高在400以内
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++
            }
            that.setData({
              cWidth: canvasWidth,
              cHeight: canvasHeight,
            })
            console.log('picInfo', canvasWidth, canvasHeight)

            that.getCanvasImg(
              obj.url,
              canvasWidth,
              canvasWidth,
              that.data.quality,
              function (res) {
                that.security(res)
              }
            )
          },
        })
      })
    }
  },
  //质量压缩
  getCanvasImg(tempFilePath, canvasWidth, canvasHeight, quality, callback) {
    var that = this
    const ctx = wx.createCanvasContext('attendCanvasId')
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(tempFilePath, 0, 0, canvasWidth, canvasHeight)
    ctx.draw(
      false,
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'attendCanvasId',
          fileType: 'jpg',
          quality: quality,
          success: function success(res) {
            callback && callback(res)
          },
          fail: function (e) {
            wx.showToast({
              title: '图片上传失败，请重新上传！',
              icon: 'none',
            })
          },
        })
      }),
      100
    )
  },

  //安全审核
  security: function (res) {
    let that = this
    wx.getFileSystemManager().readFile({
      filePath: res.tempFilePath,
      success: (buffer) => {
        console.log('buffer2', buffer.data)
        wx.cloud
          .callFunction({
            name: 'msgCheck',
            data: {
              value: buffer.data,
              //value: obj.url,
            },
          })
          .then((imgRes) => {
            if (imgRes.result.errCode == '87014') {
              wx.showToast({
                title: '图片含有违法违规内容',
                icon: 'none',
                loading: 2000,
                success: function () {
                  wx.navigateBack({
                    delta: -1,
                  })
                },
              })
              return
            } else {
              console.log('安全图片')
              wx.hideLoading()
              app.globalData.cutImage = that.originPic

              wx.navigateBack({
                delta: -1,
              })
            }
          })
      },
      fail: (err) => {
        wx.showToast({
          title: '函数出错',
          icon: 'none',
          loading: 2000,
        })
        console.log(err)
      },
    })
  },
})
