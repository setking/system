const util = require('./util.js')
const Ajax = function () {
}
Ajax.prototype.request = function (config = {}) {
  config.url = util.server + config.url
  return new Promise(function (resolve, reject) {
    wx.getStorage({
      key: 'token',
      success: function({ data }) {
        config.header = {
          token: data
        }
        config.success = function (res) {
          if (res.statusCode == 302) {
            wx.showToast({
              title: '您的账号已在其他地方登录',
              icon: 'none',
              success: function (res) {
                setTimeout(function () {
                  wx.navigateTo({
                    url: `/pages/login/login`
                  })
                }, 1500);
              }
            })
          }
          if (res.data.status !== 'ok') {
            reject(res)
          } else {
            resolve(res)
          }
        }
        config.fail = reject
        wx.request(config)
      },
      fail: function (err) {
        if (config.header) {
          config.header.token = ''
        }
        config.success = function (res) {
          if (res.data.status !== 'ok') {
            reject(res)
          } else {
            resolve(res)
          }
        }
        config.fail = reject
        wx.request(config)
      }
    })
  })
}
Ajax.prototype.setParams =  function (param) {
  param = JSON.stringify(param).replace(/"/img, '').replace(/:/g, '=').replace(/,/g, '&')
  return '?' + param.substring(1, param.length - 1)
}
Ajax.prototype.getParams = function getUrlParms (param,name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = param.match(reg);
  console.log(r)
  if (r != null)
    return unescape(r[2]);
  return null;
}
Ajax.prototype.post = function (url, data = {}, config = {}){
  data = JSON.stringify(data).replace(/"/g, '').replace(/:/g, '=').replace(/,/g, '&')
  data = '?' + data.substring(1, data.length - 1)

  wx.showLoading({
    title: '加载中',
  })
  let ret= this.request(Object.assign(config, {
    method: 'post',
    url: url + data
  }))
  wx.hideLoading()
  return ret
}
Ajax.prototype.setStorage = function (key, value) {
  return new Promise(function (resolve) {
    wx.setStorage({
      key,
      data: value,
      success: function (res) {
        resolve(value)
      }
    })
  })
}
Ajax.prototype.get = function (url, data) {

  wx.showLoading({
    title: '加载中',
  })
  let ret=this.request({
    url,
    method: 'get',
    data
  })
  wx.hideLoading()
  return ret
}
Ajax.prototype.downloadFile = function (config = {}) {
  return new Promise((resolve, reject) => {
    var ret;
    wx.downloadFile({
      url: util.imgServer + config.url, //仅为示例，并非真实的资源
      success: function (res) {
        resolve(Object.assign(res, config))
      }
    })
  })
}
module.exports = new Ajax()