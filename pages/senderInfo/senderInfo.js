Page({

  data: {
    phone:''
  },
  callPhone:function(){
    var that=this;
      wx.makePhoneCall({
        phoneNumber: that.data.phone
      })
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.host + 'helpOthers/getReleasedOrderDetail',
      data: { id: getApp().globalData.id },
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
            success: function (res) {
              wx.redirectTo({
                url: '../loginbyphone/loginbyphone'
              })
            }
          })
        }
        if (res.data.status == 200) {
          that.setData({
            inFo: res.data.data,
            phone:res.data.data.sender.phone
          });
          if (res.data.data.sender.sex == 1) {
            that.setData({
              Sex: '男'
            })
          } else if (res.data.data.sender.sex == 0) {
            that.setData({
              Sex: '未知'
            })
          } else{
              that.setData({
                  Sex: '女'
              })
          }
        }
      },
    })
  },
});