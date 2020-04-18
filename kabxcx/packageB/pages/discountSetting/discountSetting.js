// pages/discountSetting/discountSetting.js
const Ajax = require('../../../utils/ajax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    style: '',
    left: 0,
    width: 0,
    info: null,
    expoectIncome: 0,
    maxIncome: 0,
    discount: 0,
    percent: 0,
    cardid: '',
    hidden: false,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  floatVal(temp) {
    temp = Number(temp).toFixed(2);
    return temp;
  },
  onLoad: function(opt) {
    var appInstance = getApp()
    this.setData({
      userInfo: appInstance.globalData.userInfo
    })
    this.setData({
      cardid: opt.id
    })
    var query = wx.createSelectorQuery().select('#progress')
    query.boundingClientRect(({
      width
    }) => {
      this.setData({
        width
      })
      Ajax.get('/card/card_detail', {
        cardid: opt.id,
        status: '0'
      }).then(({
        data
      }) => {
        if (data.info.isCardShare == "0") {
          wx.showToast({
            title: "该卡未开启共享，请先共享卡片",
            icon: "none",
            duration: 2000,
            success: function(res) {
              setTimeout(function() { //使用  setTimeout（）方法设定定时2000毫秒
                var pages = getCurrentPages(); //当前页面
                var prevPage = pages[pages.length - 2]; //上一页面
                prevPage.onLoad(prevPage.options);
                wx.navigateBack();
              }, 2000);
            }
          })
        }
        data.info.cardAmount = this.floatVal(data.info.cardAmount)
        this.setData({
          info: data.info,
          discount: Number(data.info.shareRate)
        })
        if (this.data.discount < 5) {
          this.setData({
            discount: 5
          })
        }
        var percent = (this.data.discount - 5) * 20
        var left = this.data.discount * (width / 100) + 103
        this.setData({
          style: `left: ${percent}%`,
          percent: percent
        })
        this.setMaxInCome()
      }).catch(err => {
        console.log(err)
      })
    }).exec()

  },
  init: function () {
    var that = this;
    this.context = wx.createCanvasContext('share')
    this.context.setFillStyle('#fff')
    this.context.fillRect(0, 0, 320, 600)
    this.context.setFillStyle('#000')
    wx.getImageInfo({
      src: "https://payp.kabuduo.cn/img/s2/" + (this.data.discount * 1).toFixed(1) + ".png",    //请求的网络图片路径
      success: function (res) {
        //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
        that.context.drawImage(res.path, 0, 0, 320, 171);

        that.context.setFillStyle('#fff')
        that.context.setFontSize(14)
        that.context.fillText(that.data.info.shopName, 25, 25, 300);
        if (that.data.info.headImgUrlPress)
          that.context.drawImage(that.data.info.headImgUrlPress, 25, 93, 30, 30);

        that.context.setFillStyle('#fff')
        that.context.setFontSize(13)
        that.context.fillText(that.data.info.nickName, 80, 110, 60);
        if (that.data.info.sex == 1)
          that.context.drawImage("../../../resources/man.png", 80, 115 , 15, 15);
        else
          that.context.drawImage("../../../resources/gril.png", 80, 115, 15, 15);
        that.context.setFillStyle('#fff')
        that.context.setFontSize(14)
        that.context.fillText("可共享余额:" + that.data.info.cardAmount, 155, 115, 150);
        that.context.setFillStyle('#000')
        that.context.setFontSize(22)
        that.context.fillText("可消费余额：" + that.data.info.cardAmount + "元", 10, 210, 230);
        that.context.stroke()
        that.context.draw(false, that.getTempFilePath)
        wx.canvasToTempFilePath({
          canvasId: 'share',
          success: (res) => {
            that.setData({
              shareTempFilePath: res.tempFilePath
            })
          }
        })
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
  setMaxInCome() {
    var a = this.data.info.cardRate / 10.0;
    var b = this.data.discount / 10.0;
    var c = this.data.info.cardAmount;
    // 共享折扣大于原本折扣
    if (b > a) {
      this.setData({
        expoectIncome: (c / a * b * 0.994 - (c / a * b * 0.994 - c / a * a) * 0.3).toFixed(2)
      })
    } else if (b <= a) {
      this.setData({
        expoectIncome: (c / a * b * 0.994).toFixed(2)
      })
    }
    // 共享折扣大于原本折扣
    if (a != 0.95) {
      this.setData({
        maxIncome: ((c / a * 0.95 * 0.994 - c) * 0.7).toFixed(2)
      })
    } else {
      this.setData({
        maxIncome: (0).toFixed(2)
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },
  touchmove(e) {
    var a = this.data.info.cardRate / 10.0;
    var b = this.data.discount / 10.0;
    var c = this.data.info.cardAmount;
    let left = (e.changedTouches[0].clientX - this.data.left)
    var discount = Number(left / this.data.width)
    if (discount > 236) {
      discount = 236
    }

    var percent = (this.data.percent + discount * 100)
    var thisdiscount = Number(Number(percent / 20) + 5)
    if (thisdiscount >= 5 && thisdiscount <= 9.5) {
      this.setData({
        style: `left: ${percent}%`,
        discount: thisdiscount.toFixed(1),
        percent: percent,
        left: e.changedTouches[0].clientX,
        expoectIncome: (c / a * b * 0.994 - (c / a * b * 0.994 - c / a * a) * 0.3).toFixed(2)
      })
    }
  },
  touchend() {
    console.log("end")
    this.init();
    this.setData({
      left: 0
    })
  },
  touchstart(e) {
    console.log(e)
    this.setData({
      left: e.changedTouches[0].clientX
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init();
  },
  openShare: function() {
    var that = this;
    console.log(this.data.discount)
    Ajax.post('/card/card_share_rate', {
      status: '1',
      cardid: this.data.cardid,
      rate: this.data.discount,
      uid: this.data.userInfo.id
    }).then(({
      data
    }) => {
      if (this.data.info.isCardShare == 1)
      {
        Ajax.get('/card/card_detail', {
          cardid: this.data.cardid,
          status: '0'
        }).then(({
          data
        }) => {
          //data.info.cardAmount = this.floatVal(data.info.cardAmount)
          this.setData({
            info: data.info,
          })
        }).catch(err => {
          console.log(err)
        })

      }

      this.setData({
        hidden: true
      })
    }).catch(err => {
      console.log(err)
    })
  },
  setHidden() {
    this.setData({
      hidden: false
    })
  },

  /**
   * 
   */
  onShare: function(res) {
    var model = JSON.stringify(this.data.info);
    wx.navigateTo({
      url: '../cardSharePic/cardSharePic?model=' + model
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log(res)
    var that=this;

    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
        that.setData({
          shareTempFilePath: res.tempFilePath
        })
      }
    })
    var model = JSON.stringify(this.data.info);
    return {
      title: this.data.info.nickName + ' 分享了 ' + this.data.info.shopName + ' 的 ' + this.data.info.shareRate + ' 折储值卡，快来用吧~',
      path: 'pages/cardScrapePay/cardScrapePay?model=' + model,
      imageUrl: this.data.shareTempFilePath
    }
  }
})