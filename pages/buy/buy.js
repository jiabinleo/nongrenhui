var QQMapWX = require('../../libs/QQmap-wx-jssdk.min.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    treeOne: [],
    treeTwo: [],
    treeThree: [],
    viewHeight: 0,
    fenlei: "fenlei-close",
    type: "请选择类型",
    are: "请选择地区",
    getAllTreeDiqu: [],
    fl: false,
    dq: false,
    upfile: [],
    upfileWx: [],
    active1: null,
    active2: null,
    start: null,
    end: "2999-12-31",
    postData: {
      area_code: null,
      cat_code: null,
      title: null,
      content: null,
      contact: null,
      cellphone: null,
      start_counts: null,
      total_counts: null,
      price: null,
      deadline_time: null,
      pic_json: [],
      lat: null,
      lng: null
    },
    hiddenFalg: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDate();
    wx.setNavigationBarTitle({
      title: "发布求购"
    });
  },
  //分类
  fenlei() {
    this.setData({
      hiddenFalg: false,
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      fl: true,
      dq: false,
    });
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=cat&a=catList",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code === 200) {
          var treeOne = res.data.result;
          this.setData({
            treeOne: treeOne
          });
        }
      }
    });
    this.setData({
      viewHeight: 200
    })
  },
  //地区
  diqu() {
    this.setData({
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      fl: false,
      dq: true,
      hiddenFalg: false
    });
    if (this.data.dq) {
      wx.request({
        url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=area&a=areaList&parent_code=100000",
        header: {
          "Content-Type": "application/json"
        },
        success: res => {
          if (res.data.code === 200) {
            var treeOne = res.data.result;
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
  //三级联动第一栏
  oneTag(e) {
    if (e.target.dataset.code) {
      this.setData({
        active1: e.target.dataset.index,
        active2: null,
        treeTwo: [],
        treeThree: []
      });
    }
    if (this.data.fl) {
      if (e.target.dataset.code) {
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=cat&a=catList&parent_code=" +
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
                var postData = this.data.postData
                postData['cat_code'] = e.target.dataset.code
                this.setData({
                  type: e.target.dataset.name,
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
                  postData: postData,
                  hiddenFalg: true
                })
              }
            }
          }
        });
      } else {
        var postData = this.data.postData
        postData['cat_code'] = e.target.dataset.code
        this.setData({
          viewHeight: 0,
          type: e.target.dataset.name,
          postData: postData,
          hiddenFalg: true
        })
        return
      }

    } else if (this.data.dq) {
      if (e.target.dataset.code) {
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=area&a=areaList&parent_code=" +
            e.target.dataset.code,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            if (res.data.code === 200) {
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
        var postData = this.data.postData
        postData['area_code'] = e.target.dataset.code
        this.getLatLon(postData['area_code'])
        this.setData({
          viewHeight: 0,
          are: e.target.dataset.name,
          postData: postData,
          hiddenFalg: true
        })
        return
      }
    }
  },
  twoTag(e) {
    if (e.target.dataset.code) {
      this.setData({
        active2: e.target.dataset.index,
        treeThree: []
      })
      if (this.data.fl) {
        if (e.target.dataset.hide) {
          var postData = this.data.postData
          postData['cat_code'] = e.target.dataset.code
          this.setData({
            viewHeight: 0,
            type: e.target.dataset.name,
            postData: postData,
            hiddenFalg: true
          })
          return
        }
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=cat&a=catList&parent_code=" +
            e.target.dataset.code,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            if (res.data.code === 200) {
              var treeThree = res.data.result
              var postData = this.data.postData
              if (res.data.result.length) {
                treeThree.unshift({
                  code: e.target.dataset.code,
                  name: e.target.dataset.name,
                  showName: '不限',
                })
              } else {
                postData['cat_code'] = e.target.dataset.code
              }
              this.setData({
                type: e.target.dataset.name,
                postData: postData,
                hiddenFalg: true,
                treeThree: treeThree
              });
            }
          }
        });
      } else if (this.data.dq) {
        if (e.target.dataset.hide) {
          var postData = this.data.postData
          postData['area_code'] = e.target.dataset.code
          this.getLatLon(postData['area_code'])
          this.setData({
            viewHeight: 0,
            are: e.target.dataset.name,
            postData: postData,
            hiddenFalg: true
          })
          return
        }
        wx.request({
          url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=area&a=areaList&parent_code=" +
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
      }
    }
  },
  threeTag(e) {
    var postData = this.data.postData
    if (e.target.dataset.code) {
      if (this.data.fl) {
        postData['cat_code'] = e.target.dataset.code
        this.setData({
          viewHeight: 0,
          type: e.target.dataset.name,
          postData: postData,
          hiddenFalg: true
        })
        return
      } else if (this.data.dq) {
        postData['area_code'] = e.target.dataset.code
        this.getLatLon(postData['area_code'])
        this.setData({
          viewHeight: 0,
          are: e.target.dataset.name,
          postData: postData,
          hiddenFalg: true
        })
        return
      }
    }
  },
  makePhoneCall: function () {
    this.setData({
      hiddenFalg: true
    })
  },
  zsmp: function () { },
  //数据双向绑定
  titleFn: function (e) {
    var postData = this.data.postData
    postData.title = e.detail.value
    this.setData({
      postData: postData
    });
  },
  totalAmountFn: function (e) {
    var postData = this.data.postData
    postData['total_counts'] = e.detail.value
    this.setData({
      postData: postData
    });
  },
  minAmountFn: function (e) {
    var postData = this.data.postData
    postData['start_counts'] = e.detail.value
    this.setData({
      postData: postData
    });
  },
  priceFn: function (e) {
    var postData = this.data.postData
    postData.price = e.detail.value
    this.setData({
      postData: postData
    });
  },
  contactsFn: function (e) {
    var postData = this.data.postData
    postData.contact = e.detail.value
    this.setData({
      postData: postData
    });
  },
  telephoneFn: function (e) {
    var postData = this.data.postData
    postData.cellphone = e.detail.value
    this.setData({
      postData: postData
    });
  },
  detailFn: function (e) {
    var postData = this.data.postData
    postData.content = e.detail.value
    this.setData({
      postData: postData
    });
  },
  supplyTimeFn: function (e) {
    var postData = this.data.postData
    postData['deadline_time'] = e.detail.value
    this.setData({
      postData: postData
    });
  },
  //上传图片
  chooseImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        var tempFilePaths = res.tempFilePaths;
        var fileWx = this.data.upfileWx;
        fileWx.push(tempFilePaths[0]);
        this.setData({
          upfileWx: fileWx
        });
        wx.uploadFile({
          url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=upload&a=getOssResult",
          filePath: tempFilePaths[0],
          name: "file",
          header: {
            "Content-Type": "multipart/form-data",
            accept: "application/json"
          },
          formData: {},
          success: res => {
            var img = JSON.parse(res.data).result
            var postData = this.data.postData
            postData['pic_json'].push(img)
            this.setData({
              postData: postData
            })
          },
          fail: function (res) { }
        });
      }
    });
  },
  getLatLon: function (areaCode) {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=area&a=getCoorbyCityCode&area_code=" + areaCode,
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        if (res.data.code === 200) {
          var postData = this.data.postData;
          postData.lat = res.data.result.lat
          postData.lng = res.data.result.lng
          this.setData({
            postData: postData
          })
        }
      }
    })
  },
  save: function () {
    var data = this.data.postData
    if (!Math.fround(data.price)) {
      data.price = "面议";
    }
    data['user_id'] = wx.getStorageSync("user")['user_id']
    if (!data.title) {
      wx.showToast({
        title: "请输入标题",
        icon: "none",
        duration: 1000
      });
    } else if (!data['cat_code']) {
      wx.showToast({
        title: "请选择供应类型",
        icon: "none",
        duration: 1000
      });
    } else if (!data['area_code']) {
      wx.showToast({
        title: "请选择地区",
        icon: "none",
        duration: 1000
      });
    } else if (!data['total_counts']) {
      wx.showToast({
        title: "请输入总数量",
        icon: "none",
        duration: 1000
      });
    } else if (!data['start_counts']) {
      wx.showToast({
        title: "请输入起售量",
        icon: "none",
        duration: 1000
      });
    } else if (!data['deadline_time']) {
      wx.showToast({
        title: "请选择供货截止日期",
        icon: "none",
        duration: 1000
      });
    } else if (!data.contact) {
      wx.showToast({
        title: "请输入联系人",
        icon: "none",
        duration: 1000
      });
    } else if (!data.cellphone) {
      wx.showToast({
        title: "请输入11位手机号码",
        icon: "none",
        duration: 1000
      });
    } else if (!data.content) {
      wx.showToast({
        title: "请输入商品详情",
        icon: "none",
        duration: 1000
      });
    } else if (this.checksum(data.content) < 10 * 2) {
      wx.showToast({
        title: "商品详情请至少输入10个字",
        icon: "none",
        duration: 1000
      });
    } else if (!data['pic_json'].length) {
      wx.showToast({
        title: "请上传至少一张图片",
        icon: "none",
        duration: 1000
      });
    } else {
      data['pic_json'] = JSON.stringify(data['pic_json'])
      wx.request({
        url: "https://wxapi.nongrenhui.com/nongren_api/index.php?c=demand&a=addDemand",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: wx.getStorageSync("session")
        },
        data: data,
        success: res => {
          wx.showToast({
            title: "信息发布成功",
            icon: "success",
            duration: 1000
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
        }
      });
    }
  },
  locFn: function () {
    var qqmapsdk = new QQMapWX({
      key: '5NZBZ-LAA3F-LCZJF-JK6KC-DRYTS-ROFQ2' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: addressRes => {
            var postData = this.data.postData
            postData['area_code'] = addressRes.result.ad_info.adcode
            postData.lat = res.latitude
            postData.lng = res.longitude
            this.setData({
              are: addressRes.result.ad_info.province + addressRes.result.ad_info.city + addressRes.result.ad_info.district,
              postData: postData
            })
          },
          fail: function (err) {
          }
        })
      },
      fail: function (err) {
      }
    })
  },
  delImg: function (e) {
    this.setData({
      modalFlag: false
    });
    wx.showModal({
      title: "确定删除",
      content: "第 " + (e.currentTarget.dataset.index + 1) + " 张图片",
      confirmColor: "#3CC51F",
      success: res => {
        if (res.confirm) {
          var upfile = this.data.upfile;
          upfile.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            upfile: upfile
          });
        } else if (res.cancel) { }
      }
    });
  },
  checksum: function (chars) {
    var sum = 0;
    for (var i = 0; i < chars.length; i++) {
      var c = chars.charCodeAt(i);
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        sum++;
      } else {
        sum += 2;
      }
    }
    return sum;
  },
  getDate: function () {
    var date = new Date();
    var y = date.getFullYear()
    var m = (date.getMonth() + 1)
    var d = date.getDate()
    var start = y + "-" + (m < 10 ? ('0' + m) : m) + "-" + (d < 10 ? ('0' + d) : d);
    this.setData({
      start: start
    });
  },
  preventTouchMove: function () { },
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
  // preventTouchMove: function() {}
});