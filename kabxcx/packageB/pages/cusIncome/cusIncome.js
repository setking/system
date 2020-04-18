// pages/cusIncome/cusIncome.js
const app = getApp();
const Ajax = require('../../../utils/ajax.js')
Page({
  toPerDetail: function (e) {
    wx.navigateTo({
      url: `../perDetail/perDetail?id=${e.currentTarget.id}`
    })
  },
  toShareDetail: function (e) {
    wx.navigateTo({
      url: `../shareDetail/shareDetail?id=${e.currentTarget.id}`
    })
  },
  toRechageDetail: function (e) {
    wx.navigateTo({
      url: `../rechargeDetail/rechargeDetail?id=${e.currentTarget.id}`,
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    stype: null,
    cardid: null,
    perlist:'',
    sharelist:'',
    rechangelist:''
  },
  tabqh: function (e) {
    // 实现选项卡切换
    this.setData({
      state: e.currentTarget.id
     
    })
    if (this.data.state == 0) {
      this.perlist()
    }
    if (this.data.state == 1) {
      this.shareList()
    }
    if (this.data.state == 2) {
      this.rechangeList()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.cardid = options.id
      this.setData({
        cardid: options.id
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    this.perlist(),
    this.shareList(),
    this.rechangeList()
  },
  perlist(){
    Ajax.get('/order/order_list_card', {
      uid: app.globalData.userInfo.id,
      cardid: this.cardid,
      status: 2
    }).then(res => {
      if (res.data.status == 'ok') {
        if (res.data.info) {
          this.setData({
            perlist: res.data.info
          })
        }
      }
    })
  },
  shareList(){
    Ajax.get('/order/order_list_card', {
      uid: app.globalData.userInfo.id,
      cardid: this.cardid,
      status: 3
    }).then(res => {
        console.log(res);
      if (res.data.status == 'ok') {
        if (res.data.info) {
          this.setData({
            sharelist: res.data.info
          })
        }
      }
    })
  },
  rechangeList(){
    Ajax.get('/order/order_list_card', {
      uid: app.globalData.userInfo.id,
      cardid: this.cardid,
      status: 1
    }).then(res => {
      if (res.data.status == 'ok') {
        if (res.data.info) {
          this.setData({
            rechangelist: res.data.info
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