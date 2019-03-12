// pages/orderList/orderList.js
const app = getApp();
var btt = require('../../utils/btt.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    btt.that = this
    btt.init()
    btt.that.setData({ order_id: options.id, store_id:options.store_id})
    btt.that.getOrderDetail()
  },
  getOrderDetail(){
    var order_id = btt.that.data.order_id
    var store_id = btt.that.data.store_id
    var member_id = wx.getStorageSync("ps_member_id")
    btt.Post("/plugapi/peisong.Withdraw/view", { member_id: member_id, order_id: order_id, store_id: store_id},function(res){
      res.money.ps_money = Number(res.money.ps_money/100).toFixed(2)
      btt.that.setData({detail:res})
    },true)
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
})