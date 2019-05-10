// pages/myRelease/myRelease.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageRows: [],
    imgUrl: null,
    modalFlag: true,
    btn1: 'btn',
    btn2: '',
    pageType: 1,
    token: null,
    page: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的收藏'
    })
    this.getMyPage()
  },
  getMyPage: function () {
    var page = this.data.page
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=likes&a=likesList&page=" + page + "&page_size=10",
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        if (res.data.code === 200) {
          this.setData({
            pageRows: res.data.result.list
          })
        }
      }
    });
  },
  delMsg: function (e) {
    this.setData({
      modalFlag: false
    })
    var data = {}
    if (e.currentTarget.dataset.type === "supply") {
      data = {
        'supply_id': e.currentTarget.dataset.id
      }
    } else if (e.currentTarget.dataset.type === "demand") {
      data = {
        'demand_id': parseInt(e.currentTarget.dataset.id)
      }
    }
    wx.showModal({
      title: "确定取消收藏",
      content: e.currentTarget.dataset.title + '',
      confirmColor: '#3CC51F',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=likes&a=dislike",
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded",
              Cookie: wx.getStorageSync("session")
            },
            data: data,
            success: res => {
              if (res.data.code === 200) {
                var result = this.data.pageRows
                result.splice(e.currentTarget.dataset.index, 1)
                this.setData({
                  pageRows: result
                })
                wx.showToast({
                  title: "取消收藏成功",
                  icon: 'success',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }

            }
          });
        }
      }
    })
  },
  onTouch: function (e) {
    if (e.currentTarget.dataset.c === "supply") {
      wx.navigateTo({
        url: "../detail/detail?c=" + e.currentTarget.dataset.c + "&id=" + e.currentTarget.dataset.id
      });
    } else {
      wx.navigateTo({
        url: "../detail2/detail?c=" + e.currentTarget.dataset.c + "&id=" + e.currentTarget.dataset.id
      });
    }

  },
  onReachBottom() {
    var page = this.data.page + 1
    this.setData({
      page: page
    });
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=likes&a=likesList&page=" + page + "&page_size=10",
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        wx.hideLoading();
        if (res.data.result.list.length) {
          var pageRows = this.data.pageRows.concat(res.data.result.list)
          this.setData({
            pageRows: pageRows
          })
        } else {
          wx.showToast({
            title: "没有新的内容",
            icon: "none",
            duration: 1000
          });
          page--;
          this.setData({
            page: page
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.setData({
      page: 1,
      pageRows: []
    })
    this.onLoad();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  preventTouchMove: function () {
    this.onLoad()
  },
  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})