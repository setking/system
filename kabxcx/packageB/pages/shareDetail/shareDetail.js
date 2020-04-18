// pages/shareDetail/shareDetail.js
var app = getApp();
const Ajax = require('../../../utils/ajax')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
    data: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var info = app.globalData.userInfo
    this.orderid = options.id
    Ajax.get('/order/order_detail', {
      orderid: options.id
    }).then(res => {
      console.log(res)
      if (res.data.status == 'ok') {
        if (res.data.info) {
          this.setData({
            data: res.data.info
          })
        }
      }
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