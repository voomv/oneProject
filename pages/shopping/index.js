// pages/shopping/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,
    allcheck:false,
  },

  toHome: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  toMall: function () {
    wx.redirectTo({
      url: '../mall/index',
    })
  },
  toMine: function () {
    wx.redirectTo({
      url: '../mine/mine',
    })
  },
  allCheck: function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //单选
  checkboxChange:function(e){
    console.log(e)
    var value=e.detail.value;
  },
  //全选
  allCheck:function(e){
    var that=this;
    var allCheck=that.data.allcheck;
    if (!allCheck){
      that.setData({
        checked: true,
        allcheck: true
      })
    }else{
      that.setData({
        checked: false,
        allcheck: false
      })
    }
   
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