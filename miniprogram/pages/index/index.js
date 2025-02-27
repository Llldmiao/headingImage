//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUseGetUserProfile: false,
  },
  onLoad: function () {
    // wx.navigateTo({
    //   url: '../postcard/postcard',
    // })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }

    wx.cloud.callFunction({
      name: 'getpostNum',
      complete: res => {
        let postNum;
        console.log(res.result);
        if ('string' === typeof res.result) {
          postNum = res.result
          if (postNum && !Number.isNaN(Number(postNum))) {
            app.globalData.postNum = postNum;
          }
        }
        else {
          wx.cloud.callFunction({
            name: 'getpostNum',
            complete: res => {
              let postNum;
              if ('string' === typeof res.result) {
                postNum = res.result
                console.log(res.result);
                if (postNum && !Number.isNaN(Number(postNum))) {
                  app.globalData.postNum = postNum;
                }
              }
            }
          })
        }

      }
    })
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

  toselect() {
    if (!app.globalData.userInfo) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          //将用户信息保存本地缓存里
          try {

            // 同步接口立即写入

            wx.setStorageSync('userInfo', res.userInfo)
            app.globalData.userInfo = res.userInfo;
            app.globalData.cutImage = res.userInfo.avatarUrl;
            console.log('写入userInfo成功')
            wx.navigateTo({
              url: '../madeph/madeph',
            })

          } catch (e) {

            console.log('写入userInfo发生错误')

          }
          //console.log(res.userInfo);
          // this.setData({
          //   userInfo: res.userInfo,
          //   hasUserInfo: true
          // })
        }
      })
    }
    else {
      wx.navigateTo({
        url: '../madeph/madeph',
      })
    }
  },

  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  //   // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       //将用户信息保存本地缓存里
  //       try{

  //         // 同步接口立即写入

  //         wx.setStorageSync('userInfo', res.userInfo)


  //       }catch (e) {

  //         console.log('写入userInfo发生错误')

  //       }
  //       console.log(res.userInfo);
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   })
  // },
  // getUserInfo(e) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
})
