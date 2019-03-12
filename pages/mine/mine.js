//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    tab_index:1,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderList:[],   //数据对象
    page:1,
    load:true,
    loading:false,
    bottom:false,
  },
  //去首页
  toHome(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  //去我的页面
  toMe:function(){
    wx.navigateTo({
      url: '/pages/mine/mine'
    })
  },

//交易记录详情

//  toOrderDetail:function(e){  
//    var id = e.currentTarget.dataset.id;
//    var store_id = e.currentTarget.dataset.store_id
//     wx.navigateTo({
//       url: '../orderDetail/orderDetail?id=' + id + "&store_id=" + store_id
//     })
//  },

 //退出登录
  back(){
    wx.removeStorageSync("member_id")
    wx.removeStorageSync("loginTime")
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },
  onLoad: function (options) {
    var that=this;
    var userInfo = wx.getStorageSync('_userinfo');
    //判断是否登录
    if (userInfo) {
      that.getOrderList();
      that.getInfo();
    }
   
  },
  //获取交易记录信息
  getOrderList(){
    var that=this;
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_user/recording',
      data:{
        member_id: wx.getStorageSync("member_id"),
        openid: wx.getStorageSync("_openid"),
        page:that.data.page
      },
      success(res){
        console.log(res)
        that.setData({
          orderList: res.data.data.data,
        })
      }
    })
    
  },
  //获取个人信息
  getInfo:function(){
    var that=this;
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_user/user',
      data:{
        member_id: wx.getStorageSync("member_id"),
        openid: wx.getStorageSync("_openid"),
      },
      success(res){
        console.log(res)
        that.setData({
          userInfo:res.data.data,
        })
      }
    })

  },
  onShow:function(){
    var that = this;
    that.getOrderList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    var p = that.data.page;
    var orderList = that.data.orderList;
    if(that.data.load){
      p++;
      that.setData({
        page:p
      })
      wx.request({
        url: 'https://ps.voomv.com/api/peisong_user/recording',
        data: {
          member_id: wx.getStorageSync("member_id"),
          openid: wx.getStorageSync("_openid"),
          page: p
        },
        success(res) {
          console.log(res)
          if(res.data.code==200){
            var list=res.data.data.data;
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
            if (list.length==0){
              //到底了
              that.setData({
                load: false,
                loading:false,
                bottom:true
              })
              setTimeout(function () {
                that.setData({
                  bottom: false,
                })
              }, 1000)
            }else{
              for(var i=0;i<list.length;i++){
                orderList.push(list[i])
              }
              setTimeout(function () {
                that.setData({
                  orderList: list,
                  load: true,
                  loading: true,
                  bottom: false
                })
              }, 1000)
              
            }
          }
          
        }
      })
    }
  },
})
