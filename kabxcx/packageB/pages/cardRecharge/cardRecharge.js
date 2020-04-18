// pages/cardRecharge/cardRecharge.js
const app = getApp()
const Ajax = require('../../../utils/ajax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxzhifu: true,
    yue: false,
    big:'',
    small:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.model == null) {
      wx.showToast({
        title: '数据为空',
      })
      var pages = getCurrentPages(); //当前页面
      console.log(pages);
      var prevPage = pages[pages.length - 2]; //上一页面
      prevPage.onLoad();
      wx.navigateBack();
      return;
    }
    var bean = JSON.parse(options.model);
    var info = bean.cardRate.toString();
    this.data.big =info.substring(0,1);
    this.data.small = info.substring(2,3);
    this.setData({
      data: bean,
      big:this.data.big,
      small:this.data.small
    });
    console.log(bean.cardRate)
  },

  zhifutype: function (e) {
    if (e.currentTarget.dataset.current)
      this.setData({
        wxzhifu: false
      });
    else
      this.setData({
        wxzhifu: true
      });
  },

  zhifu: function (e) {
    var that = this;
    if (that.data.wxzhifu === true) {
      Ajax.post('/card/user_card_charge', {
        cardid: this.data.data.id, //消费者id
        payType: 0
      }).then(res => {
        that.orderid = res.data.info.orderid;
        Ajax.post('/pay/order_xiao', {
          orderid: res.data.info.orderid, //消费者id
          openid: wx.getStorageSync('openid'), //卡id
        }).then(res => {

          wx.requestPayment({
            'timeStamp': res.data.info.timeStamp,
            'nonceStr': res.data.info.nonceStr,
            'package': res.data.info.package,
            'signType': res.data.info.signType,
            'paySign': res.data.info.sign,
            'success': function (res) {
              wx.navigateTo({
                url: '../../../pages/busCardPayRes/busCardPayRes?id=' + that.orderid + '',
              })
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付异常',
                icon: 'loading',
                duration: 1500
              })
            }
          })
        }).catch(err => {
          wx.showToast({
            title: err.data.info || '调去支付错误',
            icon: 'none'
          })
        })

      }).catch(err => {
        wx.showToast({
          title: err.data.info || '生成订单错误',
          icon: 'none'
        })
      })
    } else {

      this.setData({
        yue: true
      });
    }

  },
  btnForPay: function (e) {
    Ajax.post('/card/user_card_charge', {
      cardid: this.data.data.id, //消费者id
      payType: 3
    }).then(res => {
      if (res.data.status == "okay") {
        wx.navigateTo({
            url: '../../../pages/busCardPayRes/busCardPayRes?id=' + res.data.info.orderid + '',
        })
      } else {
        wx.showToast({
          title: res.data.info || '生成订单错误',
          icon: 'none'

        })
      }
    }).catch(err => {
      if (err.data.status == "okay") {
        wx.navigateTo({
          url: '../../../pages/busCardPayRes/busCardPayRes?id=' + err.data.info.orderid + '',
        })
      } else {
        wx.showToast({
          title: err.data.info || '生成订单错误',
          icon: 'none'
        })
      }
    })
  },
  btnForCancel: function (e) {
    this.setData({
      yue: false
    });
  },
})