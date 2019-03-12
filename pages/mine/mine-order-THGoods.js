// pages/mine/mine-order-THGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wg: 0,
    items: [
      { name: 'th', value: '我要退货' , id: 1},
      { name: 'hh', value: '我要换货' , id: 2}
    ]
  },
  toWhichGoods:function(){
    let that = this;
    let id = that.data.wg;
    if(id == 0){
      wx.showToast({
        title: '请选择退货/换货',
        icon: 'none',
        mask: true
      })
    }else if(id == 1){
      wx.navigateTo({
        url: 'mine-order-thing',
      })
    }else if(id ==2){
      wx.navigateTo({
        url: 'mine-order-hhing',
      })
    }
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let that = this;
    that.setData({
      wg: e.detail.value
    })
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