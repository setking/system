// pages/cardPrePay/cardPrePay.js
const app = getApp()
const Ajax = require('../../../utils/ajax.js')
// console.log(app)
Page({
    toRecharge: function(e) {
        var model = JSON.stringify(this.data.data);
        wx.navigateTo({
            url: '../cardRecharge/cardRecharge?model=' + model
        })
    },
    zhifu: function(e) {
        // console.log(e)
        var that = this;
        if (this.data.cardType == 0 || this.data.cardType == 1) {
            if (this.data.zhifuAmount <= 0) {
                wx.showToast({
                    title: "请输入支付金额",
                })
            } else {
                Ajax.post('/card/userself_card_consumer', {
                    cardid: this.data.data.id, //卡id
                    amount: this.data.Amount, //消费原价（商品原价
                    count: this.data.count
                }).then(res => {
                    console.log(res);
                    that.orderid = res.data.info;
                    console.log(that.orderid);
                    // Ajax.post('/pay/order_xiao', {
                    //   orderid: res.data.info, //消费者id
                    //   openid: wx.getStorageSync('openid'), //卡id
                    // }).then(res => {

                    //   wx.navigateTo({
                    //     url: '../busCardPayRes/busCardPayRes?id=' + that.orderid + '',
                    //   })

                    // }).catch(err => {
                    //   wx.showToast({
                    //     title: err.data.info || '调去支付错误',
                    //     icon: 'none'
                    //   })
                    // })
                    if (res.data.status == "ok")
                        wx.navigateTo({
                            url: '../../../pages/busCardPayRes/busCardPayRes?id=' + res.data.info + '&staffid=' + this.data.staffid,
                            success: function (res) {
                                console.log(res);
                            }
                        })
                    else
                        wx.showToast({
                            title: err.data.info || '调去支付错误',
                            icon: 'none'
                        })
                }).catch(err => {
                    wx.showToast({
                        title: err.data.info || '生成订单错误',
                        icon: 'none'
                    })
                })
            }

        } else {

            Ajax.post('/card/userself_card_consumer', {
                cardid: this.data.data.id, //卡id
                amount: this.data.Amount, //消费原价（商品原价
                count: this.data.count
            }).then(res => {
                console.log(res);
                that.orderid = res.data.info;
                console.log(that.orderid);
                // Ajax.post('/pay/order_xiao', {
                //   orderid: res.data.info, //消费者id
                //   openid: wx.getStorageSync('openid'), //卡id
                // }).then(res => {

                //   wx.navigateTo({
                //     url: '../busCardPayRes/busCardPayRes?id=' + that.orderid + '',
                //   })

                // }).catch(err => {
                //   wx.showToast({
                //     title: err.data.info || '调去支付错误',
                //     icon: 'none'
                //   })
                // })
                if (res.data.status == "ok")
                    wx.navigateTo({
                        url: '../../../pages/busCardPayRes/busCardPayRes?id=' + res.data.info + '&staffid=' + this.data.staffid,
                        success: function (res) {
                            console.log(res);
                        }
                    })
                else
                    wx.showToast({
                        title: err.data.info || '调去支付错误',
                        icon: 'none'
                    })
            }).catch(err => {
                wx.showToast({
                    title: err.data.info || '生成订单错误',
                    icon: 'none'
                })
            })
        }
    },
    // 价格部分
    inputAmount: function(e) {
        let Amount = e.detail.value
        if (Amount >= 0) {
            this.setData({
                zhifuAmount: (this.data.data.cardRate * 0.1 * Amount).toFixed(2),
                youhuiAmount: (Amount - (this.data.data.cardRate * 0.1 * Amount)).toFixed(2),
                Amount: Amount
            });
        }
    },
    inputCount:function(e){
        console.log(e.detail.value);
        let count = e.detail.value;
    },
    /**
     * 页面的初始数据
     */
    data: {
        zhifuAmount: 0,
        youhuiAmount: 0,
        data: null,
        yue: false,
        big: '',
        small: '',
        staffid:null,
        count:1,
        realAmount: 1,
        cardType: 0,
        Amount: 0
    },
    bindMinus:function(){
        var count = this.data.count;
        if(count>1){
            count --; 
        }else if(count == 1){
            count = 1;
        }
        this.setData({
            count:count
        })
    },
    bindPlus:function(){
        var count = this.data.count;
        var cardReturn = this.data.data.cardReturn;
        if (count == cardReturn){
            count = cardReturn;
        }else{
            count ++;
        }
        this.setData({
            count: count
        })
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
        console.log(bean)
        bean.cardRate = (bean.cardRate * 1).toFixed(1);
        var info = bean.cardRate.toString();
        this.data.big = info.substring(0,1);
        this.data.small = info.substring(2,3);
        this.data.cardType = bean.cardType;
        var staffid = options.staffid;
        this.setData({
            data: bean,
            big:this.data.big,
            small:this.data.small,
            staffid:this.data.staffid,
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
        // 计算次卡实际支付金额
        var amount = bean.countActualAmount * this.data.count.toFixed(2);
        this.data.realAmount = amount;
        this.setData({
            realNum: this.data.realAmount
        })
    },

})