//app.js
const Ajax = require('./utils/ajax.js')
App({
  onLaunch: function () {

    if (isBlank(wx.getStorageSync('openid'))) {
      wx.login({
        success: res => {
          Ajax.post('/login/weixinlogin', {
            code: res.code
          }).then(({ data }) => {
            console.log(data.info)
            wx.setStorage({
              key: "openid",
              data: data.info
            })
          })
        }
      })
    }
    if (!isBlank(wx.getStorageSync('userInfo'))) {
    wx.getStorage({
      key: 'userInfo',
      success: ({ data }) => {
        console.log("data")
        this.globalData.userInfo = data
      }
      })
    }
    wx.getStorage({
      key: 'token',
      success: ({data}) => {
        Ajax.post('/user/user_info', {
          token: data
        }).then(({ data }) => {
          wx.setStorage({
            key: "userInfo",
            data: data.info
          })
          this.globalData.userInfo = data.info
          }).catch(err => {
            if (err.data.status == 'toperro') {
              wx.showToast({
                title: '您的账号已在其他地方登录',
                icon: 'none',
                success: function (res) {
                  setTimeout(function () { 
                    wx.navigateTo({
                      url: `/pages/login/login`
                    })
                  }, 200);
                }
              })
            }
          })
      },
      fail: ({ data }) => {
        // setTimeout(function () {
        //   wx.navigateTo({
        //     url: `/pages/login/login`
        //   })
        // }, 200);
      }
    })
  },
  globalData: {
    userInfo: null
  }
})



/**
 * 用于判断空，Undefined String Array Object
 */
function isBlank(str) {
  if (Object.prototype.toString.call(str) === '[object Undefined]') { //空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }

}