//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    jump: false,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onLoad:  function () {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  toselect() {
    /*if (this.data.jump) {
      wx.navigateTo({
        url: '../madeph/madeph',
      })
    }*/
    wx.navigateTo({
      url: '../madeph/madeph',
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        //将用户信息保存本地缓存里
        try{

          // 同步接口立即写入
        
          wx.setStorageSync('userInfo', res.userInfo)
        
          console.log('写入userInfo成功')
        
        }catch (e) {
        
          console.log('写入userInfo发生错误')
        
        }
        console.log(res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
