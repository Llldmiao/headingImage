// pages/madeph/madeph.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: wx.getStorageSync('userInfo').avatarUrl,
    width: 250, //宽度
    height: 250, //高度
    condition: true,
    CropperStyle: 'none',
  },

  //选择用户自己头像图片
  upload() {
    wx.navigateTo({
      url: '../cropper/cropper',
    })
  },

  jump() {
    if (this.data.imgSrc || app.globalData.cutImage) {
      wx.navigateTo({
        url: '../product/product',
      })
    } else {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none', //如果要纯文本，不要icon，将值设为'none'
        duration: 2000,
      })
    }
  },

  onLoad: function() {

  },
  
  onShow() {
    if (app.globalData.cutImage) {
      this.setData({
        imgSrc:  app.globalData.cutImage,
      })
    }
  },
})
