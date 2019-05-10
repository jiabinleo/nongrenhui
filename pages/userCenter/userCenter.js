// pages/userCenter/userCenter.js

var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    item: {
      indexImg: '../../images/tab_shichang_2.png',
      myImg: '../../images/333.png',
      homeUrl: '../index/index',
      userCenterUrl: ''
    },
    nologinImg: '../../images/nologin.png',
    user: {},
    mask: "mask-close",
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    loca50010: null,
    // userInfo: {},
    hasUser: false,
    loginMask: "loginMask-close"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.loginTest()
    wx.showLoading({
      title: "加载中"
    });
    if (wx.getStorageSync("user")) {
      this.setData({
        user: wx.getStorageSync("user")
      });
      this.setData({
        hasUser: true
      });
    }
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      });
    }
    //获取用户信息
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   });
    //   wx.hideLoading();
    // } else if (this.data.canIUse) {
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     });
    //     wx.hideLoading();
    //   };
    // } else {
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo;
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       });
    //       wx.hideLoading();
    //     }
    //   });
    // }
    wx.setNavigationBarTitle({
      title: "我的"
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },
  getUserInfo: function(e) {
    this.setData({
      loginMask: "loginMask-close"
    });
    wx.login({
      success: res => {
        if (res.code) {
          wx.getUserInfo({
            success: res2 => {
              wx.showLoading({
                title: "加载中"
              });
              var encryptedData = res2.encryptedData;
              var iv = res2.iv;
              this.loginFn(res.code, encryptedData, iv);
            },
            fail: err => {
              this.setData({
                hasUser: false
              })
            }
          })
        }
      }
    });
  },
  loginFn: function(code, encryptedData, iv) {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=user&a=login",
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv
      },
      success: res => {
        wx.hideLoading()
        console.log(res)
        if (res.data.code == '200') {
          this.setData({
            user: res.data.result,
            hasUser: true
          })
          try {
            var session = res.header["Set-Cookie"]
            wx.setStorageSync('session', session)
            wx.setStorageSync('user', res.data.result)
          } catch (e) {}
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          this.setData({
            hasUser: false
          })
        }

      },
      fail: function() {

      }
    })
  },
  bindReleaseTap: function() {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=likes&a=likesList",
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: "../myRelease/myRelease"
          });
          this.setData({
            mask: "mask-close"
          });
        } else if (res.data.code === "999") {
          this.setData({
            loginMask: "loginMask"
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  bindCollectionTap: function() {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=likes&a=likesList",
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        if (res.data.code === 200) {
          wx.navigateTo({
            url: "../myCollection/myCollection"
          });
          this.setData({
            mask: "mask-close"
          });
        } else if (res.data.code === "9") {
          this.setData({
            loginMask: "loginMask"
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  close: function() {
    this.setData({
      mask: "mask-close"
    });
  },
  open: function() {
    this.setData({
      mask: "mask"
    });
  },
  loginTest: function() {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=likes&a=likesList",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        if (res.data.code === "999") {
          this.setData({
            hasUser: false
          });
        }
      }
    });
  },
  preventTouchMove: function() {},
  suBu: function(e) {
    this.setData({
      mask: "mask-close"
    });
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=user&a=blackStatus",
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
              success(res) {}
            })
          } else {
            if (e.currentTarget.dataset.type == "supply") {
              wx.navigateTo({
                url: "../supply/supply"
              });
            } else if (e.currentTarget.dataset.type == "buy") {
              wx.navigateTo({
                url: "../buy/buy"
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
  hideMask: function() {
    this.setData({
      loginMask: "loginMask-close"
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});