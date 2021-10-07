// pages/leavemsg/leavemsg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: ''
  },

  bindKeyInput(e) {
    this.setData({
      msg: e.detail.value,
    });
  },

  bindFormSubmit() {
    let that = this;
    if (this.data.msg.trim() !== '') {
      wx.showLoading({
        title: '提交中~~',
      })

      const db = wx.cloud.database()
      db.collection('message').add({
        data: {
          msg: this.data.msg
        },
        success: function (res) {
          that.setData({
            msg: '',
          });
          wx.hideLoading()
          wx.showToast({
            title: "提交成功",
            icon: "success",
            duration: 1000,
          });
        },
        fail: function (res) {
          that.setData({
            msg: '',
          });
          wx.hideLoading()
          wx.showToast({
            title: "提交成功",
            icon: "success",
            duration: 1000,
          });
        },
      })
    } else {
      wx.showToast({
        title: "请先留言哦~",
        icon: "error",
        duration: 1000,
      });
      return;
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShareTimeline() {
    return {
      title: '研小招专属头像制作',
      path: '/pages/index/index'
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '研小招专属头像制作',
      path: '/pages/index/index'
    }
  },
})