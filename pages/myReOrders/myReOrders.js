Page({

    data: {
        orders: ''
    },
    onLoad: function () {
        var that = this;
        wx.request({
            url: getApp().globalData.host + 'order/getOrderDetail',
            data: {id: getApp().globalData.id},
            method: 'GET',
            header: {
                'Accept': 'application/json',
                'Authorization': wx.getStorageSync('token')
            },
            success: function (res) {
                if (res.data.data != []) {
                    that.setData({
                        orders: res.data.data,
                    })
                }
                if (res.data.data.receiver != '') {
                    that.setData({
                        hideTip: false,
                        Or: true,
                        And: false
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
                if (that.data.orders.status == 1) {
                    that.setData({
                        tip: '暂无接单哦'
                    })
                } else if (that.data.orders.status == 2) {
                    that.setData({
                        tip: '服务进行中'
                    })
                } else if (that.data.orders.status == 3) {
                    that.setData({
                        tip: '等待评价'
                    })
                } else if (that.data.orders.status == 4) {
                    that.setData({
                        tip: '服务完成'
                    })
                } else if (that.data.orders.status == 5) {
                    that.setData({
                        flag: true
                    })
                }
            },
        })
    },
    TurnsenderInfo: function () {
        wx.navigateTo({
            url: '../ContactSender/ContactSender'
        })
    }
});