var btt = {
  noticeContent: '欢迎来到宝兔兔微信小程序可视化平台体验',
  noticeWidth: 0,
  noticeLeft: 50,
  interval: '',
  is_login: true,
  that: {}, //
  globalData: {}, //全局配置
  bttLogin: false,
  api: '',

  is_navigationBarColor: true,

  appLastTime: 0,

  setting: {},//网站的SETTING配置
  lat: '',
  lng: '',
  // link: function (e) {
  //   wx.reLaunch({
  //     url: e,
  //   })
  // },
  link: function (e) {
    console.log(e);
    let datas = e.currentTarget.dataset;
    if (datas.link) {
      if (datas.link == 'btt_scan') {
        wx.scanCode({
          success: (res) => {
            if (res.path) {
              wx.navigateTo({
                url: res.path,
              })
            }
          }
        });
      } else if (datas.link == 'btt_tel') {
        let tel = datas.tel ? datas.tel : false;
        if (tel) {
          wx.makePhoneCall({
            phoneNumber: tel,
          });
        } else {
          wx.showModal({
            title: '错误提醒',
            content: '没有正确配置电话',
            showCancel: false,
          })
        }
      } else if (datas.link == 'btt_app') { //跳转到另外一个APP

      } else {
        datas.type = datas.type ? parseInt(datas.type) : 0;
        console.log(datas.type);
        switch (datas.type) {
          case 1:
            wx.redirectTo({
              url: datas.link,
            })
            break;
          default:
            wx.navigateTo({
              url: datas.link,
            })
            break;
        }
      }
    }
  },
  //图片上传
  fileUpload: function (mdl = '', callback, checklogin) {
    btt.getGlobalData(function () {
      var apiurl = btt.globalData.apiurl + '/api/upload/upload?appid=' + btt.globalData.appid
        + '&appkey=' + btt.globalData.appkey;
      if (checklogin && checklogin == true) {
        apiurl += '&openid=' + btt.getOpenId();
      }
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          wx.showLoading({
            title: '图片上传中..',
          })
          wx.uploadFile({
            url: apiurl, //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              'mdl': mdl
            },
            success: function (res) {
              wx.hideLoading();
              wx.showToast({
                title: '上传成功',
              });
              var data = JSON.parse(res.data);//你大爷的强制返回字符串；强制转json
              callback(data.data);
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                content: '图片上传失败',
                showCancel: false,
                confirmColor: btt.setting.color ? btt.setting.color : ''
              })
            }
          });
        }
      });
    });
  },
  init: function () { //初始化
    console.log("init====function");
    console.log(btt.that.options);
    if (btt.that.options.invite) {
      wx.setStorageSync('btt_invite', btt.that.options.invite);
    }
    btt.getSetting();
  },
  /**
* 查看图片
*/
  LookPhoto: function (index, photos) {
    wx.previewImage({
      current: photos[index],
      urls: photos,
    })
  },
  settingCall: function () {
    var local = false;
    for (var a in btt.setting.footer) {
      if (btt.setting.footer[a].page.indexOf(btt.that.route) > -1 && local == false) {
        local = true;
        btt.setting.footer[a].select = 1;
      } else {
        btt.setting.footer[a].select = 0;
      }
    }
    //如果 setting 里面的数据需要重新处理那么
    for (var a in btt.setting.plugins) {
      if (btt.setting.plugins[a].id == 'tubiao') {
        var obj = btt.setting.plugins[a].images;
        var num = btt.setting.plugins[a].num * 2;
        btt.setting.plugins[a].images = btt.paging(obj, num);

        console.log("1======================");
        console.log(btt.setting.plugins[a].images);
        console.log("======================1");
      }
      if (btt.setting.plugins[a].id == 'imagephoto') {
        var obj = btt.setting.plugins[a].images;
        var num = btt.setting.plugins[a].num;
        btt.setting.plugins[a].images = btt.paging(obj, num);
      }
      btt.setting.plugins[a].settingColor = btt.setting.color;
      if (!btt.setting.plugins[a].type) {
        btt.setting.plugins[a].type == 1;
        //console.log(111);
      }
      // console.log(btt.setting.plugins[a]);

    }

    if (!btt.that.data.is_navigationBarColor) {
      btt.that.data.setColor = btt.that.data.setColor ? true : false;
      if (btt.that.data.setColor == false) {
        if (btt.setting.color == '#ffffff' || btt.setting.color == '#FFFFFF') {
          wx.setNavigationBarColor({ backgroundColor: btt.setting.color, frontColor: '#000000' });
        } else {
          wx.setNavigationBarColor({ backgroundColor: btt.setting.color, frontColor: '#ffffff' });
        }
      }
    }

    var isShare = false;
    var share = [];
    for (var a in btt.setting.share) {
      if (btt.setting.share[a].page == '/' + btt.that.route) {
        isShare = true;
        wx.setNavigationBarTitle({
          title: btt.setting.share[a].title ? btt.setting.share[a].title : btt.setting.title,
        });
        share = btt.setting.share[a];
      }
    }
    btt.that.data.setTitle = btt.that.data.setTitle ? true : false;
    if (isShare == false && btt.that.data.setTitle == false) {
      wx.setNavigationBarTitle({
        title: btt.setting.title,
      });
    }

    btt.that.setData({
      setting: btt.setting,
      share: share
    });
  },
  //对数组元素分页
  paging: function (data, num) {
    var index = 0;
    var newArray = [];

    while (index < data.length) {
      newArray.push(data.slice(index, index += num));
    }

    return newArray;
  },
  /** 
   * @param f float 浮点数 
   * @param size int 最多保留小数位数 
   */
  formatfloat: function (f, size = 2) {
    if (isNaN(f)) {
      return 0;
    }
    f = Number(f);
    var tf = f * Math.pow(10, size);
    tf = Math.round(tf + 0.000000001);
    tf = tf / Math.pow(10, size);
    return tf;
  },

  //自定义弹出提示层
  alert: function (msg = '', back = function () { }) {
    wx.showModal({
      content: msg,
      showCancel: false,
      confirmColor: btt.setting.color ? btt.setting.color : '',
      success: function (res) {
        back(res);
      }
    })
  },
  getSetting: function () { //获取网站的配置
    try {
      var value = wx.getStorageSync('btt_setting');
      if (value) {
        var setting = JSON.parse(value);
        if (setting != '') {
          btt.setting = setting;
          btt.settingCall();
        } else {
          btt.Post('/api/index/setting', {}, function (data) {
            btt.setting = data.app_setting;
            wx.setStorageSync('btt_setting', JSON.stringify(btt.setting));
            btt.settingCall();
          });
        }
      } else {
        btt.Post('/api/index/setting', {}, function (data) {
          btt.setting = data.app_setting;
          wx.setStorageSync('btt_setting', JSON.stringify(btt.setting));
          btt.settingCall();
        });
      }
    } catch (e) {
      wx.showModal({
        title: '错误提示',
        content: '读取缓存失败',
        showCancel: false
      });
    }
  },
  //获取全局配置并赋值给变量
  getGlobalData: function (callback) {
    if (!btt.globalData.apiurl) {
      wx.getExtConfig({
        success: function (res) {
          btt.globalData = res.extConfig;
          if (callback) callback();
        }
      })
    } else {
      if (callback) callback();
    }
  },

  //网络请求接口 如果需要登录第四个参数是true
  Post: function (api, params, callback, checklogin) {
    btt.getGlobalData(function () {
      var apiurl = btt.globalData.apiurl + api + '?appid=' + btt.globalData.appid
        + '&appkey=' + btt.globalData.appkey;
      if (checklogin && checklogin == true) {
        apiurl += '&openid=' + btt.getOpenId();
      }
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
      wx.request({
        url: apiurl,
        data: params,
        method: 'POST',
        dataType: 'json',
        success: function (data) {
          // console.log("-----------------------接口请求---------------------");
          // console.log("API:" + apiurl);
          // console.log(data);
          wx.hideLoading();
          switch (data.data.code) {

            case 200:
              //console.log(data.data.data);
              btt.appLastTime = data.data.data.app_last_time;
              btt.api = api;
              if (callback) callback(data.data.data);
              break;
            case 100: //未登录
              wx.showModal({
                content: data.data.msg,
                showCancel: false,
                confirmText: '立即登录',
                confirmColor: btt.setting.color ? btt.setting.color : '',
                success: function () {
                  btt.login(function () {
                    btt.that.onLoad(btt.that.options);
                  });
                }
              })
              break;
            case 404:
              wx.redirectTo({
                url: '/pages/404?data=' + data.data.msg
              })
              break;
            case 301:
              wx.redirectTo({
                url: data.data.msg
              })
              break;
            default:
              wx.showModal({
                content: data.data.msg,
                showCancel: false,
                confirmColor: btt.setting.color ? btt.setting.color : '',
              })
              break;
          }
        },
        fail: function (data) {
          wx.hideLoading();
          wx.showModal({
            content: '请求接口超时',
            showCancel: false,
            confirmColor: btt.setting.color ? btt.setting.color : ''
          })
        }
      });
    });
  },
  //取得OEPNid
  getOpenId: function () {
    var info = wx.getStorageSync('btt_member');
    var userinfo = info ? JSON.parse(info) : {};
    if (!userinfo.open_id) return 0;
    return userinfo.open_id;
  },
  //登录
  login: function (callback, bl) {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          btt.Post('/api/passport/login', {
            code: res.code,
            invite: wx.getStorageSync('btt_invite'),
          }, function (data2) {
            wx.setStorageSync('btt_member', JSON.stringify(data2.member));
            if (!data2.member.face || !data2.member.nick_name) {
              if (bl) {
                wx.getUserInfo({
                  success: function (data) {
                    btt.bttLogin = true
                    var weixinInfo = JSON.parse(data.rawData);
                    btt.Post('/api/passport/bind', { //绑定用户的头像等
                      openid: data2.member.open_id,
                      face: weixinInfo.avatarUrl,
                      nick_name: weixinInfo.nickName,
                      sex: weixinInfo.gender
                    }, function (info) {
                      btt.that.setData({
                        member: info.member
                      });
                      var member = JSON.stringify(info.member);
                      wx.setStorageSync('btt_member', member);
                      if (callback) callback();
                    });
                  },
                  fail() {
                    wx.showModal({
                      title: '提示',
                      content: '未获取用户信息,请授权',
                      success(res){
                        if (res.confirm){
                          btt.login(function(){
                            btt.that.onLoad();
                          })
                        }
                      }
                    })
                    if (callback) callback();
                  }
                });
              } else {
                
              }

            } else {
              btt.bttLogin = true
              btt.that.setData({
                member: data2.member
              });
              var member = JSON.stringify(data2.member);
              wx.setStorageSync('btt_member', member);
              if (callback) callback();
            }
          });
        }
      }
    });
  },
};

module.exports = btt;