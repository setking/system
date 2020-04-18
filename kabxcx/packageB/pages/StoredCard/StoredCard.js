const app = getApp();
const Ajax = require('../../../utils/ajax.js')
const getQueryString = require('../../../utils/getQueryString.js')
Page({
    data: {
        list: [],
        toatalBalance: 0,
        balanceList: [],
        bigFont: [],
        big: '',
        small: '',
        isScave: ""
    },
    toCardDetail: function(e) {
        console.log(8888);
        var cardtype = e.currentTarget.dataset.cardtype;
      if (wx.getStorageSync('userInfo')) {
            console.log(e.currentTarget.dataset.id)
            // if (cardtype == 0){
                wx.navigateTo({
                    url: "../storedCardDetail/storedCardDetail?id=" + e.currentTarget.dataset.id,
                })
            // }else if(cardtype ==1 ){
            //     wx.navigateTo({
            //         url: "../rechargeStoredDetail/rechargeStoredDetail?id=" + e.currentTarget.dataset.id,
            //     })
            // }else if(cardtype == 2){
            //     wx.navigateTo({
            //         url: '../orderStoreDetail/orderStoreDetail?id=' + e.currentTarget.dataset.id,
            //     })
            // }
            
        }
    },
    // 次卡 自用详情
    // toOrderStored:function(e){
    //     wx.navigateTo({
    //         url: '../orderStoreDetail/orderStoreDetail',
    //     })
    // },
    // 充送卡 自用详情
    // toRechargeStored:function(e){
    //     wx.navigateTo({
    //         url: '../rechargeStoredDetail/rechargeStoredDetail',
    //     })
    // },
    onShow() {
        this.onLoad()
    },
    onLoad() {
        wx.showLoading({
            title: '加载中',
        })
        setTimeout(function() {
            wx.hideLoading()
        }, 500)
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
        Ajax.get('/card/card_list_user', {
          uid: wx.getStorageSync('userInfo').id
        }).then(res => {
            console.log(res.data);
            if (res.data.status == 'ok') {
                // 计算总价
                this.list = res.data.info;
                var total = 0;
                var i = 0;
                for (i in this.list) {
                    total += this.list[i].cardAmount;
                }
                total = total.toFixed(2);
                this.toatalBalance = total;
                this.setData({
                    list: res.data.info.map(item => {
                        item.imgUrl = `http://payp.kabuduo.cn/img/s2/${item.cardRate.toFixed(1)}.png`;
                        item.cardRate = item.cardRate.toString();
                        item.big = item.cardRate.substring(0, 1);
                        item.small = item.cardRate.substring(2, 3);
                        this.data.isScave = item.isScave;
                        return item;
                    }),
                    toatalBalance: total,
                })
            }
        })
    }
})