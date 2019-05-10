// pages/bannerDetail/bannerDetail.js
var WxParse = require('../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: "",
    time: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=news&a=newsDetail&id=" + options.id,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code == 200) {
          var result = res.data.result
          this.setData({
            title: result.title,
            content: result.content,
            time: result.add_time,
          })
          WxParse.wxParse('content', 'html', result.content, this, 5);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      }
    });
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