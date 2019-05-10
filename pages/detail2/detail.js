// pages/detail/detail.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    marketSupply: "",
    fileList: [],
    publishTime: "",
    supplyTime: "",
    phoneNumber: "",
    isCollection: false,
    priceDW: "",
    loca50010: null,
    loginMask: "loginMask-close",
    ids: null,
    optionsId: null,
    optionsC: null,
    ids: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '求购信息'
    })
    if (options && options.id) {
      wx.setStorageSync("optionsId", options.id);
      this.setData({
        ids: options.id
      })
    }
    if (options && options.c) {
      wx.setStorageSync("optionsC", options.c);
    }
    var optionsId = wx.getStorageSync("optionsId");
    var optionsC = wx.getStorageSync("optionsC").split("_")[0];
    this.setData({
      optionsId: optionsId,
      optionsC: optionsC
    })
    wx.showLoading({
      title: "加载中"
    });
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    if (app.globalData.loca50010) {
      this.setData({
        loca50010: app.globalData.loca50010
      });
    }
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=" + optionsC + "&a=" + optionsC + "Detail&" + optionsC + "_id=" + optionsId,
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        wx.hideLoading();
        var _marketSupply = res.data.result;
        this.setData({
          isCollection: _marketSupply.status
        });
        var icon = _marketSupply.user_info.user_avatar;
        if (icon) {
          if (icon.indexOf("/")) { } else {
            _marketSupply.icon = this.data.imgUrl + icon;
          }
        } else {
          _marketSupply.icon = "../../images/logo.png";
        }
        var _fileList = _marketSupply.pic_list;
        var publishTime = _marketSupply.add_time;
        var supplyTime = _marketSupply.deadline_time.split("-");
        var _supplyTime =
          supplyTime[0] + "年" + supplyTime[1] + "月" + supplyTime[2] + "日";
        var area = _marketSupply.area_merger_name
        _marketSupply.area = ""
        for (let i = 0; i < area.split(",").length; i++) {
          _marketSupply.area += area.split(",")[i]
        }
        var reg = /^[0-9]+.?[0-9]*$/;
        if (!reg.test(_marketSupply.price)) {
          if (_marketSupply.price) { } else {
            this.setData({
              priceDW: "面议"
            });
          }
        } else {
          this.setData({
            priceDW: "元/斤"
          });
        }
        this.setData({
          marketSupply: _marketSupply,
          fileList: _fileList,
          publishTime: publishTime,
          supplyTime: _supplyTime,
          phoneNumber: _marketSupply.cellphone
        });
      }
    });
  },
  shouCang: function (e) {
    if (wx.getStorageSync("session")) {
      if (e.currentTarget.dataset['is_like'] == 0) {
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=likes&a=toLike",
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            Cookie: wx.getStorageSync("session")
          },
          data: { 'demand_id': this.data.optionsId },
          success: res => {
            var marketSupply = this.data.marketSupply
            marketSupply['is_like'] = 1
            this.setData({
              marketSupply: marketSupply
            })
            wx.showToast({
              title: "收藏成功",
              icon: "none",
              duration: 2000
            });
          }
        });
      } else {
        if (this.data.optionsId) {
          wx.request({
            url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=likes&a=dislike",
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded",
              Cookie: wx.getStorageSync("session")
            },
            data: { 'demand_id': this.data.optionsId },
            success: res => {
              var marketSupply = this.data.marketSupply
              marketSupply['is_like'] = 0
              this.setData({
                marketSupply: marketSupply
              })
              wx.showToast({
                title: "取消收藏",
                icon: "none",
                duration: 2000
              });
            },
            fail: function (err) {
            }
          });
        }
      }
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 2000
      });
    }
  },
  ylImg: function (e) {
    if (this.data.fileList) {
      wx.previewImage({
        current: this.data.fileList[e.currentTarget.dataset.index], // 当前显示图片的http链接
        urls: this.data.fileList // 需要预览的图片http链接列表
      });
    }
  },
  getUserInfo: function (e) {
    this.setData({
      loginMask: "loginMask-close"
    });
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: this.data.loca50010 + "/user/xcxLogin",
            method: "post",
            header: {
              "Content-Type": "application/json"
            },
            data: {
              icon: e.detail.userInfo.avatarUrl,
              userName: e.detail.userInfo.nickName,
              sex: e.detail.userInfo.gender,
              js_code: res.code
            },
            success: res => {
              if (res.data.code === "0") {
                this.setData({
                  hasUserInfo: true
                });
                wx.setStorageSync("token", res.data.data.token);
                wx.setStorageSync("user", res.data.data.user);
              }
              wx.showToast({
                title: res.data.message,
                icon: "none",
                duration: 1000
              });
              this.onLoad();
            }
          });
        }
      }
    });
  },
  hideMask: function () {
    this.setData({
      loginMask: "loginMask-close"
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber
    });
  },
  onPullDownRefresh: function () {
    this.onLoad()
  }
});