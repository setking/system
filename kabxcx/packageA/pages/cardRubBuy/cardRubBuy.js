const app = getApp()
const Ajax = require('../../../utils/ajax.js')
const getQueryString = require('../../../utils/getQueryString.js')

Page({
    // //次卡蹭卡跳转
    // toOrderScrapePay: function(e) {
    //     wx.navigateTo({
    //         url: '../orderScrapePay/orderScrapePay',
    //     })
    // },
    // // 充送卡蹭卡支付跳转
    // toRechargeScrapePay: function(e) {
    //     wx.navigateTo({
    //         url: '../rechangeScrapePay/rechangeScrapePay',
    //     })
    // },
    // // 次卡购卡跳转次卡详情
    // toOrderDetail: function(e) {
    //     wx.navigateTo({
    //         url: '../orderDetail/orderDetail',
    //     })
    // },
    // toRechargeDetail: function(e) {
    //     wx.navigateTo({
    //         url: '../rechargeCardDetail/rechargeCardDetail',
    //     })
    // },
    // 折扣卡蹭卡支付跳转
    toCardScrapePay: function(e) {
        var cardtype = e.currentTarget.dataset.cardtype;
        console.log(e);
        // if (cardtype == 0) {
            var model = JSON.stringify(this.data.list[e.currentTarget.dataset.index]);
            if (this.data.isScave == "0") {
                wx.navigateTo({
                    url: '../../../pages/cardScrapePay/cardScrapePay?model=' + model
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
                                url: '../../../pages/login/login'
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
                                      url: '../../../pages/cardPrePay/cardPrePay?model=' + JSON.stringify(param1) + '&Amount=' + amount + '&staffid=' + staffid,
                                    })
                                } else if (param1.isShareCard == "1") {
                                    wx.navigateTo({
                                      url: '../../../pages/cardScrapePay/cardScrapePay?model=' + JSON.stringify(param1) + '&Amount=' + amount + '&staffid=' + staffid,
                                    })
                                } else if (param1.isShareCard == "2") {
                                    wx.navigateTo({
                                      url: '../../../pages/noCard/noCard?id=' + shopid + '&staffid=' + staffid,
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
                                      url: '../../../pages/cardPrePay/cardPrePay?model=' + JSON.stringify(param1) + '&staffid=' + staffid
                                    })
                                } else if (param1.isShareCard == "1") {
                                    wx.navigateTo({
                                      url: '../../../pages/cardScrapePay/cardScrapePay?model=' + JSON.stringify(param1) + '&staffid=' + staffid
                                    })
                                } else if (param1.isShareCard == "2") {
                                    wx.navigateTo({
                                      url: '../../../pages/noCard/noCard?id=' + shopid + '&staffid=' + staffid,
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

        // }

    },
    
    data: {
        cardText: [{
            text: '蹭卡'
        }, {
            text: '购卡'
        }, {
            text: '商家详情'
        }],
        list: [],
        currentTab: 0,
        navScrollLeft: 0,
        state: 0,
        shopId: '',
        buyCardList: [],
        num: null,
        isScave: ""
    },
    onLoad(opt) {
        var thit = this;
        if (opt.id) {
            this.shopId = opt.id
            this.setData({
                shopId: opt.id
            })
        }
        if (opt.shopid) {
            this.shopId = opt.shopid
            this.setData({
                shopId: opt.shopid
            })
        }
        if (opt.state)
            this.setData({
                currentTab: opt.state,
                state: opt.state
            })
        this.init()
        this.detail()
        wx.getSystemInfo({
            success: (res) => {
                //console.log(res)
                thit.setData({
                    pixelRatio: res.pixelRatio,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            },
        })
    },
    onShow() {
        //  this.init()
    },
    tab(e) {
        this.setData({
            state: e.target.dataset.state
        })
        this.detail()
        this.init()
    },
    switchNav(event) {
        this.setData({
            state: event.currentTarget.dataset.current,
        })
        this.init()
        var cur = event.currentTarget.dataset.current;
        var id = event.currentTarget.dataset.id;
        //每个tab选项宽度占1/5
        this.setData({
            shownopage: false
        });
        var singleNavWidth = this.data.windowWidth / 3.125;
        //tab选项居中                            
        this.setData({
            navScrollLeft: (cur - 2) * singleNavWidth
        })
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur,
                state: cur,
            })
        }
        this.setData({
            'scrollTop': 0
        });
    },
    switchTab(event) {
        // console.log(event);
        this.setData({
            state: event.detail.current,
        })
        this.init()
        var cur = event.detail.current;
        this.setData({
            shownopage: false
        });
        var singleNavWidth = this.data.windowWidth / 3.125;
        this.setData({
            currentTab: cur,
            state: cur,
            navScrollLeft: (cur - 2) * singleNavWidth
        });

        this.setData({
            'scrollTop': 0
        });
    },
    init() {
        wx.showLoading({
            title: '加载中',
        })
      if (wx.getStorageSync('userInfo'))
        var id = wx.getStorageSync('userInfo').id
        else
            var id = ""

        Ajax.get('/card/card_list_shop_chead', {
            uid: id, //用户id
            shopid: this.shopId, //商家id
            sort: 0, //排序（0新卡推荐1余额2折扣）
            sex: 2, //条件（0女1男2全部）
            status: this.data.state //（0共享卡1售卡2下架）
        }).then(res => {
            console.log(res)
            if (res.data.status == 'ok') {
                setTimeout(function() {
                    wx.hideLoading()
                }, 500)
                if (res.data.info) {
                    this.setData({
                        list: res.data.info.map(item => {
                            item.cardRate = item.cardRate.toString();
                            item.rbig = item.cardRate.substring(0, 1);
                            item.rsmall = item.cardRate.substring(2, 3);
                            item.shareRate = item.shareRate.toString();
                            item.sbig = item.shareRate.substring(0, 1);
                            item.ssmall = item.shareRate.substring(2, 3);
                            this.data.isScave = item.isScave;
                            return item;
                        })
                    })
                    // console.log(this.data.isScave);
                    if (res.data.info[0]) {
                        wx.setNavigationBarTitle({
                            title: res.data.info[0].shopName
                        })
                    }
                }
            } else {
                wx.showToast({
                    title: res.data.info || '请求失败',
                    icon: 'none'
                })
            }
        }).catch(err => {
            console.log(err)
            wx.showToast({
                title: err.data.info || '请求失败',
                icon: 'none'
            })
        })
    },
    detail() {
        Ajax.get('/shop/shop_detail', {
            shopid: this.shopId, //商家id
        }).then(res => {
            // console.log(res);
            if (res.data.status == 'ok') {
                if (res.data.info) {
                    this.setData({
                        shopdetail: res.data.info
                    })

                    wx.setNavigationBarTitle({
                        title: res.data.info.shopName
                    })
                }
            } else {
                wx.showToast({
                    title: res.data.info || '请求失败',
                    icon: 'none'
                })
            }
        }).catch(err => {
            wx.showToast({
                title: err.data.info || '请求失败',
                icon: 'none'
            })
        })
    },
    defaultTap() {
        this.setData({
            currentTab: 1
        })
        this.init()
    },
    toDetail: function(e) {
        var model = JSON.stringify(this.data.list[e.currentTarget.dataset.index]);
        wx.navigateTo({
          url: '../../../pages/busCardDetail/busCardDetail?model=' + model
        })
    },
    makePhoneCall: function(e) {
        wx.makePhoneCall({
            phoneNumber: this.data.shopdetail.shopMobile //仅为示例，并非真实的电话号码
        })
    },
})