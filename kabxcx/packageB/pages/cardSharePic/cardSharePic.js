// pages/cardSharePic/cardSharePic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    this.setData({
      data: bean
    });
    var thit=this
    wx.getSystemInfo({
      success: (res) => {
        //console.log(res)
        thit.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  init: function () {
    this.context = wx.createCanvasContext('share')
    this.context.setFillStyle('#fff')
    this.context.fillRect(0, 0, 320, 550)
    this.context.setFillStyle('#000')
    this.context.drawImage("../../../resources/Group5.png", 20, 20, 76, 28)
    this.context.setFontSize(16)
    var text = this.data.data.nickName + ' 分享了 ' + this.data.data.shopName + ' 的 ' + this.data.data.shareRate + ' 折储值卡，快来用吧~';
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    for (var a = 0; a < chr.length; a++) {
      if (this.context.measureText(temp).width < 250) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp); 
    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (this.context.measureText(test).width < 220) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      this.context.fillText(row[b], 20, 80 + b * 22, 320);
    }
    var that=this;
    that.context.drawImage("http://payp.kabuduo.cn/img/s2/" + (that.data.data.shareRate * 1).toFixed(1) + ".png", 10, 75 + row.length * 22, 320 - 20, (320 - 20) / 1.7463414634146341);
    that.context.setFillStyle('#fff')
    that.context.setFontSize(14)
    that.context.fillText(this.data.data.shopName, 25, 100 + row.length * 22, 320 - 60);

    that.context.drawImage(this.data.data.headImgUrl, 25, 168 + row.length * 22, 30, 30);

    that.context.setFillStyle('#fff')
    that.context.setFontSize(13)
    that.context.fillText(this.data.data.nickName, 80, 180 + row.length * 22, 320 - 60);
    that.context.fillText(this.data.data.age, 90, 200 + row.length * 22, 320 - 60);
    if (this.data.sex==1)
      that.context.drawImage("../../../resources/man.png", 70, 185 + row.length * 22, 20, 20);
    else
      that.context.drawImage("../../../resources/gril.png", 70, 185 + row.length * 22, 20, 20);
    that.context.setFillStyle('#fff')
    that.context.setFontSize(16)
    that.context.fillText("可共享金额:" + this.data.data.cardAmount, 160, 191 + row.length * 22, 320 - 60);

    that.context.drawImage("../../../resources/share_image.png", 0, 288 + row.length * 22, 320, (320) / 3.588888888888889);
    that.context.setFillStyle('#000')
    that.context.setFontSize(16)
    that.context.fillText("会省钱更会赚钱的", 20, 450 + row.length * 22, 320 - 60);
    that.context.fillText("储值消费利器", 20, 480 + row.length * 22, 320 - 60);
    that.context.drawImage("../../../resources/share_image.png", 160, 400 + row.length * 22, 120, 120);
    that.context.stroke()
    that.context.draw(false, this.getTempFilePath)
  },
  getImageInfo(e){
    wx.getImageInfo({
      src: e,
      success: function (res) {
        console.log(res)
        return res.width / res.height
      }
    })
  },
  //获取临时路径
  getTempFilePath: function () {
    wx.canvasToTempFilePath({
      canvasId: 'share',
      success: (res) => {
        this.setData({
          shareTempFilePath: res.tempFilePath
        })
      }
    })
  },
  //保存至相册
  saveImageToPhotosAlbum: function () {
    this.getTempFilePath()
    if (!this.data.shareTempFilePath) {
      wx.showModal({
        title: '提示',
        content: '图片绘制中，请稍后重试',
        showCancel: false
      })
    }
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareTempFilePath,
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    var model = JSON.stringify(this.data.data);
    console.log('../../../pages/cardScrapePay/cardScrapePay?model=' + model)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.data.nickName + ' 分享了 ' + this.data.data.shopName + ' 的 ' + this.data.data.shareRate + ' 折储值卡，快来用吧~',
      path: '../../../pages/cardScrapePay/cardScrapePay?model=' + model,
      imageUrl:that.data.shareTempFilePath
    }
  }
})