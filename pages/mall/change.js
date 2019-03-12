// pages/mall/change.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:1,
    page:1,
    goodsInfo:[],
    showFlag:false                        


      



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getInfo();
  },
  tabChange:function(e){
    console.log(e)
    var that=this;
    var tab = e.currentTarget.dataset.current;
    this.setData({
      tab:e.currentTarget.dataset.current
    })
    if (tab==1){
      that.setData({
        goodsInfo:[]
      })
      that.getInfo();
    }else{
      that.setData({
        goodsInfo: []
      })
      that.getInfo();
    }
  },
  //获取商品列表
  getInfo:function(){
    var that=this;
    wx.request({
      url: 'https://ps.dyj168888.com/api/mall/lists',
      data:{
        openid:wx.getStorageSync('_openid'),
        page:that.data.page,
        cid:that.data.tab
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(re){
        //console.log(re)
        if(re.data.code==200){
          if (re.data.data.list.data.length==0){
            that.setData({
              showFlag:true
            })
          }else{
            that.setData({
              goodsInfo: re.data.data.list.data,
              showFlag:false
            })
          }
          
        }
      }

    })
  },
  //详情跳转
  goodsClick:function(e){
    //console.log(e)
    var godds_id=e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/pages/mall/details?goodsid=' + godds_id,
      
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