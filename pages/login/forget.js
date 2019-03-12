// pages/login/register.js
var time
var app = getApp();
var btt = require('../../utils/btt.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [
      { title: "注册手机号：", type: "number", maxlength: 11, id: 1, name: "tel", password: false },
      { title: "图形验证码：", type: "text", maxlength: 4, id: 2, name: "imgVerification", password: false },
      { title: "短信验证码：", type: "number", maxlength: 6, id: 3, name: "verification", password: false },
      { title: "设置新密码：", type: "text", maxlength: 16, id: 4, name: "password", password: true },
      { title: "确认密码：", type: "text", maxlength: 16, id: 5, name: "passWord", password: true }
    ],
    img: "",
    tel: "",
    imgVerification: "",
    verification: "",
    password: "",
    passWord: "",
    verificationTime: 0
  },
  //获取表单数据
  getInput(e) {
    var name = e.currentTarget.dataset.name
    switch (name) {
      case "tel":
        this.setData({ tel: e.detail.value });
        break;
      case "imgVerification":
        this.setData({ imgVerification: e.detail.value });
        break;
      case "verification":
        this.setData({ verification: e.detail.value });
        break;
      case "password":
        this.setData({ password: e.detail.value });
        break;
      case "passWord":
        this.setData({ passWord: e.detail.value });
        break;
    }
  },
  //忘记密码进行修改
  submit(e) {
    var tel = this.data.tel//注册电话
    var verification = this.data.verification//短信验证码
    var password = this.data.password//设置新密码
    var passWord = this.data.passWord//确认密码
    if (!tel) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
      return
    }
    if (!verification) {
      wx.showToast({
        title: '请填写短信验证码',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '请设置新密码',
        icon: 'none'
      })
      return
    } else if (password.length<8){
      wx.showToast({
        title: '密码最少8位',
        icon: 'none'
      })
      return
    }
    if (!(passWord === password)) {
      wx.showToast({
        title: '密码不一致，请重新输入',
        icon: 'none'
      })
      return
    }
    var data = {
      mobile: tel,
      code: verification,
      password: password,
      confirm_password: passWord
    }
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/findpwd',
      data:data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res)
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(function () {
          wx.navigateBack({})
        }, 1000)
      }
    })
    
  },
  //获取短信验证码
  getVerification() {
    var that=this;
    var tel = that.data.tel
    var imgVerification = that.data.imgVerification
    console.log(imgVerification)
    if (!tel && tel.length == 11) {
      wx.showToast({
        title: '请填写正确手机号',
      })
      return;
    }
    if (!imgVerification && imgVerification.length == 4) {
      wx.showToast({
        title: '请填写正确的图形验证码',
        icon:"none"
      })
      return;
    }
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/sendSms',
      data: {
        openid: wx.getStorageSync('_openid'),
        mobile: tel,
        verify: imgVerification
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if(res.data.code==400){
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        if (res.data.code == 200) {   
          console.log(2222)
          var verificationTime = 60
          time = setInterval(function () {
            verificationTime--;
            that.setData({
              verificationTime: verificationTime
            })
            if (verificationTime <= 0) {
              clearInterval(time)
            }
          }, 1000);
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getImg()
  },
//获取图片验证码
  getImg() {
    var that = this;
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/code',
      data: {
        openid: wx.getStorageSync('_openid')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          img: res.data.data.image
        })
        if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }

      }
    })

    // btt.Post('/plugapi/peisong.passport/code', {}, function (res) {
    //   btt.that.setData({ img: res.data.image })
    // }, true)
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
    clearInterval(time)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})