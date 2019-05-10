//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    item: {
      indexImg: '../../images/tab_shichang_pre2.png',
      myImg: '../../images/tab_shichang_4.png',
      homeUrl: '',
      userCenterUrl: '../userCenter/userCenter'
    },
    hasUserInfo: false,
    bannerList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    navActive: true,
    ///
    toView: "red",
    scrollTop: 100,
    treeOne: [],
    treeTwo: [],
    treeThree: [],
    viewHeight: 0,
    //
    fl: false,
    dq: false,
    px: false,
    flMsg: "选择分类",
    dqMsg: "选择地区",
    pxMsg: "排序方式",
    newList: [],
    data: {
      a: "supplyList",
      c: "supply",
      page: 1,
      pageSize: 10,
      catCode: 0,
      areaCode: 0,
      sortOrder: "addtime ",
      lat: "",
      lng: ""
    },
    user: null,
    mask: "mask-close",
    active1: null,
    active2: null,
    active3: null,
    loginMask: "loginMask-close",
    content: "",
    newListFixed: "",
    opactiy: 0,
    top: "topHide"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  onLoad: function() {
    //获取用户信息
    if (wx.getStorageSync("user")) {
      this.setData({
        user: wx.getStorageSync("user")
      });
    }
    //banner
    if (app.globalData.imgUrl) {
      this.setData({
        imgUrl: app.globalData.imgUrl
      });
    }
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=banner&a=bannerList",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            bannerList: res.data.result
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 2000
          });
        }
      }
    });
    //定位
    this.loadInfo();
  },
  //nav
  gongying: function() {
    var data = this.data.data;
    data.a = "supplyList";
    data.c = "supply";
    data.page = "1";
    this.setData({
      data: data
    });
    this.setData({
      navActive: true,
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0,
      active1: null,
      active2: null,
      active3: null
    });
    this.getPage(data);
  },
  qiugou: function() {
    var data = this.data.data;
    data.a = "demandList";
    data.c = "demand";
    data.page = "1";
    this.setData({
      data: data
    });
    this.setData({
      navActive: false,
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0,
      active1: null,
      active2: null,
      active3: null
    });
    this.getPage(data);
  },
  tapMove(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    });
  },
  //分类
  fenlei() {
    this.setData({
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      active1: null,
      active2: null,
      active3: null,
      fl: !this.data.fl,
      dq: false,
      px: false
    });
    console.log(this.data.fl)
    if (this.data.fl) {
      wx.request({
        url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=cat&a=catList",
        header: {
          "Content-Type": "application/json"
        },
        success: res => {
          console.log(res)
          if (res.data.code === 200) {
            var treeOne = res.data.result;
            treeOne.unshift({
              code: "",
              name: "不限"
            });
            this.setData({
              treeOne: treeOne
            });
            console.log(this.data.treeOne)
          }
        }
      });
      this.setData({
        viewHeight: 200
      })
    } else {
      this.setData({
        viewHeight: 0
      })
    }
  },
  //地区
  diqu() {
    this.setData({
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      active1: null,
      active2: null,
      active3: null,
      fl: false,
      dq: !this.data.dq,
      px: false
    });
    console.log(this.data.dq)
    if (this.data.dq) {
      wx.request({
        url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=area&a=areaList&parent_code=100000",
        header: {
          "Content-Type": "application/json"
        },
        success: res => {
          if (res.data.code === 200) {
            var treeOne = res.data.result;
            treeOne.unshift({
              code: "",
              name: "不限"
            });
            this.setData({
              treeOne: treeOne
            });
          }
        }
      });
      this.setData({
        viewHeight: 200
      });
    } else {
      this.setData({
        viewHeight: 0
      });
    }
  },
  //排序
  paixu() {
    this.setData({
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      active1: null,
      active2: null,
      active3: null,
      fl: false,
      dq: false,
      px: !this.data.px
    });
    if (this.data.px) {
      var treeTwo = [{
          code: 'views',
          name: '人气最高'
        },
        {
          code: 'addtime',
          name: '时间最新'
        },
        {
          code: 'location',
          name: '距离最近'
        }
      ]
      this.setData({
        treeTwo: treeTwo,
        viewHeight: 200
      });
    } else {
      this.setData({
        viewHeight: 0
      });
    }
  },
  //三级联动第一栏
  oneTag(e) {
    console.log(e)
    if (e.target.dataset.code) {
      this.setData({
        active1: e.target.dataset.index,
        active2: null,
        active3: null,
        treeTwo: [],
        treeThree: []
      });
    }
    if (this.data.fl) {
      if (e.target.dataset.code) {
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=cat&a=catList&parent_code=" +
            e.target.dataset.code,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            if (res.data.code === 200) {
              if (res.data.result.length) {
                var treeTwo = res.data.result
                treeTwo.unshift({
                  code: e.target.dataset.code,
                  name: e.target.dataset.name,
                  showName: '不限'
                })
                this.setData({
                  treeTwo: treeTwo
                });
              } else {
                var data = this.data.data
                data.catCode = e.target.dataset.code
                this.setData({
                  flMsg: e.target.dataset.name,
                  treeOne: [],
                  treeTwo: [],
                  treeThree: [],
                  active1: null,
                  active2: null,
                  active3: null,
                  fl: false,
                  dq: false,
                  px: false,
                  viewHeight: 0,
                  data: data
                })
                this.getPage(data)
              }
            }
          }
        });
      } else {
        var data = this.data.data
        data.catCode = ""
        this.setData({
          flMsg: "不限",
          treeOne: [],
          treeTwo: [],
          treeThree: [],
          active1: null,
          active2: null,
          active3: null,
          fl: false,
          dq: false,
          px: false,
          viewHeight: 0,
          data: data
        })
        this.getPage(data)
      }

    } else if (this.data.dq) {
      if (e.target.dataset.code) {
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=area&a=areaList&parent_code=" +
            e.target.dataset.code,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            if (res.data.code === 200) {
              console.log(res)
              var treeTwo = res.data.result
              treeTwo.unshift({
                code: e.target.dataset.code,
                name: e.target.dataset.name,
                showName: '不限'
              })
              this.setData({
                treeTwo: treeTwo
              });
            }
          }
        });
      } else {
        var data = this.data.data
        data.areaCode = ""
        this.setData({
          dqMsg: "不限",
          treeOne: [],
          treeTwo: [],
          treeThree: [],
          active1: null,
          active2: null,
          active3: null,
          fl: false,
          dq: false,
          px: false,
          viewHeight: 0,
          data: data
        })
        this.getPage(data)
      }
    }
  },
  twoTag(e) {
    if (e.target.dataset.code) {
      this.setData({
        active2: e.target.dataset.index,
        active3: null,
        treeThree: []
      })
      if (this.data.fl) {
        if (e.target.dataset.hide) {
          var data = this.data.data
          data.catCode = e.target.dataset.code
          this.setData({
            treeThree: [],
            flMsg: e.target.dataset.name,
            data: data,
            viewHeight: 0,
            fl: false
          })
          this.getPage(data)
          return
        }
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=cat&a=catList&parent_code=" +
            e.target.dataset.code,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            if (res.data.code === 200) {
              if (res.data.result.length) {
                var treeThree = res.data.result
                treeThree.unshift({
                  code: e.target.dataset.code,
                  name: e.target.dataset.name,
                  showName: '不限',
                })
                this.setData({
                  treeThree: treeThree
                });
                this.getPage(data)
              } else {
                var data = this.data.data
                data.catCode = e.target.dataset.code
                this.setData({
                  flMsg: e.target.dataset.name,
                  treeOne: [],
                  treeTwo: [],
                  treeThree: [],
                  active1: null,
                  active2: null,
                  active3: null,
                  fl: false,
                  dq: false,
                  px: false,
                  viewHeight: 0,
                  data: data
                })
                this.getPage(data)
              }
            }

          }
        });
      } else if (this.data.dq) {
        console.log(e.target.dataset)
        if (e.target.dataset.hide) {
          var data = this.data.data
          data.areaCode = e.target.dataset.code
          this.setData({
            dqMsg: e.target.dataset.name,
            treeOne: [],
            treeTwo: [],
            treeThree: [],
            active1: null,
            active2: null,
            active3: null,
            fl: false,
            dq: false,
            px: false,
            viewHeight: 0,
            data: data
          })
          this.getPage(data)
          return
        }
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=area&a=areaList&parent_code=" +
            e.target.dataset.code,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            if (res.data.code === 200) {
              var treeThree = res.data.result
              treeThree.unshift({
                code: e.target.dataset.code,
                name: e.target.dataset.name,
                showName: '不限'
              })
              this.setData({
                treeThree: treeThree
              });
            }
          }
        });
      } else if (this.data.px) {
        var data = this.data.data
        data.sortOrder = e.target.dataset.code
        this.setData({
          treeThree: [],
          pxMsg: e.target.dataset.name,
          data: data,
          viewHeight: 0,
          px: false
        })
        this.getPage(data)
      } else {
        this.setData({
          active2: e.target.dataset.id,
          treeThree: []
        });
      }
    }
  },
  threeTag(e) {
    console.log(e)
    if (e.target.dataset.code) {
      this.setData({
        active3: e.target.dataset.index,
      })
      if (this.data.fl) {
        var data = this.data.data
        data.catCode = e.target.dataset.code
        this.setData({
          treeThree: [],
          flMsg: e.target.dataset.name,
          data: data,
          viewHeight: 0,
          fl: false
        })
        this.getPage(data)
        return
      } else if (this.data.dq) {
        var data = this.data.data
        data.areaCode = e.target.dataset.code
        this.setData({
          treeThree: [],
          dqMsg: e.target.dataset.name,
          data: data,
          viewHeight: 0,
          dq: false
        })
        this.getPage(data)
        return
      } else {
        this.setData({
          active2: e.target.dataset.id,
          treeThree: []
        });
      }
    }
  },
  //定位
  loadInfo: function() {
    wx.getLocation({
      type: "gcj02", //返回可以用于wx.openLocation的经纬度
      success: res => {
        console.log(res)
        var latitude = res.latitude; //维度
        var longitude = res.longitude; //经度
        this.loadCity(latitude, longitude);
        var data = this.data.data
        data.lat = latitude
        data.lng = longitude
        wx.setStorageSync('latLon', {
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    });
  },
  loadCity: function(latitude, longitude) {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=area&a=getNearLocationCode&lat=" + latitude + "&lng=" + longitude,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        console.log(res)
        if (res.data.code === 200) {
          this.getPage(this.data.data);
        } else {
          wx.showToast({
            title: "没有获取到您所在的位置",
            icon: "none",
            duration: 2000
          });
        }
      },
      fail: function(info) {
        wx.showToast({
          title: "没有获取到您所在的位置",
          icon: "none",
          duration: 2000
        });
      }
    })
  },
  getPage: function(data) {
    console.log(data)
    wx.showLoading({
      title: "加载中"
    });
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=" +
        data.c +
        "&a=" +
        data.a +
        "&page=" +
        data.page +
        "&page_size=" +
        data.pageSize +
        "&cat_code=" +
        data.catCode +
        "&area_code=" +
        data.areaCode +
        "&sort_order=" +
        data.sortOrder +
        "&lat=" +
        data.lat +
        "&lng=" +
        data.lng,
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code === 200) {
          var newsList = res.data.result.list;
          for (let i = 0; i < res.data.result.list.length; i++) {
            // newsList[i].time = this.timeConversion(newsList[i].add_time);
            newsList[i].time = newsList[i].add_time;
          }
          this.setData({
            newList: newsList
          });
        }
      }
    });
  },
  onReachBottom: function() {
    wx.showLoading({
      title: "加载中"
    });
    var data = this.data.data;
    console.log(data);
    data.page++;
    this.setData({
      data: data
    });
    var icon = null;
    var fileList = null;
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=" +
        data.c +
        "&a=" +
        data.a +
        "&page=" +
        data.page +
        "&page_size=" +
        data.pageSize +
        "&cat_code=" +
        data.catCode +
        "&area_code=" +
        data.areaCode +
        "&sort_order=" +
        data.sortOrder +
        "&lat=" +
        data.lat +
        "&lng=" +
        data.lng,
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.result.list.length) {
          var newList = this.data.newList.concat(res.data.result.list)
          this.setData({
            newList: newList
          })
        } else {
          wx.showToast({
            title: "没有新的内容",
            icon: "none",
            duration: 1000
          });
          data.page--;
          this.setData({
            data: data
          });
        }
      }
    });
  },
  onTouch: function(e) {
    console.log(e.currentTarget.dataset.c)
    if (wx.getStorageSync("session")) {
      this.setData({
        session: wx.getStorageSync("session")
      });
    }
    this.closeNav();
    var user = this.data.user;
    if (user && user.id) {
      if (user.id === e.currentTarget.dataset.user) {} else {
        console.log(e.currentTarget.dataset.c)
        // wx.navigateTo({
        //   url: "../detail/detail?c=" + e.currentTarget.dataset.c + "&id=" + e.currentTarget.dataset.id
        // });
      }
    } else {
      console.log(e.currentTarget.dataset.c)
      if (e.currentTarget.dataset.c === "supply_id") {
        wx.navigateTo({
          url: "../detail/detail?c=supply_id&id=" + e.currentTarget.dataset.id
        });
      } else {
        wx.navigateTo({
          url: "../detail2/detail?c=demand_id&id=" + e.currentTarget.dataset.id
        });
      }
    }
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    var data = this.data.data;
    data.page = 1;
    this.setData({
      data: data
    });
    this.onLoad();

    this.setData({
      treeThree: [],
      data: data,
      viewHeight: 0,
      fl: false
    })
  },

  close: function() {
    this.setData({
      mask: "mask-close"
    });
  },
  open: function() {
    console.log("/")
    this.setData({
      mask: "mask"
    });
  },
  preventTouchMove: function() {},
  suBu: function(e) {
    this.setData({
      mask: "mask-close"
    });
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=user&a=blackStatus",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        console.log(res)
        if (res.data.code === 200) {
          if (res.data.result) {
            wx.showModal({
              title: '温馨提示',
              content: `抱歉，您被暂时屏蔽${res.data.result.dura}，请于${res.data.result['end_time']}后进行操作，谢谢！`,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
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
  shouCang: function(e) {
    console.log(e)
    if (wx.getStorageSync("session")) {
      var data = {}
      if (this.data.data.c == "supply") {
        data = {
          'supply_id': e.currentTarget.dataset.id
        }
      } else if (this.data.data.c == "demand") {
        data = {
          'demand_id': e.currentTarget.dataset.id
        }
      }
      console.log(data)
      console.log(e.currentTarget.dataset['is_like'])
      if (e.currentTarget.dataset['is_like'] == 0) {
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=likes&a=toLike",
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            Cookie: wx.getStorageSync("session")
          },
          data: data,
          success: res => {
            console.log(res)
            var newList = this.data.newList
            newList[e.currentTarget.dataset.index]['is_like'] = 1
            newList[e.currentTarget.dataset.index]['likes'] = parseInt(newList[e.currentTarget.dataset.index]['likes']) + 1
            this.setData({
              newList: newList
            })
            wx.showToast({
              title: "收藏成功",
              icon: "none",
              duration: 2000
            });
          }
        });
      } else {
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=likes&a=dislike",
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded",
            // "Content-Type": "application/json",
            Cookie: wx.getStorageSync("session")
          },
          data: data,
          success: res => {
            console.log(res)
            var newList = this.data.newList
            newList[e.currentTarget.dataset.index]['is_like'] = 0
            newList[e.currentTarget.dataset.index]['likes'] -= 1
            this.setData({
              newList: newList
            })
            wx.showToast({
              title: "取消收藏",
              icon: "none",
              duration: 2000
            });
          }
        });
      }
    } else {
      this.setData({
        loginMask: "loginMask"
      });
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    wx.showLoading({
      title: "加载中"
    });
    this.setData({
      loginMask: "loginMask-close"
    });
    wx.login({
      success: res => {
        if (res.code) {
          wx.getUserInfo({
            success: res2 => {
              console.log(res2)
              var encryptedData = res2.encryptedData;
              var iv = res2.iv;
              this.loginFn(res.code, encryptedData, iv);
            }
          })
        } else {
          console.log("获取用户登录态失败！" + res.errMsg);
        }
      },
      complete: function() {
        wx.hideLoading()
      }
    });
  },
  loginFn: function(code, encryptedData, iv) {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=user&a=login",
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
        console.log(res)
        if (res.data.code = '200') {
          wx.hideLoading()
          this.setData({
            user: res.data.result,
            hasUser: true
          })
          try {
            // var session = res.header["Set-Cookie"].split('=')[1].split(';')[0]
            var session = res.header["Set-Cookie"]
            wx.setStorageSync('session', session)
            wx.setStorageSync('user', res.data.result)
          } catch (e) {}
        }

      },
      fail: function() {

      }
    })
  },
  hideMask: function() {
    this.setData({
      loginMask: "loginMask-close"
    });
  },
  timeConversion: function timeConversion(oldTime, tipMsg) {
    var timeText = "";
    if (tipMsg == undefined) {
      var tipMsg = "刚刚发布";
    }
    var disTime = Date.parse(new Date()) - new Date(oldTime).getTime();
    if (disTime < 60 * 1000) {
      timeText = tipMsg;
    } else if (disTime < 60 * 60 * 1000) {
      timeText = parseInt(disTime / 60 / 1000) + "\u5206\u949F\u524D";
    } else if (disTime < 24 * 60 * 60 * 1000) {
      timeText = parseInt(disTime / 60 / 60 / 1000) + "\u5C0F\u65F6\u524D";
    } else {
      timeText = oldTime.split(" ")[0];
    }
    return timeText;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  onPageScroll: function(e) {
    this.closeNav();
    if (e.scrollTop > 150) {
      this.setData({
        content: "content",
        newListFixed: "newListFixed",
        opactiy: (e.scrollTop - 140) / 100
      });
    } else {
      this.setData({
        content: "",
        newListFixed: "",
        opactiy: 0
      });
    }
    if (e.scrollTop > 500) {
      this.setData({
        top: "top"
      });
    } else {
      this.setData({
        top: "topHide"
      });
    }
  },
  top: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },
  closeNav: function() {
    this.setData({
      // navActive: true,
      fl: false,
      dq: false,
      px: false,
      viewHeight: 0,
      active1: null,
      active2: null,
      active3: null
    });
  },
  onShareAppMessage: function() {},
  tabLink: function(e) {
    wx.navigateTo({
      url: "../bannerDetail/bannerDetail?id=" + e.currentTarget.dataset.id
    });
    console.log(e)
  }
});