// miniprogram/pages/product/product.js
const app = getApp();
Page({
  data: {
    theme: "guoqing",
    imageList: [],
    schoolImgList: [
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/xq-1.png",
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/xq-2.png",
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/xq-3.png",
    ],
    examImgList: [
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/cc-1.png",
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/cc-2.png",
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/cc-3.png",
    ],
    subjectImgList: [
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/xk-1.png",
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/xk-2.png",
      "cloud://headimage-hust-o3pyd.6865-headimage-hust-o3pyd-1300324954/xk-3.png",
    ],
    color: "#ee4e33",
    leftClass: "leftBlock",
    rightClass: "rightNone",
    cutImage: "",
    avtImage: "",
    width: 200,
    height: 200,
    left: 0,
    top: 0,
  },

  onLoad: async function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.setData({
      cutImage: app.globalData.cutImage
    })
    const that = this;
    const query = wx.createSelectorQuery();
    const ctx = wx.createCanvasContext("myCanvas");
    this.ctx = ctx;
    query
      .select("#myCanvas")
      .boundingClientRect(function (res) {
        that.data.canvasWidth = res.width;
        that.data.canvasHeight = res.height;
      })
      .exec();
  },
  onReady: function () {
    let that = this;
    //console.log('this.data.cutImage: ', app.globalData.cutImage);
    wx.getImageInfo({
      src: this.data.cutImage,
      success: function (res) {
        console.log('res: ', res);
        that.setData({
          cutImage: res.path
        })
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
  onShareTimeline() {
    return {
      title: '研小招专属头像制作',
      path: '/pages/index/index'
    }
  },
  back() {
    wx.navigateTo({
      url: "../madeph/madeph",
    });
  },
  async save() {
    let that = this;
    wx.showLoading({
      title: "图片合成中",
      icon: "loading",
    });
    this.ctx.drawImage(
      this.data.cutImage,
      0,
      0,
      250,
      250
    );
    wx.getImageInfo({
      src: this.data.avtImage,
      success: function (res) {
        // console.log('头像框', res);
        that.ctx.drawImage(res.path, 0, 0, 250, 250);
        that.ctx.draw(
          true,
          setTimeout(function () {
            wx.canvasToTempFilePath({
              fileType: "png",
              canvasId: "myCanvas",
              success: function (res) {
                console.log('合成的图片', res);
                // 保存制作完成的头像url
                app.globalData.resImage = res.tempFilePath
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function (data) {
                    wx.hideLoading();
                    wx.showToast({
                      title: "保存成功",
                      icon: "success",
                      duration: 2000,
                      success() {
                        // 跳转下一页
                        wx.navigateTo({
                          url: "../before-postcard/before-postcard",
                        });
                      },
                    });
                  },
                });
                // that.security(res);
              },
            });
          }, 100)
        );
      }
    })
  },
  security: function (res) {
    let that = this;
    wx.getFileSystemManager().readFile({
      filePath: res.tempFilePath,
      success: (buffer) => {
        console.log("buffer2", buffer.data);
        wx.cloud
          .callFunction({
            name: "msgCheck",
            data: {
              value: buffer.data,
              //value: obj.url,
            },
          })
          .then((imgRes) => {
            if (imgRes.result.errCode == "87014") {
              wx.showToast({
                title: "图片含有违法违规内容",
                icon: "none",
                loading: 2000,
                success: function () {
                  wx.navigateBack({
                    delta: -1,
                  });
                },
              });
              return;
            } else {
              console.log("安全图片");
              wx.hideLoading();
              wx.showLoading({
                title: "保存中…",
                icon: "loading",
              });
              // 保存制作完成的头像url
              app.globalData.resImage = res.tempFilePath
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (data) {
                  wx.hideLoading();
                  wx.showToast({
                    title: "保存成功",
                    icon: "success",
                    duration: 2000,
                    success() {
                      // 跳转下一页
                      wx.navigateTo({
                        url: "../before-postcard/before-postcard",
                      });
                    },
                  });
                },
              });
              // this.ctx.draw(
              //   true,
              //   setTimeout(function () {
              //     wx.canvasToTempFilePath({
              //       x: 0,
              //       y: 0,
              //       width: this.canvasWidth,
              //       height: this.canvasHeight,
              //       destWidth: this.canvasWidth,
              //       destHeight: this.canvasHeight,
              //       fileType: "png",
              //       canvasId: "myCanvas",
              //       success: function (res) {
              //         console.log("res.pic", res.tempFilePath);
              //         // 保存制作完成的头像url
              //         app.globalData.resImage = res.tempFilePath

              //         wx.saveImageToPhotosAlbum({
              //           filePath: res.tempFilePath,
              //           success: function (data) {
              //             wx.hideLoading();
              //             wx.showToast({
              //               title: "保存成功",
              //               icon: "success",
              //               duration: 2000,
              //               success() {
              //                 // 跳转下一页
              //                 wx.navigateTo({
              //                   url: "../before-postcard/before-postcard",
              //                 });
              //               },
              //             });
              //           },
              //         });
              //         that.ctx.draw(false); //清空画布
              //       },
              //     });
              //   }, 300)
              // );
            }
          });
      },
      fail: (err) => {
        wx.showToast({
          title: "函数出错",
          icon: "none",
          loading: 2000,
        });
        console.log(err);
      },
    });
  },
  //获取头像框url
  choosePic(e) {
    const { url } = e.currentTarget.dataset;
    this.setData({
      avtImage: url,
    });
  },
});
