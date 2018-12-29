Page({

    data: {
        hiddenModal: true,
        orders: [],
        type: '',
        hiddenModal: true,
        phonecall: '',
    },
    onShow: function () {
        this.onLoad();
    },
    phonecallevent: function (e) {
        wx.makePhoneCall({
            phoneNumber: this.data.phonecall
        })
    },
    onLoad: function () {
        var that = this;
        wx.request({
            url: getApp().globalData.host + 'helpOthers/getReleasedOrderDetail?',
            data: {id: getApp().globalData.id},
            method: 'GET',
            header: {
                'Accept': 'application/json',
                'Authorization': wx.getStorageSync('token')
            },
            success: function (res) {
                if (res.data.status == 401) {
                    wx.showModal({
                        title: '提示',
                        content: "请重新登录",
                        confirmText: "确定",
                        showCancel: false,
                        success: function () {
                            wx.redirectTo({
                                url: '../loginbyphone/loginbyphone'
                            })
                        }
                    })
                }
                if (res.data.data != []) {
                    that.setData({
                        orders: res.data.data,
                        phonecall: res.data.data.sender.phone,
                    })
                }
                var str;
                switch (that.data.orders.type) {
                    case 0:
                        str = '跑腿';
                        break;
                    case 1:
                        str = '悬赏提问';
                        break;
                    case 2:
                        str = '学习辅导';
                        break;
                    case 3:
                        str = '技术服务';
                        break;
                    case 4:
                        str = '生活服务';
                        break;
                    case 5:
                        str = '其他';
                        break;
                }
                this.setData({
                    type: str
                });
            },
        })
    },
    showModal: function () {
        this.setData({
            hiddenModal: !this.data.hiddenModal
        })
    },
    listenerCancel: function () {
        this.setData({
            hiddenModal: true
        })
    },
    TurnsenderInfo: function () {
        wx.navigateTo({
            url: '../contactSender/contactSender'
        })
    },
    Release: function () {
        var that = this
        wx.request({
            url: getApp().globalData.host + 'helpOthers/receiveOrder',
            data: {
                id: getApp().globalData.id
            },
            header: {
                'Accept': 'application/json',
                'Authorization': wx.getStorageSync('token')
            },
            method: 'POST',
            success: function (res) {
                if (res.data.status == 402) {
                    wx.showToast({
                        title: '不能接自己的单',
                        icon: 'loading',
                        image: '',
                        duration: 1500,
                        mask: true,
                        success: function (res) {
                        },
                        fail: function (res) {
                        },
                        complete: function (res) {
                        },
                    });
                    that.setData({
                        hiddenModal: true
                    });
                    setTimeout(function () {
                        wx.switchTab({
                            url: '../ordercalog/ordercalog'
                        })
                    }, 1000)
                } else if (res.data.status == 200) {
                    wx.showToast({
                        title: '已接单',
                        icon: 'success',
                        image: '',
                        duration: 1500,
                        mask: true,
                        success: function (res) {
                        },
                        fail: function (res) {
                        },
                        complete: function (res) {
                        },
                    });
                    that.setData({
                        hiddenModal: true
                    });
                    setTimeout(function () {
                        wx.switchTab({
                            url: '../myorder/myorder'
                        })
                    }, 1000)
                }
            }
        })
    },
});