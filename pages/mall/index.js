// pages/mail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '欢迎光临沃换电瓶，配送时间为',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20 // 时间间隔
  },
  toHome: function(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  toShopping: function () {
    wx.redirectTo({
      url: '../shopping/index',
    })
  },
  toMine: function () {
    wx.redirectTo({
      url: '../mine/mine',
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
    // 页面显示
    var vm = this;
    var length = vm.data.text.length * vm.data.size+70;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    vm.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
    });
    //setTimeout(function(){
      vm.run2();// 第一个字消失后立即从右边出现
    //},1000)
  },
  run2: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance2 < vm.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          vm.run2();
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval);
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