var appInstance = getApp()
const Ajax = require('../../utils/ajax.js')
Page({
  data: {
    isLogin: false,
    userInfo: null,
    info: null
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      Ajax.get('/user/center', {
        uid: wx.getStorageSync('userInfo').id
      }).then(({ data }) => {
        console.log(data);

        this.setData({ isLogin: true })
        this.setData({ info: data.info })
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.setData({ isLogin: false })
      this.setData({
        userInfo: null
      })
      this.setData({
        info: null
      })
    }
  },
  card(e) {
    if (this.data.isLogin) {
      if (wx.getStorageSync('userInfo')) {
        wx.navigateTo({
          url: `../../packageB/pages/StoredCard/StoredCard?id=${wx.getStorageSync('userInfo').id}`
        })
      }
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  setup() {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '../setup/setup'
      })
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  wallet() {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: '../../packageB/pages/wallet/wallet'
      })
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  routeLogin() {
    wx.navigateTo({
      url: '../login/login'
    })
  }
})
