// pages/storedCardDetail/storedCardDetail.js
const app = getApp();
const Ajax = require('../../../utils/ajax.js')
const getQueryString = require('../../../utils/getQueryString.js')
Page({
    toDiscountSet: function (e) {
        Ajax.post('/card/card_share_rate', {
            uid: this.info.id,
            cardid: this.cardid,
            rate: this.data.data.shareRate,
            status: 1
        }).then(({
            data
        }) => {
            wx.navigateTo({
                url: `../discountSetting/discountSetting?id=${this.cardid}`,
            })
        }).catch(err => {
            console.log(err)
        })
    },
    toRule: function (e) {
        wx.navigateTo({
            url: '../useExplain/useExplain',
        })
    },
    tocusIncom: function (e) {
        wx.navigateTo({
            url: `../cusIncome/cusIncome?id=${e.currentTarget.id}`,
        })
    },
    toCardScrapePay: function (e) {
        var model = JSON.stringify(this.data.data);
        wx.navigateTo({
            url: '../cardRecharge/cardRecharge?model=' + model
        })
    },
    toCardPrePay: function (e) {
        var model = JSON.stringify(this.data.data);
        if (this.data.isScave == "0") {
            wx.navigateTo({
                url: '../cardPrePay/cardPrePay?model=' + model
            })
        } else if (this.data.isScave == "1") {
            wx.scanCode({
                onlyFromCamera: true,
                success: ({
                    result
                }) => {
                    console.log(result)
                    let userInfo
                    if (app.globalData.userInfo) {
                        userInfo = app.globalData.userInfo
                    } else {
                        wx.navigateTo({
                            url: '../../../pages//login/login'
                        })
                    }
                    result = result.replace(/\n/g, '');
                    if (result == null || result == "" || result.indexOf("shopid") < 0) {
                        wx.navigateTo({
                            url: '../../../pages/qrError/qrError'
                        })
                        return;
                    }
                    // result = result + "";

                    let shopid = getQueryString.getQueryString(result, 'shopid')
                    let amount = getQueryString.getQueryString(result, 'amount')
                    let staffid = getQueryString.getQueryString(result, 'staffid')
                    result = result.split(",");
                    console.log(result)
                    if (amount != null || amount != "") {
                        Ajax.get('/card/card_detail_userofshop', {
                            shopid: shopid,
                            uid: userInfo.id
                        }).then(({
                            data
                        }) => {
                            console.log(data, app.globalData.userInfo)
                            var param1 = data.info
                            if (param1.isShareCard == "0") {
                                wx.navigateTo({
                                    url: '../cardPrePay/cardPrePay?model=' + JSON.stringify(param1) + '&Amount=' + amount + '&staffid=' + staffid,
                                })
                            } else if (param1.isShareCard == "1") {
                                wx.navigateTo({
                                    url: '../cardScrapePay/cardScrapePay?model=' + JSON.stringify(param1) + '&Amount=' + amount + '&staffid=' + staffid,
                                })
                            } else if (param1.isShareCard == "2") {
                                wx.navigateTo({
                                    url: '../noCard/noCard?id=' + shopid + '&staffid=' + staffid,
                                })
                            }

                        }).catch(data => {
                            wx.showToast({
                                title: '数据加载失败...',

                            })
                        })
                    } else {
                        var Request = new Object();
                        Ajax.get('/card/card_detail_userofshop', {
                            shopid: shopid,
                            uid: userInfo.id
                        }).then(({
                            data
                        }) => {
                            console.log(data)
                            var param1 = data.info
                            if (param1.isShareCard == "0") {
                                wx.navigateTo({
                                    url: '../cardPrePay/cardPrePay?model=' + JSON.stringify(param1) + '&staffid=' + staffid
                                })
                            } else if (param1.isShareCard == "1") {
                                wx.navigateTo({
                                    url: '../cardScrapePay/cardScrapePay?model=' + JSON.stringify(param1) + '&staffid=' + staffid
                                })
                            } else if (param1.isShareCard == "2") {
                                wx.navigateTo({
                                    url: '../noCard/noCard?id=' + shopid + '&staffid=' + staffid,
                                })
                            }
                        }).catch(data => {
                            console.log(data)
                            wx.showToast({
                                title: '数据加载失败...',
                            })
                        })
                    }
                },
                fail: data => {
                    console.log(data)
                    // wx.navigateTo({
                    //   url: '../qrError/qrError'
                    // })
                }
            })
        }


    },
    /**
     * 页面的初始数据
     */
    data: {
        cardid: '',
        status: 0,
        data: '',
        big: '',
        small: '',
        isScave: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.info = app.globalData.userInfo
        this.cardid = options.id
        Ajax.get('/card/card_detail', {
            cardid: this.cardid,
            status: 0
        }).then(res => {
            console.log(res.data)
            if (res.data.status == 'ok') {
                if (res.data.info) {
                    //   res.data.info.cardRate = res.data.info.cardRate.toFixed(1)
                    res.data.info.cardRate = res.data.info.cardRate.toString();
                    console.log(typeof (res.data.info.cardRate))
                    var info = res.data.info.cardRate;
                    this.data.isScave = res.data.info.isScave;
                    this.data.big = info.substring(0, 1);
                    this.data.small = info.substring(2, 3);
                    this.setData({
                        data: res.data.info,
                        shopid: res.data.info.shopid,
                        cardid: res.data.info.id,
                        big: this.data.big,
                        small: this.data.small,
                        isScave: this.data.isScave
                    })

                    console.log(this.data.isScave);
                }
            }
        })
    },
    switch1Change: function (e) {
        this.setStatus(e.detail.value)
    },
    switch2Change: function (e) {
        this.setStatus(e.detail.value)
    },
    setStatus(key) {
        //调用接口
        Ajax.post('/card/card_share_rate', {
            uid: this.info.id,
            cardid: this.cardid,
            rate: this.data.data.shareRate,
            status: key ? '1' : '0'
        }).then(({
            data
        }) => {
            if (!key) {
                this.data.data.isCardShare = 0
            }
            if (key) {
                this.data.data.isCardShare = 1
            }
            this.setData({
                data: this.data.data
            })
        }).catch(err => {
            console.log(err)
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.onLoad(this.options)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

})