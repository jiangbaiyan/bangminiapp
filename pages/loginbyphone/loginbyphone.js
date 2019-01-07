Page({
    data: {
        phone: '',
        code: '',
        color: '#DC143C',
        text: '获取', //按钮文字
        currentTime: 61, //倒计时
        disabled: false, //按钮是否禁用
    },
    //获取验证码按钮
    bindButtonTap: function () {
        var that = this;
        that.setData({
            disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
            color: '#ccc',
        });
        var phone = that.data.phone;
        var currentTime = that.data.currentTime; //把手机号跟倒计时值变例成js值
        if (phone == '' || phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
            wx.showModal({
                title: '提示',
                content: '手机号格式不正确，请重试'
            });
            that.setData({
                disabled: false,
                color: '#DC143C'
            });
            return;
        }
        wx.request({
            url: getApp().globalData.host + "common/getCode",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: "GET",
            data: {
                phone: this.data.phone
            },
            complete: function (res) {
                if (res.data.status == 200) {
                    that.setData({
                        'disabled': true
                    });
                    wx.showToast({
                        title: '验证码已发送',
                        icon: 'success',
                        duration: 500
                    })
                } else if (res.data.status == 402) {
                    wx.showToast({
                        title: '您的发送频率过于频繁，请稍后重试',
                        icon: 'loading',
                        duration: 500
                    })
                }
            }
        });

        //设置一分钟的倒计时
        var interval = setInterval(function () {
            currentTime--; //每执行一次让倒计时秒数减一
            that.setData({
                text: currentTime + 's', //按钮文字变成倒计时对应秒数
            });
            //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
            if (currentTime <= 0) {
                clearInterval(interval);
                that.setData({
                    text: '重发',
                    currentTime: 61,
                    disabled: false,
                    color: '#DC143C'
                })
            }
        }, 1000);
    },
    // 获取输入账号
    setPhone: function (e) {
        this.setData({
            phone: e.detail.value,
        })
    },
    setCode: function (e) {
        this.setData({
            code: e.detail.value,
        })
    },
    openConfirm: function () {
        wx.showModal({
            title:'提示',
            content: '检测到您没有赋予帮帮吧的用户权限，是否赋予?',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                if (res.confirm) {
                    wx.openSetting();
                }
            }
        });
    },
    onGotUserInfo: function (e) {
        var that = this;
        //判断是否获得了用户授权
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userInfo']) {
                    that.openConfirm();
                } else {
                    wx.login({
                        success: function (res) {
                            var wxCode = res.code;
                            var phone = that.data.phone;
                            var code = that.data.code;
                            if (phone == '' || phone.trim().length != 11 || code.trim().length != 4 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
                                wx.showModal({
                                    title: '提示',
                                    content: '手机号或验证码格式不正确，请重试'
                                });
                                return;
                            }
                            wx.request({
                                url: getApp().globalData.host + "common/login",
                                header: {
                                    "content-type": "application/x-www-form-urlencoded"
                                },
                                method: "POST",
                                data: {
                                    phone: phone,
                                    code: code,
                                    wxCode: wxCode,
                                    avatar: e.detail.userInfo.avatarUrl,
                                    nickname: e.detail.userInfo.nickName
                                },
                                success: function (res) {
                                    if (res.data.status == 200) {
                                        wx.setStorage({
                                            key: 'token',
                                            data: res.data.data.token,
                                        });
                                        wx.showToast({
                                            title: '登录成功',
                                            icon: 'success',
                                            duration: 300
                                        });
                                      wx.switchTab({
                                        url: '../ordercalog/ordercalog',
                                      })
                                    } else {
                                        wx.showModal({
                                            title: '提示',
                                            content: res.data.msg,
                                            confirmText: "知道了",
                                            showCancel: false
                                        })
                                    }
                                }
                            });
                        }
                    });
                }
            }
        })
    },
});