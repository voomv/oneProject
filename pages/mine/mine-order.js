// pages/mine/mine-order.js
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
  },
  toTHGoods: function(){
    wx.navigateTo({
      url: 'mine-order-THGoods',
    })
  },
  toConfirm: function(){
    wx.navigateTo({
      url: 'mine-order-confirm',
    })
  },
  toOrderDetail: function(){
    wx.navigateTo({
      url: 'mine-order-detail',
    })
  },
  getRightNow: function () {
    console.log('click get!')
  },
  // 选项卡-优惠券
  mineCouponTab: function (e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    //console.log(idx);
    if (idx == 0) {
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
    } else if (idx == 1) {
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