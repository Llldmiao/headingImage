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
    identity: "即将成为Huster的考研人",
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
    const { nickName, identity, index } = this.data;
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
    //app.globalData.identity = 0 表示即将成为Huster的考研人
    //app.globalData.identity = 1 表示"准Huster"或"我已经是Huster啦"
    app.globalData.identity = (index === 0) ? 0 : 1;
    // 跳转逻辑
    wx.navigateTo({
      url: '../postcard/postcard',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo !== null) {
      this.setData({ nickName: userInfo.nickName });
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
  onShareTimeline() {
    return {
      title: '研小招专属头像制作',
      path: '/pages/index/index'
    }
  },
})
