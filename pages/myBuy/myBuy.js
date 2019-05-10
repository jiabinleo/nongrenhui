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
    newfile: [],
    active1: null,
    active2: null,
    start: null,
    end: "2999-12-31",
    latLon: {},
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
    var id = options.id
    this.getDate();
    this.getData(id)
    wx.setNavigationBarTitle({
      title: "我发布的求购"
    });
  },
  //获取详情
  getData(id) {
    wx.request({
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=demand&a=demandDetail&demand_id=" + id,
      header: {
        "Content-Type": "application/json",
        Cookie: wx.getStorageSync("session")
      },
      success: res => {
        if (res.data.code == "200") {
          var result = res.data.result
          var postData = this.data.postData
          postData = result
          this.getLatLon(postData['area_code'])
          this.setData({
            title: result.title,
            type: result['cat_name'],
            are: result['area_merger_name'],
            'total_counts': result['total_counts'],
            'start_counts': result['start_counts'],
            'price': result['price'],
            postData: postData,
            contact: result.contact,
            cellphone: result.cellphone,
            content: result.content,
            upfileWx: result['pic_list']
          })
        }
      }
    })
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
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=cat&a=catList",
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
      hiddenFalg: false,
      treeOne: [],
      treeTwo: [],
      treeThree: [],
      fl: false,
      dq: true
    });
    if (this.data.dq) {
      wx.request({
        url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=area&a=areaList&parent_code=100000",
        header: {
          "Content-Type": "application/json",

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
          url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=cat&a=catList&parent_code=" +
            e.target.dataset.code,
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            if (res.data.code === 200) {
              var treeTwo = res.data.result
              if (treeTwo.length) {
                treeTwo.unshift({
                  code: e.target.dataset.code,
                  name: e.target.dataset.name,
                  showName: '不限'
                })
              } else {
                console.log(e.target.dataset)
                var postData = this.data.postData
                postData['cat_code'] = e.target.dataset.code
                this.setData({
                  type: e.target.dataset.name,
                  postData: postData,
                  hiddenFalg: true
                })
              }
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
        });
      } else {
        var postData = this.data.postData
        postData['cat_code'] = e.target.dataset.code
        this.setData({
          hiddenFalg: true,
          viewHeight: 0,
          type: e.target.dataset.name,
          postData: postData
        })
        return
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
        this.setData({
          viewHeight: 0,
          are: e.target.dataset.name,
          postData: postData,
          hiddenFalg: true,
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
            hiddenFalg: true,
          })
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
              } else {
                var postData = this.data.postData
                postData['cat_code'] = e.target.dataset.code
                this.setData({
                  type: e.target.dataset.name,
                  postData: postData,
                  hiddenFalg: true
                })
              }
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
        var newfile = this.data.newfile;
        newfile.push(tempFilePaths[0]);
        this.setData({
          newfile: newfile
        });
        wx.uploadFile({
          url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=upload&a=getOssResult",
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
            postData['pic_list'].push(img)
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
      url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=area&a=getCoorbyCityCode&area_code=" + areaCode,
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
    data['pic_json'] = JSON.stringify(data['pic_json'])
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
        title: "请选择求购类型",
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
        title: "请选择购货截止日期",
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
    } else if (!data['pic_list'].length) {
      wx.showToast({
        title: "请上传至少一张图片",
        icon: "none",
        duration: 1000
      });
    } else {
      var newData = {
        title: data.title,
        contact: data.contact,
        cellphone: data.cellphone,
        content: data.content,
        price: data.price,
        'total_counts': data['total_counts'],
        'start_counts': data['start_counts'],
        'deadline_time': data['deadline_time'],
        'cat_code': data['cat_code'],
        'area_code': data['area_code'],
        'pic_json': JSON.stringify(data['pic_list']),
        lat: this.data.latLon.latitude,
        lng: this.data.latLon.longitude,
        'demand_id': data['demand_id']
      }
      wx.request({
        url: "https://wxapi.nongrenhui.com/nongren_api/index2.php?c=demand&a=editDemand",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: wx.getStorageSync("session")
        },
        data: newData,
        success: res => {
          // if (res.data.code === "0") {
          wx.showToast({
            title: "信息修改成功",
            icon: "success",
            duration: 1000
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000);
        }
        // }
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
          var upfileWx = this.data.upfileWx;
          var newfile = this.data.newfile;
          if (e.currentTarget.dataset.s == 1) {
            newfile.splice(e.currentTarget.dataset.index, 1);
          } else {
            upfileWx.splice(e.currentTarget.dataset.index, 1);
          }
          this.setData({
            upfileWx: upfileWx,
            newfile: newfile
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