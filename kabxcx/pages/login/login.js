const Ajax = require('../../utils/ajax.js')
const js = require('../../utils/js.js');
Page({
  data: {
    codeText: '发送验证码',
    sendFlag: true,
    time: 60,
    isLogin: true,
    loginInPwd: false
  },
  formsend(e) {
    // console.log(e);
    var phone = e.detail.value.mobile;
    if (!(/^1[34578]\d{9}$/.test(phone)) || phone.length != 11) {
      wx.showToast({
        title: '手机号码有误,请重新输入',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      if (!this.data.sendFlag) return false
      Ajax.post('/user/verify_code', {
        mobile: e.detail.value.mobile,
        isUser: '0'
      }).then(res => {
        console.log(res);
        wx.showToast({
          title: '验证码发送成功',
          icon: 'none'
        })
        this.setData({
          sendFlag: false
        })
        let Time = 60
        let interval = setInterval(() => {
          this.setData({
            codeText: `${Time--}s`
          })
        }, 1000)
        setTimeout(() => {
          clearInterval(interval)
          this.setData({
            sendFlag: true
          })
          this.setData({
            codeText: `重新发送验证码`
          })
        }, 60000)
      }).catch(err => {
        wx.showToast({
          title: err.data.info || '验证码发送失败',
          icon: 'none'
        })
      })


    }

  },
  bindblur(e) {
    Ajax.post('/login/is_reg', {
      isUser: '0',
      mobile: e.detail.value
    }).then(({
      data
    }) => {
      if (data.info === '0') {
        this.setData({
          isLogin: false
        })
        this.setData({
          mobile: e.detail.value
        })
      } else if (data.info === '1') {
        this.setData({
          isLogin: true
        })
        this.setData({
          mobile: e.detail.value
        })
      }
      console.log(this.data.isLogin)
    }).catch(err => {
      console.log(err)
    })
  },
  bindverifyCode(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  userinfo(e) {
    var appInstance = getApp()
    Ajax.post('/user/perfect_userinfo', {
      id: wx.getStorageSync('userInfo').id,
      nickName: e.detail.userInfo.gender.nickName
    }).then(({
      data
    }) => { }).catch(err => {
      wx.showToast({
        title: err.data.info,
        icon: 'none'
      })
    })
  },
  login(e) {
    Ajax.post('/login/login_simple', {
      mobile: this.data.mobile,
      verifyCode: this.data.verifyCode,
      isUser: '0'
    }).then(({
      data
    }) => {
      return Ajax.setStorage('token', data.token)
    }).then((data) => {
      return Ajax.post('/user/user_info', {
        token: data
      })
    }).then(({
      data
    }) => {
      var appInstance = getApp()
      appInstance.globalData.userInfo = data.info
      wx.setStorage({
        key: "userInfo",
        data: data.info
      })
      //   if (e.detail.userInfo) {
      //     return Ajax.post('/user/wx_to_info', {
      //       uid: appInstance.globalData.userInfo.id,
      //       nickName: e.detail.userInfo.nickName,
      //       sex: e.detail.userInfo.gender == 1 ? e.detail.userInfo.gender : 0,
      //       headurl: e.detail.userInfo.avatarUrl
      //     }).then(({ data }) => {
      //       appInstance.globalData.userInfo = data.info
      //       wx.showToast({
      //         title: '登录成功',
      //         icon: 'none',
      //       })

      //       var pages = getCurrentPages(); //当前页面
      //       var prevPage = pages[pages.length - 2]; //上一页面
      //       prevPage.onLoad(prevPage.options);
      //       wx.navigateBack();
      //     }).catch(err => {
      //       wx.showToast({
      //         title: err.data.info,
      //         icon: 'none'
      //       })
      //     })
      //   } else {
      wx.showToast({
        title: '登录成功',
        icon: 'none',
        complete: function () {
          var pages = getCurrentPages(); //当前页面
          var prevPage = pages[pages.length - 2]; //上一页面
          prevPage.onLoad(prevPage.options);
          wx.navigateBack();
        }
      })
      // }
    }).catch(err => {
      wx.showToast({
        title: err.data.info,
        icon: 'none'
      })
    })
  },
  register(e) {
    Ajax.post('/login/register', {
      mobile: this.data.mobile,
      verifyCode: this.data.verifyCode,
      isUser: '0',
      password: ''
    }).then(data => {
      return Ajax.setStorage('token', data.data.token)
    }).then(data => {
      console.log("data")
      console.log(data)
      return Ajax.post('/user/user_info', {
        token: data
      })
    }).then(({
      data
    }) => {
      wx.setStorage({
        key: "userInfo",
        data: data.info
      })
      var appInstance = getApp()
      appInstance.globalData.userInfo = data.info
      if (e.detail.userInfo) {
        appInstance.globalData.userInfo.nickName = e.detail.userInfo.nickName
        return Ajax.post('/user/wx_to_info', {
          uid: wx.getStorageSync('userInfo').id,
          nickName: e.detail.userInfo.nickName,
          sex: e.detail.userInfo.gender == 1 ? e.detail.userInfo.gender : 0,
          headurl: e.detail.userInfo.avatarUrl
        }).then(({
          data
        }) => {
          wx.setStorage({
            key: "userInfo",
            data: data.info
          })
          appInstance.globalData.userInfo = data.info
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            complete: function () { }
          })
          var pages = getCurrentPages(); //当前页面
          var prevPage = pages[pages.length - 2]; //上一页面
          prevPage.onLoad(prevPage.options);
          wx.navigateBack();
        }).catch(err => {
          wx.showToast({
            title: err.data.info,
            icon: 'none'
          })
        })
      } else {
        wx.showToast({
          title: '登录成功',
          icon: 'none',
          complete: function () {
            var pages = getCurrentPages(); //当前页面
            var prevPage = pages[pages.length - 2]; //上一页面
            prevPage.onLoad(prevPage.options);
            wx.navigateBack();
          }
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
    loginPwd(e) {
        wx.redirectTo({
            url: '../loginPwd/loginPwd',
        })
    },
  formSubmit(e) {
    if (this.data.isLogin) {
      this.login(e)
    } else {
      this.register(e)
    }
  },
  userAgreement() {
    wx.navigateTo({
      url: '../userAgreement/userAgreement',
    })
  },
  getPhoneNumber(e) {
    console.log(e)
    wx.getSystemInfo({
      success(res) {
        var isIos
        if (res.platform == "android") {
          isIos = 0
        } else {
          isIos = 1
        }
        wx.login({
          success: res => {
            js.ajaxc("POST", "/login/login_mobile", {
              clientid: "",
              isIos: isIos,
              code: res.code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
            }, function (data) {
              if (data.status == "ok") {
                Ajax.setStorage('token', data.token);
                if (data.isNewUser == 1) {
                  Ajax.post('/user/user_info', {
                    token: data.token
                  }).then(res => {
                    console.log(res)
                    if (res.data.status == 'ok') {
                      wx.setStorage({
                        key: "userInfo",
                        data: res.data.info
                      })
                      wx.showToast({
                        title: '登录成功',
                        icon: 'none',
                        duration: 2000,
                        complete: function () {
                          var pages = getCurrentPages(); //当前页面
                          console.log(pages)
                          var prevPage = pages[pages.length - 2]; //上一页面
                          console.log(prevPage)
                          prevPage.onLoad(prevPage.options);
                          wx.navigateBack();
                        }
                      })
                    }
                  })
                } else {
                  Ajax.post('/user/user_info', {
                    token: data.token
                  }).then(res => {
                    console.log(res)
                    if (res.data.status == 'ok') {
                      wx.setStorage({
                        key: "userInfo",
                        data: res.data.info
                      })
                      wx.redirectTo({
                        url: '../loadding/index',
                      })
                    }
                  })
                }
              } else {
                wx.showToast({
                  title: "网络繁忙,请稍候重试",
                  duration: 2000,
                  icon: "none"
                })
              }
            });

          }
        })
      }
    })

  }
})