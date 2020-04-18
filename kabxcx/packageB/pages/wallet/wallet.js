const appInstance = getApp();
const Ajax = require('../../../utils/ajax')
Page({
  toIncomeDetail: function(e) {
    // console.log(111)
    if (wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: `../incomeDetail/incomeDetail?id=${wx.getStorageSync('userInfo').id}`,
      })
    }
  },
  data: {
    data: null,
    showDLog: false,
    imgurl: [
      'https://prop.kabuduo.cn/qr/kabuduo.png'
    ]
  },
  onShow() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 500)
    var info = wx.getStorageSync('userInfo')
    Ajax.get('/money/wallet', {
      isUser: '0',
      uid: info.id
    }).then(({
      data
    }) => {
      console.log(data);
      this.setData({
        data: data.info
      })
    }).catch(err => {
      console.log(err)
    })
  },
  showDLog: function() {
    var _this = this;
    _this.setData({
      showDLog: true
    })
  },
  preventTouchMove: function() {

  },
  download: function(e) {
    wx.navigateTo({
      url: '',
    })
  },
  hide: function() {
    var _this = this;
    _this.setData({
      showDLog: false
    })
  },
  showEwm(e) {
    console.log(e);
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgurl // 需要预览的图片http链接列表
    })

    // wx.showActionSheet({
    //   itemList:['识别图中二维码'],
    //   success:function(res){
        
    //   }, 
    //   fail:function(res){
    //     console.log(res.errMsg)
    //   }
    // })
  }
})