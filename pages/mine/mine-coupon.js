// pages/mine/mine-coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIdx: 0,
    mcShow0: false,
    mcClass0: true,
    mcShow1: true,
    mcClass1: false,
    mcShow2: true,
    mcClass2: false,
    mcShow3: true,
    mcClass3: false,
    couponList:[]
  },
  //立即领取
  getRightNow:function(e){
    console.log(e)
    var that=this;
    var couid=e.currentTarget.dataset.couid;
    wx.request({
      url: 'https://ps.voomv.com/api/mall/receive',
      data:{
        openid:wx.getStorageSync('_openid'),
        coupon_id:couid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(re){
        console.log(re)
        if(re.data.code==200){
          //领取成功
          wx.showToast({
            title: re.data.data.msg,
            icon:'success'
          })
        }else if(re.data.code==400){
          //缺少参数
          wx.showToast({
            title: re.data.msg,
            icon: 'none'
          })
        }else if(re.data.code==401){
          //优惠券已领完
          wx.showToast({
            title: re.data.msg,
            icon: 'none'
          })
        }else if(re.data.code==402){
          //用户已领取
          wx.showToast({
            title: re.data.msg,
            icon: 'none'
          })
        }else if(re.data.code==404){
          //领取失败
          wx.showToast({
            title: re.data.msg,
            icon: 'none'
          })
        }else if(re.data.code==405){
          //优惠券已过期
          wx.showToast({
            title: re.data.msg,
            icon: 'none'
          })
        }
      }
    })


  },
  // 选项卡-自写
  mineCouponTab: function(e){
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    //console.log(idx);
    if(idx == 0){
      that.setData({
        mcShow0: false,
        mcClass0: true,
        mcShow1: true,
        mcClass1: false,
        mcShow2: true,
        mcClass2: false,
        mcShow3: true,
        mcClass3: false,
      })
    }else if(idx == 1){
      that.setData({
        mcShow0: true,
        mcClass0: false,
        mcShow1: false,
        mcClass1: true,
        mcShow2: true,
        mcClass2: false,
        mcShow3: true,
        mcClass3: false,
      })
    } else if (idx == 2) {
      that.setData({
        mcShow0: true,
        mcClass0: false,
        mcShow1: true,
        mcClass1: false,
        mcShow2: false,
        mcClass2: true,
        mcShow3: true,
        mcClass3: false,
      })
    } else if (idx == 3) {
      that.setData({
        mcShow0: true,
        mcClass0: false,
        mcShow1: true,
        mcClass1: false,
        mcShow2: true,
        mcClass2: false,
        mcShow3: false,
        mcClass3: true,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getCouponList();
  },
  //优惠券列表
  getCouponList:function(){
    var that =this;
    wx.request({
      url: 'https://ps.voomv.com/api/mall/coupon',
      data:{
        openid:wx.getStorageSync('_openid')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(re){
        console.log(re)
        if(re.data.code==200){
          that.setData({
            couponList:re.data.data.list.data
          })
        }
      }
    })
  },
  //待使用，已使用，已过期
  getcouInfo:function(){
    var that=this;
    wx.request({
      url: 'https://ps.voomv.com/api/mall/myCoupon',
      data:{
        openid:wx.getStorageSync('_openid'),
        status:that.data.status
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(re){
        console.log(re)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})