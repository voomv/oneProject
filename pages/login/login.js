// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:"",
    pass:"",
    loginFree:false,
    showLogin:false,
    headImg:'',
    nickName:''
  },
  getTel(e){
    this.setData({ tel: e.detail.value})
  },
  getPass(e){
    this.setData({ pass: e.detail.value })
  },
  loginFree(e){
    this.setData({loginFree:this.data.loginFree?false:true})
  },
  login:function(){
    console.log(21222)
    var tel = this.data.tel;
    var pass = this.data.pass;
    console.log(tel)
    var logonFree = this.data.logonFree
    if (!tel){
      wx.showToast({
        title: '未填写登陆手机号',
        icon:"none"
      })
      return
    }
    if (!pass) {
      wx.showToast({
        title: '未填写登陆密码',
        icon: "none"
      })
      return
    }
    this.toLogin();
  
    /*
    if (btt.getOpenId()){
      btt.that.toLogin(tel, pass)
    }else{
      btt.login(function () {
        btt.that.toLogin(tel, pass)
      })
    }
    */
  },
  toLogin(tel, pass){
    var that=this;
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/login',
      data: {
        mobile: that.data.tel,
        password: that.data.pass 
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        console.log(res.data)
        if(res.data.code == 200){
          wx.setStorageSync("member_id", res.data.data.member_id)//存
          if (that.data.loginFree) {//判断是否7天免登录
            var nowTime = Date.parse(new Date());//当前时间
            var loginTime = wx.getStorageSync("loginTime")//缓存时间
            if (loginTime) {
              if (loginTime + (1000 * 60 * 60 * 24 * 7) < nowTime) {
                wx.setStorageSync("loginTime", nowTime)
              }
            } else {
              wx.setStorageSync("loginTime", nowTime);
              that.sevenFree();//7天免登录
            }
            wx.showToast({
              title: '登录成功',
            })
            
          } else {
            wx.showToast({
              title: '登录成功',
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }, 1000)
          }
        }else if(res.data.code==400){
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        
      }
    })
   
  },
  //七天免登录
  sevenFree:function(){
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/memberCache',
      data:{
        member_id: wx.getStorageSync('member_id')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res)
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },
  //跳转注册页面
  zhuce(){
    wx.navigateTo({
      url: '/pages/login/register',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var nowTime = Date.parse(new Date());//当前时间
    var loginTime = wx.getStorageSync("loginTime")//缓存时间
    var member_id = wx.getStorageSync("member_id")//缓存时间
    let hasInfo = that.checkUserInfo();
    if (hasInfo) {
      that.setData({
        showLogin: false,
      })
    } else {
      that.setData({
        showLogin: true,
      })

    }
    if (loginTime && member_id){
      if (loginTime + (1000 * 60 * 60 * 24 * 7) >= nowTime) {
        that.sevenFree();
      }      
    }
    

   
  },
  //从缓存中拿用户信息
  checkUserInfo: function () {
    let userinfo = wx.getStorageSync('_userinfo');
    if (userinfo) {
      return true
    } else {
      return false
    }
  },
  //允许授权
  agreeGetUser: function (res) {
    console.log('agreeGetUser :', res);
    let that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      console.log('agreeGetUser ok');
      that.setData({
        showLogin: false,
        headImg:res.detail.userInfo.avatarUrl,
        nickName:res.detail.userInfo.nickName
      })
      that.wxLogin();
      wx.setStorageSync('_userinfo', res.detail.userInfo)
    }

  },
  //取消授权
  noAgreeGetUser: function () {
    let that = this;
    that.setData({
      showLogin: false
    })
    wx.showToast({
      title: '取消授权',
      icon: 'none',
      task: true
    })
  },
  //微信登录
  wxLogin:function(){
    var that =this;
      wx.login({
        success(res){
          console.log(res)
          wx.request({
            url: 'https://ps.voomv.com/api/peisong_login/WxLogin',
            data:{
              code: res.code,
              username:that.data.nickName,
              headimg:that.data.headImg
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res){
              console.log(res)
              if (res.data.code == 200){
                //登录成功
                wx.setStorageSync('_openid', res.data.data.openid)
                
              }
              if(res.data.code == 400){
                //登录失败
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                })
              }
            },

          })
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
    var that = this
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})