// miniprogram/pages/product/product.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    theme: "guoqing",
    imageList: [],
    schoolImgList: [
      "../../images/avatar/xq-1.png",
      "../../images/avatar/xq-2.png",
      "../../images/avatar/xq-3.png",
    ],
    examImgList: [
      "../../images/avatar/cc-1.png",
      "../../images/avatar/cc-2.png",
      "../../images/avatar/cc-3.png",
    ],
    subjectImgList: [
      "../../images/avatar/xk-1.png",
      "../../images/avatar/xk-2.png",
      "../../images/avatar/xk-3.png",
    ],
    color: "#ee4e33",
    leftClass: "leftBlock",
    rightClass: "rightNone",
    cutImage: "",
    avtImage: "",
    width: 300,
    height: 300,
    left: 0,
    top: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    this.setData({
      cutImage:
        app.globalData.cutImage || wx.getStorageSync("userInfo").avatarUrl,
    });
    const that = this;
    const query = wx.createSelectorQuery();
    const ctx = wx.createCanvasContext("myCanvas");
    this.ctx = ctx;
    query
      .select("#myCanvas")
      .boundingClientRect(function (res) {
        that.canvasWidth = res.width;
        that.canvasHeight = res.height;
        /* that.ctx.drawImage(
          that.data.cutImage,
          0,
          0,
          that.canvasWidth,
          that.canvasHeight
        )*/
      })
      .exec();
    console.log("cutImage", this.data.cutImage);
  },
  changeToGuo() {
    this.setData({
      theme: "guoqing",
      leftClass: "leftBlock",
      rightClass: "rightNone",
      color: "#ee4e33",
      imageList: this.imageList.slice(0, 11),
    });
  },
  changeToZhong() {
    this.setData({
      theme: "zhongqiu",
      leftClass: "leftNone",
      rightClass: "rightBlock",
      color: "#ffaa3e",
      imageList: this.imageList.slice(11),
    });
  },
  back() {
    wx.navigateTo({
      url: "../madeph/madeph",
    });
  },
  async save() {
    let that = this;
    // let arr = [];
    // arr.push(this.data.avtImage);
    // const res = await wx.cloud.getTempFileURL({
    //   fileList: arr,
    // });
    // let res1 = await wx.cloud.downloadFile({
    //   fileID: res.fileList[0].fileID,
    // });
    // let pic = res1.tempFilePath;
    let pic = this.data.avtImage;
    that.ctx.drawImage(
      that.data.cutImage,
      0,
      0,
      that.canvasWidth,
      that.canvasHeight
    );
    that.ctx.drawImage(pic, 0, 0, this.canvasWidth, this.canvasHeight);
    wx.showLoading({
      title: "图片校验中",
      icon: "loading",
    });
    this.ctx.draw(
      true,
      setTimeout(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: this.canvasWidth / 4,
          height: this.canvasHeight / 4,
          destWidth: this.canvasWidth / 4,
          destHeight: this.canvasHeight / 4,
          fileType: "png",
          canvasId: "myCanvas",
          success: function (res) {
            that.security(res);
          },
        });
      }, 300)
    );

    /*this.ctx.draw(
      false,
      setTimeout(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: this.canvasWidth,
          height: this.canvasHeight,
          destWidth: this.canvasWidth,
          destHeight: this.canvasHeight,
          fileType: 'png',
          canvasId: 'myCanvas',
          success: function (res) {
            console.log('res.pic', res.tempFilePath)
         
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (data) {
                wx.hideLoading()
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000,
                  success() {
                    /*wx.navigateTo({
                      url: '../madeph/madeph',
                    })
                  },
                })
              },
            })
            that.ctx.draw(false) //清空画布
          },
        })
      }, 300)
    )*/
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
              this.ctx.draw(
                true,
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: this.canvasWidth,
                    height: this.canvasHeight,
                    destWidth: this.canvasWidth,
                    destHeight: this.canvasHeight,
                    fileType: "png",
                    canvasId: "myCanvas",
                    success: function (res) {
                      console.log("res.pic", res.tempFilePath);
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
                      that.ctx.draw(false); //清空画布
                    },
                  });
                }, 300)
              );
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
