// pages/incomeDetail/incomeDetail.js
var app = getApp();
const Ajax = require('../../../utils/ajax')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    status: 0,
    payType:'',
    orderType:'',
    orderlist:[],
    num:null
  },
  toDetail:function(e){
    console.log(e);
      wx.navigateTo({
        url: `../cardEarnings/cardEarnings?id=${e.currentTarget.id}`
      })
    
  },
  toIncomeDe:function(e){
   
  },
  toCardWalletBuy:function(e){
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    Ajax.get('/order/order_list_share',{
      uid: app.globalData.userInfo.id,
      status:0
    }).then(res=>{
      console.log(res);
      for (var i = 0; i < res.data.info.length; i++) {
        if(res.data.info[i].orderType ==3 ){
          this.data.orderlist.push(res.data.info[i])
        }
      }
      this.setData({
        num:this.data.orderlist.length
      })
      console.log(typeof (this.data.orderlist.length))
      if (res.data.status == 'ok'){
        if (res.data.info) {
          this.setData({
            list: res.data.info.map(item => {
              return item
            })
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
