//index.js
//获取应用实例
const amapFile = require('../../utils/amap-wx.js')
const Ajax = require('../../utils/ajax.js')
const util = require('../../utils/util.js')
const getQueryString = require('../../utils/getQueryString.js')
const app = getApp()

Page({
    data: {
        latitude: 40.103423,
        longitude: 116.28386,
        markers: [],
        icons: [],
        shadowIcon: [],
        shopArr: [],
        swiperList: [],
        swiperFlag: false,
        current: 0,
        BMap: null,
        swiperaaa: null,
        polyline: [],
        bottom: 0
    },
    onLoad(options) {
        // console.log(options)
        let q = decodeURIComponent(options.q)
        // console.log("asdsaf")
        // console.log(q)
        let shopid = getQueryString.getQueryString(q, 'shopid')
        let staffid = getQueryString.getQueryString(q, 'staffid')
        let amount = getQueryString.getQueryString(q, 'amount')

        // console.log(staffid);
        if (q != null || q != "") {
            if (shopid == null || shopid == "") {
                wx.showToast({
                    title: '正在识别商户号',
                })
            } else {
                let userInfo
                if (app.globalData.userInfo) {
                    userInfo = app.globalData.userInfo
                } else {
                    // wx.navigateTo({
                    //     url: '../login/login'
                    // })
                }
                if (amount != null || amount != "") {
                    Ajax.get('/card/card_detail_userofshop', {
                        shopid: shopid,
                        uid: app.globalData.userInfo ? app.globalData.userInfo.id : ''
                    }).then(({
                        data
                    }) => {
                        // console.log(data, app.globalData.userInfo)
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
            }
        }
        var thit = this;
        wx.getLocation({
            type: 'gcj02',
            altitude: true,
            success: res => {
                this.setData({
                    latitude: res.latitude
                })
                this.setData({
                    longitude: res.longitude
                })
                this.setData({
                    latitudes: res.latitude
                })
                this.setData({
                    longitudes: res.longitude
                })
                this.drawMarker({
                    "longitude": res.longitude,
                    "latitude": res.latitude
                })
            }
        })
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
        //    this.getLocation()

        this.BMap = new amapFile.AMapWX({
          key: '555c9d623cef07f7abdafdae8a7316ef'
        });
        this.mapCtx = wx.createMapContext('myMap')

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        // var animation = wx.createAnimation({
        //   transformOrigin: "50% 50%",
        //   duration: 2000,
        //   timingFunction: "ease-in-out",
        //   delay: 0
        // })
        // animation.bottom(0).step()
        // this.setData({
        //   animationData: animation.export()
        // })
        // const context = wx.createCanvasContext('index-icon',this);
        // context.setFillStyle("rgba(255,255,255,0.2)");
        // context.fillRect(0, 0, this.data.windowWidth, this.data.windowHeight);
        // context.setFillStyle("#433D3D");
        // context.drawImage("../../resources/icon_sale@2x.png", 0, 0, 52, 38);
        // context.drawImage("../../resources/icon_Dining@2x.png",8,11,13,13);
        // context.drawImage("../../resources/discount/8.1.png", 25, 10, 18, 11);
        // context.draw();

        // const shadow = wx.createCanvasContext("index-icon-shadow", this);
        // shadow.setFillStyle("rgba(255,255,255,0.2)");
        // shadow.fillRect(0, 0, this.data.windowWidth, this.data.windowHeight);
        // shadow.setFillStyle("#433D3D");
        // shadow.drawImage("../../resources/icon_sale_shadow@2x.png", 0, 0, 81, 71);
        // shadow.drawImage("../../resources/icon_Dining@2x.png",16,27,17,17);
        // shadow.drawImage("../../resources/discount/8.8.png", 39, 24, 26, 15);
        // shadow.draw();

    },
    getLocation() {
        this.mapCtx = wx.createMapContext('myMap')
        wx.getLocation({
            type: 'gcj02',
            altitude: true,
            success: res => {
                this.setData({
                    latitude: res.latitude
                })
                this.setData({
                    longitude: res.longitude
                })
                this.setData({
                    latitudes: res.latitude
                })
                this.setData({
                    longitudes: res.longitude
                })
                this.drawMarker({
                    "longitude": res.longitude,
                    "latitude": res.latitude
                })
            }
        })
    },
    scanCode() {
        // var userInfo = app.globalData.userInfo
        // if (!userInfo) {
        //   wx.navigateTo({
        //     url: '../login/login',
        //   })
        //   return false
        // }
        // let result = 'shopid=fe0260b49a98450983c7cfcb8e5de13a,amount=155'
        // result = result.replace(/\n/g, '');
        // if (result == null || result == "" || result.indexOf("shopid") < 0) {
        //   wx.navigateTo({
        //     url: '../qrError/qrError'
        //   })
        //   return;
        // }
        // result = result + "";
        // result = result.split(",");
        // var amount = "0";
        // if (result.length > 1) {
        //   var temp = result[0].split("=");
        //   var shopid = temp[1];
        //   temp = result[1].split("=");
        //   amount = temp[1];
        //   Ajax.get('/card/card_detail_userofshop', {
        //     shopid,
        //     uid: userInfo.id
        //   }).then(({
        //     data
        //   }) => {
        //     var param1 = data.info
        //     console.log(userInfo)
        //     param1.headImgUrlPress = userInfo.headImgUrlPress
        //     var param = Ajax.setParams(param1)
        //     if (data.info.isShareCard == "0") {
        //       wx.navigateTo({
        //         url: '../cardPrePay/cardPrePay?model=' + JSON.stringify(param1) + '&amount=' + amount,
        //       })
        //     } else if (data.info.isShareCard == "1") {
        //       wx.navigateTo({
        //         url: '../cardScrapePay/cardScrapePay' + param,
        //       })
        //     } else if (data.info.isShareCard == "2") {
        //       wx.navigateTo({
        //         url: '../noCard/noCard' + param,
        //       })
        //     }
        //   }).catch(data => {
        //     wx.showToast({
        //       title: '数据加载失败...',
        //     })
        //   })
        // } else {

        // }
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
                    // wx.navigateTo({
                    //     url: '../login/login'
                    // })
                }
                result = result.replace(/\n/g, '');
                if (result == null || result == "" || result.indexOf("shopid") < 0) {
                    wx.navigateTo({
                        url: '../qrError/qrError'
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
                        uid: app.globalData.userInfo ? app.globalData.userInfo.id : ''
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
    },
    GetRequest(url) {
        var theRequest = new Object();
        var str = url;
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
        return theRequest;
    },
    bindtap() {

        this.setData({
            bottom: 0
        })
        this.setData({
            polyline: []
        });
        this.setData({
            swiperFlag: false
        })
    },
    bindchange(e) {
        let k = e.detail.current
        let index = -1
      this.data.markers = this.data.markers.map((item, key) => {

        if (this.data.swiperList[k].id === item.id) {
          item.width = 72
          item.height = 50
          item.iconPath = util.imgServer + `/img/shadow/sale_icon_${item.shopMinRate.toFixed(1)}@1x.png`
          index = key
        } else {
          item.width = 50
          item.height = 36
          item.iconPath = util.imgServer + `/img/icon/sale_icon_${item.shopMinRate.toFixed(1)}@1x.png`
        }
        return item
      })
        let marker = this.data.markers[index]
        this.data.markers.splice(index, 1)
        this.data.markers.push(marker)
        let origin = marker.longitude + ',' + marker.latitude
        let destination = this.data.longitudes + ',' + this.data.latitudes
        this.BMap.getDrivingRoute({
            origin,
            destination,
            success: data => {
                var points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                    var steps = data.paths[0].steps;
                    for (var i = 0; i < steps.length; i++) {
                        var poLen = steps[i].polyline.split(';');
                        for (var j = 0; j < poLen.length; j++) {
                            points.push({
                                longitude: parseFloat(poLen[j].split(',')[0]),
                                latitude: parseFloat(poLen[j].split(',')[1])
                            })
                        }
                    }
                }
                this.setData({
                    polyline: [{
                        points: points,
                        color: "#FDD804",
                        width: 6
                    }]
                });
                this.setData({
                    markers: this.data.markers
                })
            }
        })

    },
    markertap(e) {

        // var animation = wx.createAnimation({
        //   transformOrigin: "50% 50%",
        //   duration: 2000,
        //   timingFunction: "ease-in-out",
        //   delay: 0
        // })
        // animation.bottom(150).step()
        this.setData({
            bottom: 150
        })
        this.setData({
            swiperFlag: true
        })
        let Index = this.data.swiperList.findIndex(item => {
            return item.id === e.markerId
        });

        this.setData({
            current: Index
        })

        let origin = this.data.markers[Index].longitude + ',' + this.data.markers[Index].latitude
        let destination = this.data.longitudes + ',' + this.data.latitudes
        this.BMap.getDrivingRoute({
            origin,
            destination,
            success: data => {
                var points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                    var steps = data.paths[0].steps;

                    for (var i = 0; i < steps.length; i++) {
                        var poLen = steps[i].polyline.split(';');
                        for (var j = 0; j < poLen.length; j++) {
                            points.push({
                                longitude: parseFloat(poLen[j].split(',')[0]),
                                latitude: parseFloat(poLen[j].split(',')[1])
                            })
                        }
                    }
                }
                this.setData({
                    polyline: [{
                        points: points,
                        color: "#FDD804",
                        width: 6
                    }]
                });
            }
        })
    },
    route(url) {
        wx.navigateTo({
            url: '../user/user',
        })
    },
    toogleSwiper(Index, flag) {
        this.setData({
            current: Index
        })
    },
    goList() {
      console.log(this.data.latitudes)
        wx.navigateTo({
            url: `../../packageA/pages/list/list?latitude=${this.data.latitudes}&longitude=${this.data.longitudes}`,
        })
    },
    drawMarker(location) {

        Ajax.get('/shop/shop_list_wx_chead', {
            longitude: location.longitude,
            latitude: location.latitude
        }).then(({
            data
        }) => {
            console.log(data)
            wx.showLoading({
                title: '附近店面加载中。。。',
                mask: true
            })
            console.log(data.info)
            if (data.info === '') {
                console.log(1111)
                // wx.showToast({
                //   title: '附近没有商家',
                //   icon: 'none'
                // })
                wx.hideLoading()
                return false
            }
            console.log(222)
            let swiperList = data.info.map(item => {
                console.log(333)
                item.discount = item.shopMinRate.toString().split('.')
                return item
            })
            this.setData({
                swiperList: swiperList
            })
            let markers = data.info.map(item => {
                console.log(444)
                item.latitude = item.shopLatitude
                item.longitude = item.shopLongitude
                let icons = this.data.icons.find(it => {
                    return it.shopMinRate === item.shopMinRate
                })
                if (icons) {
                    item.iconPath = icons.iconPath
                }
                return {
                    latitude: item.shopLatitude,
                    longitude: item.shopLongitude,
                    id: item.id,
                    shopMinRate: item.shopMinRate,
                    iconPath: 'https://prop.kabuduo.cn/img/icon/sale_icon_5.0@1x.png'
                }
            })
            if (markers.length) {
                console.log(markers.length)
                let filterArr = markers
                if (filterArr.length) {
                    console.log(777)
                    // let aa = filterArr.map(item => {
                    //     let shopMinRotatea = item.shopMinRate.toFixed(1)
                    //     let url = `/img/shadow/sale_icon_${shopMinRotatea}@1x.png`
                    //     return Ajax.downloadFile({
                            
                    //         url,
                    //         id: item.id,
                    //         shopMinRate: item.shopMinRate
                    //     })
                    // })
                    // Promise.all(aa).then(res => {
                    //     this.setData({
                    //         shadowIcon: res.map(item => {
                    //             return {
                    //                 id: item.id,
                    //                 shopMinRate: item.shopMinRate,
                    //                 iconPath: item.tempFilePath,
                    //             }
                    //         })
                    //     })
                    // })
                    // filterArr = filterArr.map(item => {
                    //     let shopMinRotate = item.shopMinRate.toFixed(1)
                    //     console.log(shopMinRotate)
                    //     let url = `/img/icon/sale_icon_${shopMinRotate}@1x.png`
                    //     var ret = Ajax.downloadFile({
                    //         url,
                    //         id: item.id,
                    //         shopMinRate: item.shopMinRate
                    //     })
                    //     return ret
                    // })
                    Promise.all(filterArr).then(res => {
                        console.log(666)
                        // this.setData({
                        //     icons: res.map(item => {
                        //         return {
                        //             id: item.id,
                        //             shopMinRate: item.shopMinRate,
                        //             iconPath: item.tempFilePath,
                        //         }
                        //     })
                        // })
                      markers = markers.map(item => {
                        let {
                          tempFilePath
                        } = res.find(it => {
                          return it.id === item.id
                        })
                        // console.log(tempFilePath)
                        item.iconPath = util.imgServer + `/img/icon/sale_icon_${item.shopMinRate.toFixed(1)}@1x.png`
                        item.width = 50
                        item.height = 36
                        return item
                      })
                        this.setData({
                            markers: markers
                        })
                        wx.hideLoading()
                    })
                } else {
                    this.setData({
                        markers: markers
                    })
                    wx.hideLoading()
                }
            }
        }).catch(err => {
            console.log(err)
        })
    },
    bindregionchange(e) {
        var animationMiddleHeaderItem = wx.createAnimation({
            duration: 500, // 以毫秒为单位
            timingFunction: 'ease',
        })

        animationMiddleHeaderItem.translate(0, -15).step();
        // animationMiddleHeaderItem.scale(1.4, 1.4).step();
        this.setData({
            animationMiddleHeaderItem: animationMiddleHeaderItem.export()
        });
        setTimeout(function() {
            animationMiddleHeaderItem.translate(0, 0).step();
            // animationMiddleHeaderItem.scale(1, 1).step();
            this.setData({
                animationMiddleHeaderItem: animationMiddleHeaderItem.export()
            })
        }.bind(this), 500)
        this.mapCtx.getCenterLocation({
            success: location => {
                if (location.longitude === this.data.longitudes && location.latitude === this.data.latitudes) {
                    return false
                }
                this.setData({
                    "longitudes": location.longitude
                })
                this.setData({
                    "latitudes": location.latitude
                })
                this.drawMarker(location)
                if (this.data.swiperFlag) {
                    this.bindpolyline()
                }
            }
        })
    },

    bindpolyline() {
        let k = this.data.current
        let index = -1
        this.data.markers = this.data.markers.map((item, key) => {
            if (this.data.swiperList[k].id === item.id) {
              item.width = 72
              item.height = 50
              item.iconPath = util.imgServer + `/img/shadow/sale_icon_${item.shopMinRate.toFixed(1)}@1x.png`
              index = key
            } else {
              item.width = 50
              item.height = 36
              item.iconPath = util.imgServer + `/img/icon/sale_icon_${item.shopMinRate.toFixed(1)}@1x.png`
            }
            return item
        })
        let marker = this.data.markers[index]
        this.data.markers.splice(index, 1)
        this.data.markers.push(marker)
        let origin = marker.longitude + ',' + marker.latitude
        let destination = this.data.longitudes + ',' + this.data.latitudes
        this.BMap.getDrivingRoute({
            origin,
            destination,
            success: data => {
                var points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                    var steps = data.paths[0].steps;
                    for (var i = 0; i < steps.length; i++) {
                        var poLen = steps[i].polyline.split(';');
                        for (var j = 0; j < poLen.length; j++) {
                            points.push({
                                longitude: parseFloat(poLen[j].split(',')[0]),
                                latitude: parseFloat(poLen[j].split(',')[1])
                            })
                        }
                    }
                }
                this.setData({
                    polyline: [{
                        points: points,
                        color: "#FDD804",
                        width: 6
                    }]
                });
            }
        })

    },
    showshop: function(e) {
        //开始触摸时 重置所有删除

      if (!wx.getStorageSync('userInfo')) {
            wx.showToast({
                title: "请先登录。",
                icon: "loading",
                duration: 2000,
                success: function(res) {
                    wx.navigateTo({
                        url: '../login/login'
                    })
                }
            })
        }
        console.log(e)
      var userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo)
        if (!userInfo) {
            // wx.navigateTo({
            //     url: '../login/login',
            // })
            return false
        }
        wx.navigateTo({
            url: '../../packageA/pages/cardRubBuy/cardRubBuy?id=' + this.data.swiperList[e.currentTarget.dataset.index].id
        })
    },
})