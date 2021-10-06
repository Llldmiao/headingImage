// pages/postcard/postcard.js
let app = getApp();
console.log('app', app.globalData);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postcardImg: '../../images/明信片1948x1204.png',
    headerImg: '',
    postmask: '../../images/postmask.png',
    postcard: '',
    postNumber: 999999,
    reciver: 'To：不上华科不改名',
    context: `执笔为剑，披荆斩棘；以梦为马，驰骋远方。将所有的努力都化为考场上的小确幸，明年9月，我们华中大见。`,
    greetings: {
      1: [
        '乘风破浪，不负青春。明年九月，华中大见。',
        '纵有疾风起，人生不言弃。明年9月，我们华中大见。',
        '不怕别人阻挡，只怕自己投降。\n坚持住，小招在华中大等你！',
        '用这生命中的每一秒，书写一个不后悔的未来。\n明年9月，我们华中大见。',
        '愿过往所有的遗憾，都是考研上岸惊喜的铺垫。\n明年9月，我们华中大见。',
        '甘居幽暗而努力不懈，蓦然回首必柳暗花明。\n期待在明年的金秋，在华中大与你相遇。',
        '跨过星河迈过月亮，去迎接更好的自己。\n天青色等烟雨，小招在华中大等待那个更优秀的你！',
        '执笔为剑，披荆斩棘；以梦为马，驰骋远方。\n将所有的努力都化为考场上的小确幸，明年9月，我们华中大见。',
        'Where there is life，there is hope.一息若存，希望不灭。\n明年9月，我们华中大见。'
      ],
      2: [
        '征途漫漫，惟有奋斗。',
        '乘风破浪，不负青春。',
        '保持热爱，奔赴山海。',
        '天行健，君子以自强不息。',
        '智慧源于勤奋，伟大出自平凡。',
        '生命之灯因热情而点燃，生命之舟因拼搏而前行。',
        '精神的浩瀚，想象的活跃，心灵的勤奋，就是天才。',
        '勤勉而顽强地钻研，永远可以使你百尺竿头更进一步。',
        '在事业的峰峦上，有汗水的溪流飞淌；在智慧的珍珠里，有勤奋的心血闪光。'
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload',app.globalData)
    this.setData({
      headerImg: app.globalData.resImage
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const query = wx.createSelectorQuery();
    query.select('#postcard')
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log(res);
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        let postcard = canvas.createImage();
        postcard.onload = () => {
          canvas.width = postcard.width;
          canvas.height = postcard.height;
          ctx.font = "300 70px 华文中宋";
          ctx.drawImage(postcard, 0, 0);
          //写邮政编码
          //x 水平方向， y 竖直方向
          ctx.fillText('9', 150, 173);
          ctx.fillText('9', 259, 173);
          ctx.fillText('9', 368, 173);
          ctx.fillText('9', 477, 173);
          ctx.fillText('9', 586, 173);
          ctx.fillText('9', 695, 173);

          //绘制头像 / 邮票
          let headerImg = canvas.createImage();
          headerImg.onload = () => {
            ctx.drawImage(headerImg, 1579, 104, 250, 250);

            //绘制邮戳
            let postmask = canvas.createImage();
            postmask.onload = () => {
              ctx.drawImage(postmask, 1328, 275, 295, 134);
            }
            postmask.src = this.data.postmask;
          }
          headerImg.src = this.data.headerImg;
          // headerImg.src = app.globalData.resImage;

          // wx.getImageInfo({
          //   src: app.globalData.resImage,
          //   success (res) {
          //     console.log(res);
          //     ctx.drawImage(res.path, 1328, 275, 295, 134);
          //                 //绘制邮戳
          //   let postmask = canvas.createImage();
          //   postmask.onload = () => {
          //     ctx.drawImage(postmask, 1328, 275, 295, 134);
          //   }
          //   postmask.src = this.data.postmask;
          //   }
          // })

          //写祝福语
          // ctx.font = "42px sans-serif";
          ctx.font = "42px 华文中宋";
          ctx.fillText('执笔为剑，披荆斩棘；以梦为马，驰骋远方。', 91, 545);
          ctx.fillText('将所有的努力都化为考场上的小确幸', 91, 645);
          ctx.fillText('明年9月，我们华中大见。', 91, 745);

          //TODO: 文本太长时，自动截断并换行
          // const writeWidth = 1040; //可供写祝福语的区域宽度

          // let text = ctx.measureText(this.data.context);
          // console.log(text.width);

          //写收件人
          ctx.fillText(this.data.reciver, 91, 441);

          ctx.fillText('华中大研小招', 880, 845);
        }
        postcard.src = this.data.postcardImg;

        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvas: canvas,
            success: res => {
              this.setData({
                postcard: res.tempFilePath
              })
              console.log('postcard: ', this.data.postcard);
             
              console.log('yebiyebi  ', res);
            },
            fail: err => {
              console.log(err);
            }
          });
        }, 500)
      })
  },

  savePostcard() {
    wx.showLoading({
      title: '保存中~~~',
    })
    //保存明信片
    setTimeout(()=> {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.postcard,
        success: res => {
          wx.hideLoading();
          wx.showToast({
            title: '已保存到相册，快去分享吧',
            icon: 'none'
          });
        },
        fail: err => {
          wx.showToast({
            title: '保存失败，请打开授权',
            icon: 'none'
          });
        }
      })
    },500)
  }

})