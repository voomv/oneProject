//var ald = require("./utils/san.js")
var btt = require('./utils/btt.js');
var time
App({
  globalData:{
    appid:"",
    appkey:"",
    apiurl:""

  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.getSetting({
      success(res){
        if (!res.authSetting['scope.userLocation']){
          wx.authorize({
            scope: 'scope.userLocation',
          })
        }
      }
    })
  },
  //定时获取起手位置
  // getPosition() {
  //   var that = this
  //   time = setInterval(function () {
  //     wx.getLocation({
  //       type: 'gcj02',
  //       success(res) {
  //         var lat = res.latitude
  //         var lng = res.longitude
  //         wx.request({
  //           url: btt.globalData.apiurl + '/plugapi/peisong.Receipt/position?appid=' + btt.globalData.appid + "&appkey=" + btt.globalData.appkey +"&openid="+JSON.parse(wx.getStorageSync("btt_member")).open_id,
  //           method:"POST",
  //           data:{
  //             ps_member_id: wx.getStorageSync("ps_member_id"), 
  //             lat: lat, 
  //             lng: lng
  //           },
  //           success(res) { that.globalData.p = true}
  //         })
  //       }
        
  //     })
  //   }, 30000)
    
  // },
  stop(){
    this.globalData.p = false
    clearInterval(time)
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    console.log('进入后台')
    //小程序进入后台后，把按钮状态更改成休息中
    /*
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/status',
      data: {
        member_id: wx.getStorageSync("member_id"),
        status: 0
      },
      success(res) {
        console.log(res)
          wx.setStorageSync('state', false)

      }
    })
    */
  },
  onUnload:function(){
    console.log('页面卸载')
    
  },
  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
