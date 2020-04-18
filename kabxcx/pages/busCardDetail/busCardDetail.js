// pages/busCardDetail/busCardDetail.js
Page({
  toPayCard:function(e){
    var model = JSON.stringify(this.data.data);
    if (!wx.getStorageSync('userInfo')) {
      wx.showToast({
        title: "请先登录。",
        icon: "loading",
        duration: 2000,
        success: function (res) {
          wx.navigateTo({
            url: '../login/login'
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '../busCardPay/busCardBuy?model=' + model
      })
    }
    
  },
  /**
   * 页面的初始数据
   */
  data: {
      big:'',
      small:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.model == null) {
      wx.showToast({
        title: '数据为空',
      })
      var pages = getCurrentPages(); //当前页面
      var prevPage = pages[pages.length - 2]; //上一页面
      prevPage.onLoad();
      wx.navigateBack();
      return;
    }
    var bean = JSON.parse(options.model);
    var info = bean.cardRate.toString();
    this.data.big = info.substring(0,1);
    this.data.small = info.substring(2,3);
    this.setData({
      data: bean,
      big:this.data.big,
      small:this.data.small
    });
    console.log(this.data)
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