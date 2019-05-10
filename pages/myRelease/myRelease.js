//我的发布
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: {
      pageNum: 1,
      pageSize: 10,
      c: 'supply',
      a: 'mySupplyList'
    },
    pageRows: [],
    modalFlag: true,
    btn1: 'btn',
    btn2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的发布'
    })
    this.getMyPage()
  },
  getMyPage: function () {
    var data = this.data.pageData
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=" + data.c + "&a=" + data.a + "&page=" + data.pageNum + "&page_size=" + data.pageSize,
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        if (res.data.code === 200) {
          var pageRows = res.data.result.list
          this.setData({
            pageRows: pageRows
          })
        }
      }
    });
  },
  onReachBottom: function () {
    var pageData = this.data.pageData
    pageData.pageNum += 1;
    var pageRows = this.data.pageRows
    this.setData({
      pageData: pageData
    })
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=" + pageData.c + "&a=" + pageData.a + "&page=" + pageData.pageNum + "&page_size=" + pageData.pageSize,
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        if (pageRows.length === parseInt(res.data.result['page_info']['total_rows'])) {
          pageData.pageNum -= 1;
          this.setData({
            pageData: pageData
          })
          return;
        }
        pageRows = pageRows.concat(res.data.result.list)
        this.setData({
          pageRows: pageRows
        });
      }
    });
  },
  delMsg: function (e) {
    var c, a, data;
    if (e.currentTarget.dataset.type === "supply") {
      c = "supply";
      a = "delSupply";
      data = {
        "supply_id": e.currentTarget.dataset.id
      }
    } else if (e.currentTarget.dataset.type === "demand") {
      c = "demand";
      a = "delDemand";
      data = {
        "demand_id": e.currentTarget.dataset.id
      }
    }
    this.setData({
      modalFlag: false
    })
    wx.showModal({
      title: "确定删除",
      content: e.currentTarget.dataset.title + '',
      confirmColor: '#3CC51F',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=" + c + "&a=" + a,
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              Cookie: wx.getStorageSync("session")
            },
            data: data,
            success: res => {
              if (res.data.code === 200) {
                var result = this.data.pageRows
                var arr = result.splice(e.currentTarget.dataset.index, 1)
                this.setData({
                  pageRows: result
                })
              }
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          });
        }
      }
    })
  },
  gq: function (e) {
    var pageData = this.data.pageData
    pageData.c = e.currentTarget.dataset.c
    pageData.a = e.currentTarget.dataset.a
    pageData.pageNum = 1
    if (e.currentTarget.dataset.c == 'supply') {
      this.setData({
        btn1: 'btn',
        btn2: ''
      })
    } else if (e.currentTarget.dataset.c == 'demand') {
      this.setData({
        btn2: 'btn',
        btn1: ''
      })
    }
    this.setData({
      pageData: pageData
    })
    this.getMyPage()
  },
  onTouch: function (e) {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=user&a=blackStatus",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        if (res.data.code === 200) {
          if (res.data.result) {
            wx.showModal({
              title: '温馨提示',
              content: `抱歉，您被暂时屏蔽${res.data.result.dura}，请于${res.data.result['end_time']}后进行操作，谢谢！`,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                }
              }
            })
          } else {
            if (e.currentTarget.dataset.type == "supply") {
              wx.navigateTo({
                url: "../mySupply/mySupply?id=" + e.currentTarget.dataset.id
              });
            } else if (e.currentTarget.dataset.type == "demand") {
              wx.navigateTo({
                url: "../myBuy/myBuy?id=" + e.currentTarget.dataset.id
              });
            }
          }
          this.setData({
            mask: "mask-close"
          });
        } else if (res.data.code === "999") {
          this.setData({
            loginMask: "loginMask"
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000
          });
        }
      }
    });


  },
  over: function (e) {
    var _this = this
    var c = this.data.pageData.c
    var data = {}
    if (c == "supply") {
      data = {
        "supply_id": e.currentTarget.dataset.id
      }
    } else if (c == "demand") {
      data = {
        "demand_id": e.currentTarget.dataset.id
      }
    }
    wx.showModal({
      title: '温馨提示',
      content: '你确定要设置成已完成状态吗？',
      success(result) {
        if (result.confirm) {
          wx.request({
            url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=" + c + "&a=setFinish",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              Cookie: wx.getStorageSync("session")
            },
            data: data,
            success: res => {
              if (res.data.code === 200) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
                var pageRows = _this.data.pageRows
                pageRows[e.currentTarget.dataset.index].status = "1"
                _this.setData({
                  pageRows: pageRows
                })
              }
            }
          })
        } else if (result.cancel) {
        }
      }
    })

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
    var pageData = this.data.pageData
    pageData.pageNum = 1
    this.setData({
      pageRows: [],
      pageData: pageData
    })
    if (!this.data.pageRows.length) {
      this.onLoad()
    }
    // this.onLoad()
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    var pageData = this.data.pageData
    pageData.pageNum = 1
    this.setData({
      pageData: pageData
    })
    this.onLoad()
  },
  preventTouchMove: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})