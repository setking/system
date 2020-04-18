
const app = getApp()
const Ajax = require('../../../utils/ajax.js')
Page({
  data: {
    list: [],
    longitude: '',
    latitude: ''
  },
  // onShow() {
  //   this.init()
  // },
  onLoad(opt) {
    console.log(opt)
    this.setData({
      longitude: opt.longitude,
      latitude: opt.latitude
    })
    wx.showLoading({
      title: '加载中',
    })
    // console.log(longitude)
    //   console.log(latitude)
    Ajax.get('/shop/shop_list_wx_chead', {
      longitude: opt.longitude,
      latitude: opt.latitude
    }).then(res => {
      console.log(res);
      if (res.data.status == 'ok') {
        setTimeout(function () {
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh()
        }, 500)
        //   res.data.sort(compare('res.data.shopMinRate'));
        this.setData({
          list: res.data.info.map(item => {
            if (item.shopMinRate.toString().length == 1) {
              item.shopMinRate = item.shopMinRate + '.0'
            } else {
              item.shopMinRate = item.shopMinRate.toString()
            }
            let arr = item.shopMinRate.split('.')
            item.num1 = arr[0];
            item.num2 = arr[1]
            return item;
          })
        })
        // if (num) {
          console.log(num)
          
          
        // }
        wx.hideLoading()
      } else {
        wx.showToast({
          title: res.data.info || '请求失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
      // wx.showToast({
      //   title: err.data || '请求失败',
      //   icon: 'none'
      // })
    })
  },
  goCard(e) {
    console.log(wx.getStorageSync('userInfo'))
    if (wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: `../cardRubBuy/cardRubBuy?id=${e.currentTarget.dataset.id}`
      })
    } else {
      wx.showToast({
        title: "请先登录。",
        icon: "loading",
        duration: 2000,
        success: function (res) {
          wx.navigateTo({
            url: '../../../pages/login/login'
          })
        }
      })
    }

  },
  // init(num) {
  // },
  onPullDownRefresh() {
    var _this = this;
    wx.showLoading({
      title: '拼命加载中',
      mask: true
    })
    wx.showNavigationBarLoading()
    setTimeout(() => {
      // console.log(this.opt)
      this.onLoad({ latitude: this.data.latitude, longitude: this.data.longitude})
    }, 2000)
  }
})