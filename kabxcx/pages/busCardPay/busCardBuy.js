// pages/busCardPay/busCardBuy.js
const app = getApp()
const Ajax = require('../../utils/ajax.js')
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
    onLoad: function(options) {

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
        var info = bean.cardRate.toString();
        this.data.big = info.substring(0, 1);
        this.data.small = info.substring(2, 3);
        this.setData({
            data: bean,
            big:this.data.big,
            small:this.data.small
        });
    },
    zhifutype: function(e) {
        if (e.currentTarget.dataset.current)
            this.setData({
                wxzhifu: false
            });
        else
            this.setData({
                wxzhifu: true
            });
    },
    zhifu: function(e) {
        var that = this;
        if (that.data.wxzhifu === true) {
            Ajax.post('/card/user_card_add', {
              uid: wx.getStorageSync('userInfo').id, //消费者id
                shopid: this.data.data.shopid, //卡id
                caid: this.data.data.id, //卡id
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
                        'success': function(res) {
                            wx.navigateTo({
                                url: '../busCardPayRes/busCardPayRes?id=' + that.orderid + '',
                            })
                        },
                        'fail': function(res) {
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
            this.setData({
                yue: true
            });

        }

    },
    btnForCancel: function(e) {
        this.setData({
            yue: false
        });
    },
    btnForPay: function(e) {
        Ajax.post('/card/user_card_add', {
          uid: wx.getStorageSync('userInfo').id, //消费者id
            shopid: this.data.data.shopid, //卡id
            caid: this.data.data.id, //卡id
            payType: 3
        }).then(res => {
            console.log(res);
            if (res.data.status == "okay") {
                wx.navigateTo({
                    url: '../busCardPayRes/busCardPayRes?id=' + res.data.info.orderid + '',
                })
            } else {
                console.log(2222)
                wx.showToast({
                    title: res.data.info || '生成订单错误',
                    icon: 'none'
                })
            }
        }).catch(err => {
            console.log(err)
            if (err.data.status == "okay") { 
                wx.navigateTo({
                    url: '../busCardPayRes/busCardPayRes?id=' + err.data.info.orderid + '',
                })
            } else {
              console.log(err.data.info)
                wx.showToast({
                    title: err.data.info || '生成订单错误',
                    icon: 'none'
                })
            }
        })
    },
})