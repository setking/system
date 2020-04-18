const Ajax = require('../../utils/ajax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parma: ''
  },
  onLoad (opt) {
    this.setData({
      id: opt.id
    })
  },
  showDLog () {
    wx.navigateTo({
      url: '../cardRubBuy/cardRubBuy?id=' + this.data.id +'&state=1'
    })
  }
})