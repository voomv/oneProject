// pages/mall/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intFlag:1,//保修
    num:1,
    maxNum:10,
    minNum:1,
    goodsId:'',
    detailsInfo:[],
    price:''
  },
  toMallBuy: function(){
    wx.navigateTo({
      url: 'buy',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    var that=this;
    that.setData({
      goodsId:options.goodsid
    })
    that.getDetailsInfo();
  },
  getDetailsInfo:function(){
    var that =this;
    wx.request({
      url: 'https://ps.voomv.com/api/mall/detail',
      data:{
        openid:wx.getStorageSync('_openid'),
        id:that.data.goodsId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(re){
        console.log(re)
        if(re.data.code==200){
          that.setData({
            detailsInfo:re.data.data.list,
            price:re.data.data.list.price
          })
        }
      }
    })
  },
  //监听input输入的值
  getNum:function(e){
    console.log(e)
    var maxNum=this.data.maxNum;
    var minNum=this.data.minNum;
    if(e.detail.value>maxNum){
      this.setData({
        num:maxNum
      })
      return;
    }else if(e.detail.value<minNum){
      this.setData({
        num:minNum
      })
      return;
    }
    this.setData({
      num:e.detail.value
    })
  },
  //点击加号
  jia:function(){
    var that=this;
    var iNum=that.data.num;
    iNum++;
    if(iNum>5){
      return;
    }
    that.setData({
      num: iNum
    })
    console.log(iNum)
  },
  //点击减号
  jian:function(){
    var that=this;
    var iNum=that.data.num;
    iNum--;
    if(iNum<1){
      return;
    }
    that.setData({
      num:iNum
    })
    console.log('减')
  },
  //规格点击
  speClick:function(e){
    //console.log(e)
    this.setData({
      speFlag:e.currentTarget.dataset.current,
    })
  },
  //购物选项点击
  buyClick:function(e){
    this.setData({
      buyFlag: e.currentTarget.dataset.current,
    })
  },
  //质保选项点击
  qaClick:function(e){
    var qaFlag=e.currentTarget.dataset.current;
    this.setData({
      qaFlag: e.currentTarget.dataset.current,
    })
    if(qaFlag==1){
      //保修一年的价格
      var price=this.data.price+this.data.detailsInfo.warrantyone;
      //console.log(this.data.price, this.data.detailsInfo.warrantyone)
      this.setData({
        price: price
      })
    }else if(qaFlag==2){
      //保修两年的价格
      var price = this.data.price + this.data.detailsInfo.warrantytwo;
     // console.log(this.data.price, this.data.detailsInfo.warrantytwo)
      this.setData({
        price: price
      })
    }
  },
  intClick:function(e){
    
    this.setData({
      intFlag: e.currentTarget.dataset.current,
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