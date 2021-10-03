// pages/profile/profile.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    identities: ["即将成为Huster的考研人", "准Huster", "我已经是Huster啦"],
    index: 0,
    nickName: "",
    identity: "",
  },
  bindChange: function (e) {
    this.setData({
      index: e.detail.value,
      identity: this.data.identities[e.detail.value],
    });
  },
  bindKeyInput: function (e) {
    this.setData({
      nickName: e.detail.value,
    });
  },
  submit: function (e) {
    const { nickName, identity } = this.data;
    if (nickName.trim() === "") {
      wx.showToast({
        title: "请输入你的昵称",
        icon: "error",
        duration: 1000,
      });
      return;
    }
    //存储昵称和身份
    app.globalData.nickName = nickName;
    app.globalData.identity = identity;
    // 跳转逻辑
    // wx.navigateTo({
    //   url: 'url',
    // })
    console.log("这里补充一下跳转url");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo !== null) {
      this.setData({ nickName: userInfo.nickName });
    }
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
  onShareAppMessage: function () {},
});
