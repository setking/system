// pages/busCardPayRes/busCardPayRes.js
const app = getApp()
const Ajax = require('../../utils/ajax.js')
Page({

  toCusIncome: function (e) {
    wx.navigateTo({
      url: `../cardRubBuy/cardRubBuy?id=${this.data.data.shopid}&state=1`
    })
  },
  toCusInfo: function (e) {
    wx.navigateTo({
      url: `../storedCardDetail/storedCardDetail?id=${this.data.data.cid}`
    })
  },
  jujue: function (e) {
    this.setData({
      show: false
    });
  },
  fenxian: function (e) {
    if (this.data.data.cardRate<5)
      this.shareRate=5
    else {
      this.shareRate = this.data.data.cardRate+0.5
      }
    Ajax.post('/card/card_share_rate', {
      uid: app.globalData.userInfo.id,
      cardid: this.data.data.cid,
      rate: this.shareRate,
      status: 1
    }).then(({ data }) => {
      wx.navigateTo({
        url: `../discountSetting/discountSetting?id=${this.data.data.cid}`,
      })
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
  show:false
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("生命周期函数--监听页面卸载")
    wx.navigateBack({
      delta: 2
    })
    if (this.data.data.orderType==0){
      wx.navigateTo({
        url: `../storedCardDetail/storedCardDetail?id=${this.data.data.cid}`
      })
    } else if (this.data.data.orderType == 1) {
      wx.navigateTo({
        url: `../storedCardDetail/storedCardDetail?id=${this.data.data.cid}`
      })
    } else {
      // wx.navigateTo({
      //   url: `../index/index`
      // })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log("生命周期函数--监听页面隐藏")
    // if (this.data.data.orderType == 0) {
    //   wx.navigateTo({
    //     url: `../storedCardDetail/storedCardDetail?id=${this.data.data.cid}`
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: `../index/index`
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    Ajax.get('/order/order_detail', {
      orderid: options.id
    }).then(res => {
    console.log(res)
      this.setData({
        data: res.data.info
      });
      if (res.data.info.orderType == 0) {
        this.setData({
          show: true
        });
      }
      if (res.data.info.orderType == 3) {
        this.init()
      }
    }).catch(err => {
      wx.showToast({
        title: err.data.info || '调去订单详情错误',
        icon: 'none'
      })
    })
  },
  init: function () {
    var that = this;
    this.context = wx.createCanvasContext('share')
    this.context.setFillStyle('#fff')
    this.context.fillRect(0, 0, 320, 600)
    this.context.setFillStyle('#000')
    wx.getImageInfo({
      src: "https://payp.kabuduo.cn/img/s2/" + (this.data.data.cardsharerate * 1).toFixed(1) + ".png",    //请求的网络图片路径
      success: function (res) {
        //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
        that.context.drawImage(res.path, 0, 0, 320, 171);

        that.context.setFillStyle('#fff')
        that.context.setFontSize(14)
        that.context.fillText(that.data.data.shopName, 25, 25, 300);
        if (that.data.data.masterheadimg)
          that.context.drawImage(that.data.data.masterheadimg, 25, 93, 30, 30);

        that.context.setFillStyle('#fff')
        that.context.setFontSize(13)
        that.context.fillText(that.data.data.cardmaster, 80, 110, 60);
        if (that.data.data.mastersex == 1)
          that.context.drawImage("../../resources/man.png", 80, 115, 15, 15);
        else
          that.context.drawImage("../../resources/gril.png", 80, 115, 15, 15);
        that.context.setFillStyle('#fff')
        that.context.setFontSize(14)
        that.context.fillText("可共享余额:" + that.data.data.cardAmount, 155, 115, 150);
        that.context.setFillStyle('#000')
        that.context.setFontSize(22)
        that.context.fillText("可消费余额：" + that.data.data.cardAmount + "元", 10, 210, 230);
        that.context.stroke()
        that.context.draw(false, that.getTempFilePath)
      }
    })
  },
  //获取临时路径
  getTempFilePath: function () {
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
        this.setData({
          shareTempFilePath: res.tempFilePath
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var model = JSON.stringify(this.data.info);
    return {
      title: this.data.data.cardmaster + ' 分享了 ' + this.data.data.shopName + ' 的 ' + this.data.data.cardsharerate + ' 折储值卡，快来用吧~',
      path: 'pages/cardScrapePay/cardScrapePay?model=' + model,
      imageUrl: this.data.shareTempFilePath
    }
  }


})