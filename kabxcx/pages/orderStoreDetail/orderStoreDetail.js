// pages/orderStoreDetail/orderStoreDetail.js
const app = getApp();
const Ajax = require('../../utils/ajax.js')
Page({
    // 次卡 充值 跳转
    toOrderCardPay:function(e){
        wx.navigateTo({
            url: '../orderCardPay/orderCardPay',
        })
    },
    // 次卡 自用 买单跳转
    toOrderPrePay:function(e){
        console.log(e)
        wx.navigateTo({
            url: '../orderPrePay/orderPrePay',
        })
    },

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(app);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})