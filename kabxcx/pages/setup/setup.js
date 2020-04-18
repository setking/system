Page({
  data: {
    info: null,
    login: false,
    appInstance: null
  },
  onShow: function () {
    var appInstance = getApp()
    var info = wx.getStorageSync('userInfo')
    if (!info) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
    info.mobile = info.mobile.substring(0, 3) + '****' + info.mobile.substring(info.mobile.length - 4, info.mobile.length)
    this.setData({
      info: info
    })
  },
  changemobile() {
    this.setData({
      login: true
    })
  },
  changeAccount() {
    try {
      this.setData({
        login: false
      })
      wx.clearStorageSync()
      var appInstance = getApp()
      appInstance.globalData.userInfo = null
      wx.redirectTo({
        url: '../login/login',
      })
    } catch (e) {
      wx.showToast({
        title: '更换账号失败',
      })
    }
  }
})