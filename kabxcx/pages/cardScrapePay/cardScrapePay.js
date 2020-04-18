// pages/cardScrapePay/cardScrapePay.js
const app = getApp()
const Ajax = require('../../utils/ajax.js')
Page({
  toList: function (e) {

    wx.navigateTo({
      url: `../../packageA/pages/cardRubBuy/cardRubBuy?id=${this.data.data.shopid}`
    })
  },
  toCusIncome: function (e) {

    wx.navigateTo({
      url: `../../packageA/pages/cardRubBuy/cardRubBuy?id=${this.data.data.shopid}&state=1`
    })

  },
  tohome: function (e) {

    wx.navigateTo({
      url: `../index/index`
    })

  },
  zhifu: function (e) {
    var that = this;
    if(this.data.cardType == 0 || this.data.cardType == 1){
      if (this.data.zhifuAmount <= 0) {
        wx.showToast({
          title: "请输入支付金额",
        })
      } else {
        if (wx.getStorageSync('userInfo')) {
          Ajax.post('/card/usercen_card_consumer', {
            uid: wx.getStorageSync('userInfo').id, //消费者id
            cid: this.data.data.cid || this.data.data.id, //卡id
            payType: 0,
            originalPrice: this.data.Amount, //消费原价（商品原价
            actualCount: this.data.count
          }).then(res => {
            that.orderid = res.data.info;
            Ajax.post('/pay/order_xiao', {
              orderid: res.data.info, //消费者id
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
                    url: '../busCardPayRes/busCardPayRes?id=' + that.orderid + '',
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
              console.log(err);
              wx.showToast({
                title: err.data.info || '调去支付错误',
                icon: 'none'
              })
            })
  
          }).catch(err => {
            wx.showToast({
              title: err.data.info || '请先登录',
              icon: 'none'
            })
            wx.showToast({
              title: "请先登录。",
              icon: "loading",
              duration: 2000,
              success: function (res) {
                wx.navigateTo({
                  url: '../login/login'
                })
              }
            })
          })
        } else {
          wx.showToast({
            title: "请先登录。",
            icon: "loading",
            duration: 2000,
            success: function (res) {
              wx.navigateTo({
                url: '../login/login'
              })
            }
          })
        }
      }
    }else{
      if (wx.getStorageSync('userInfo')) {
        Ajax.post('/card/usercen_card_consumer', {
          uid: wx.getStorageSync('userInfo').id, //消费者id
          cid: this.data.data.cid || this.data.data.id, //卡id
          payType: 0,
          originalPrice: this.data.Amount, //消费原价（商品原价
          actualCount: this.data.count
        }).then(res => {
          that.orderid = res.data.info;
          Ajax.post('/pay/order_xiao', {
            orderid: res.data.info, //消费者id
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
                  url: '../busCardPayRes/busCardPayRes?id=' + that.orderid + '',
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
            console.log(err);
            wx.showToast({
              title: err.data.info || '调去支付错误',
              icon: 'none'
            })
          })

        }).catch(err => {
          wx.showToast({
            title: err.data.info || '请先登录',
            icon: 'none'
          })
          wx.showToast({
            title: "请先登录。",
            icon: "loading",
            duration: 2000,
            success: function (res) {
              wx.navigateTo({
                url: '../login/login'
              })
            }
          })
        })
      } else {
        wx.showToast({
          title: "请先登录。",
          icon: "loading",
          duration: 2000,
          success: function (res) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        })
      }
    }

  },
  // 价格部分
  inputAmount: function (e) {
    let Amount = e.detail.value
    if (Amount >= 0) {
      this.setData({
        zhifuAmount: (this.data.data.shareRate * 0.1 * Amount).toFixed(2),
        youhuiAmount: (Amount - (this.data.data.shareRate * 0.1 * Amount)).toFixed(2),
        Amount: Amount
      });
    }
  },
  inputCount: function (e) {
    console.log(e.detail.value);
    let count = e.detail.value;
  },
  /**
   * 页面的初始数据
   */
  data: {
    zhifuAmount: 0,
    youhuiAmount: 0,
    big: '',
    small: '',
    count: 1,
    realAmount: 1,
    cardType: 0,
    Amount: 0
  },
  bindMinus: function () {
    var count = this.data.count;
    if (count > 1) {
      count--;
    } else if (count == 1) {
      count = 1;
    }
    this.setData({
      count: count
    })
  },
  bindPlus: function () {
    var count = this.data.count;
    var cardReturn = this.data.data.cardReturn;
    if (count == cardReturn) {
      count = cardReturn;
    } else {
      count++;
    }
    this.setData({
      count: count
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.model == null) {
      wx.showToast({
        title: '数据为空',
      })
      var pages = getCurrentPages(); //当前页面
      var prevPage = pages[pages.length - 2]; //上一页面
      prevPage.onLoad();
      wx.navigateBack();
      return;
    }
    var bean = JSON.parse(options.model);
    var info = bean.shareRate.toString();
    this.data.cardType = bean.cardType;
    this.data.big = info.substring(0, 1);
    this.data.small = info.substring(2, 3);
    this.setData({
      data: bean,
      big: this.data.big,
      small: this.data.small,
      cardType: this.data.cardType
    });

    if (options.Amount) {
      if (options.Amount >= 0) {
        this.setData({
          zhifuAmount: (this.data.data.cardRate * 0.1 * Number(options.Amount)).toFixed(2),
          youhuiAmount: (Number(options.Amount) - (this.data.data.cardRate * 0.1 * options.Amount)).toFixed(2),
          Amount: Number(options.Amount)
        });
      }
    }
  },

})