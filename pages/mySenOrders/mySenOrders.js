Page({

  data: {
    tip:'',
    orders:'',
    type:'',
    orderstatus:'',
    SomeBody:'../images/Noone.png',
    hideTip:true,
    Or:false,
    And:true
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.host + 'order/getOrderDetail',
      data: { id: getApp().globalData.id },
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
        switch (res.data.data.type) {
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
        that.setData({
          type: str
        });
        if (that.data.orders.status == 1) {
          that.setData({
            orderstatus: '取消订单',
            tip: '暂无人接单哦'
          })
        } else if (that.data.orders.status == 2) {
          that.setData({
            orderstatus: '确认完成',
            tip: '服务进行中'
          })
        } else if (that.data.orders.status == 3) {
          that.setData({
            orderstatus: '评价',
            tip: '服务完成'
          })
        } else if (that.data.orders.status == 4) {
          that.setData({
            orderstatus: '再来一单',
            tip: '订单完成'
          })
        } else if (that.data.orders.status == 5) {
          that.setData({
            tip: '订单已取消',
            flag: true
          })
        }
      },
    })
  },

  TurnsenderInfo:function(){
    wx.navigateTo({
      url: '../ContactUser/ContactUser'
    })
  },
  //点击事件
  bindStatus: function () {
    var that = this;
    if (that.data.orders.status == 1) {
      wx.showModal({
        title: '提示',
        content: '确定取消么',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: getApp().globalData.host + 'askForHelp/cancelOrder',
              data: { id: that.data.orders.id },
              method: 'POST',
              header: {
                "content-type": "application/x-www-form-urlencoded",
                'Authorization': wx.getStorageSync('token')
              },
              success: function (res) {
                if (res.data.status == 200) {
                  wx.showToast({
                    title: '订单已取消',
                    icon: 'success',
                    duration: 1000
                  });
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../myorder/myorder'
                    });
                  }, 2000)
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    confirmText: "知道了",
                    showCancel: false
                  })
                }
              },
            })
          }
        }
      });
    } else if (that.data.orders.status == 2) {
      //订单确认完成
      wx.showModal({
        title: '提示',
        content: '确定完成么',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: getApp().globalData.host + 'helpOthers/finishOrder',
              data: { id: that.data.orders.id },
              method: 'POST',
              header: {
                "content-type": "application/x-www-form-urlencoded",
                'Authorization': wx.getStorageSync('token')
              },
              success: function (res) {
                if (res.data.status == 200) {
                  wx.showToast({
                    title: '订单确认完成',
                    icon: 'success',
                    duration: 1000
                  });
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../myorder/myorder'
                    })
                  }, 1000)
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    confirmText: "知道了",
                    showCancel: false
                  })
                }
              },
            })
          }
        }
      });
    } else if (that.data.orders.status == 3) {
      getApp().globalData.id = this.data.orders.id
      wx.navigateTo({
        url: '../evaluate/evaluate'
      })
    } else if (that.data.orders.status == 4) {
      wx.switchTab({
        url: '../order/order'
      })
    }
  },
});