// pages/loginPwd/loginPwd.js
const Ajax = require('../../utils/ajax.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        sendFlag: true,
        isLogin: true,
        mobile: null,
        userpwd: null
    },
    getMobile(e) {
        var _this = this;
        _this.setData({
            mobile: e.detail.value
        })
    },
    getPwd(e) {
        var _this = this;
        _this.setData({
            userpwd: e.detail.value
        })
    },
    // login(e) {
    //     console.log(e)
    //     console.log(this.data.mobile)
    //     console.log(this.data.userpwd)
    //     Ajax.post('/login/login_in', {
    //         mobile: this.data.mobile,
    //         password: this.data.userpwd,
    //         isUser: 0
    //     }).then(({
    //         data
    //     }) => {
    //         return Ajax.setStorage('token', data.token)
    //     }).then((data) => {
    //         console.log(data);
    //         return Ajax.post('/user/user_info', {
    //             token: data
    //         })
    //     }).then(({
    //         data
    //     }) => {
    //         var appInstance = getApp()
    //         appInstance.globalData.userInfo = data.info
    //         console.log(appInstance.userInfo)
    //         wx.setStorage({
    //             key: "userInfo",
    //             data: data.info
    //         })

    //         if (data.status == "ok") {
    //             wx.showToast({
    //                 title: '登录成功',
    //                 icon: 'none',
    //                 duration: 2000,
    //                 complete: function() {
    //                     var pages = getCurrentPages(); //当前页面
    //                     var prevPage = pages[pages.length - 2]; //上一页面
    //                     prevPage.onLoad(prevPage.options);
    //                     wx.navigateBack();
    //                 }
    //             })
    //         }

    //     }).catch(err => {
    //         wx.showToast({
    //             title: err.data.info,
    //             icon: 'none'
    //         })
    //     })
    // },
    formSubmit(e) {
        Ajax.post('/login/login_in', {
            mobile: this.data.mobile,
            password: this.data.userpwd,
            isUser: 0
        }).then(({
            data
        }) => {
            return Ajax.setStorage('token', data.token)
        }).then((data) => {
            console.log(data);
            return Ajax.post('/user/user_info', {
                token: data
            })
        }).then(({
            data
        }) => {
            var appInstance = getApp()
            appInstance.globalData.userInfo = data.info
            console.log(appInstance.userInfo)
            wx.setStorage({
                key: "userInfo",
                data: data.info
            })

            if (data.status == "ok") {
                wx.showToast({
                    title: '登录成功',
                    icon: 'none',
                    duration: 2000,
                    complete: function () {
                        var pages = getCurrentPages(); //当前页面
                        var prevPage = pages[pages.length - 2]; //上一页面
                        prevPage.onLoad(prevPage.options);
                        wx.navigateBack();
                    }
                })
            }

        }).catch(err => {
            wx.showToast({
                title: err.data.info,
                icon: 'none'
            })
        })
        // this.login(e)
    },
    userAgreement() {
        wx.navigateTo({
            url: '../userAgreement/userAgreement',
        })
    },
    login:function(e){
        wx.navigateTo({
            url: '../login/login',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})