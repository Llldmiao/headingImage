// pages/before-postcard/before-postcard.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    resImage: "",
  },
  navigate() {
    wx.navigateTo({
      url: "../survey/survey",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // console.log(app.globalData.resImage);
    this.setData({
      resImage: app.globalData.resImage,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '研小招专属头像制作',
      path: '/pages/index/index'
    }
  },
  onShareTimeline() {
    return {
      title: '研小招专属头像制作',
      path: '/pages/index/index'
    }
  }
});
