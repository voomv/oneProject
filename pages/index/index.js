// pages/index/index.js
var time
const app = getApp();
var btt = require('../../utils/btt.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_index:0,
    tapSelect:"1",
    lists1: [],
    lists2: [],
    lists3: [],
    state:false,
    getState:"",
    onSocket:false,
    skuInfo1:[],
    skuInfo2:[],
    skuInfo3: [],
    listGoods3:[],
  },
  // 联系顾客
  contact(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  //去首页
  toHome(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  //去我的页面
  toMe: function () {
    wx.navigateTo({
      url: '/pages/mine/mine'
    })
  },
  // 获取当前位置
  getPosition(){
    wx.getLocation({
      type: "gcj02",
      success(res) {
        console.log(res)
        var lat = res.latitude,
            lng = res.longitude
        wx.request({
          url: 'https://ps.voomv.com/api/peisong/position',
          data:{
            member_id: wx.getStorageSync("member_id"),
            lat:lat,
            lng:lng
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res){
            console.log(res)
          }
        })
      }
    })
  },
  
  // 修改骑手状态
  setState(){
    var that=this;
    var userInfo = wx.getStorageSync('_userinfo');
    if (userInfo){
      console.log(111)
      wx.showModal({
        title: '提示',
        content: '确认更改状态',
        success(res) {
          console.log(res)
          if (res.confirm) {
            that.setData({ 
              state: that.data.state ? false : true 
            })
            wx.request({
              url: 'https://ps.voomv.com/api/peisong_login/status',
              data:{
                member_id: wx.getStorageSync("member_id"),
                status: that.data.state ? 1 : 0
              },
              success(res){
                console.log(res)
                wx.showToast({
                  title: '更改成功',
                })
                if (that.data.state) {
                  that.getPosition();//获取当前位置
                  // app.onLaunch(app.getPosition())
                  app.onLaunch(that.getPosition())
                  that.connectSocket()
                } else {
                  app.stop()
                  clearInterval(time)
                  that.data.onSocket = false
                  wx.closeSocket()
                }
              }
            })
          }
        }
      })
    }
  },
  // socket部分开始
  connectSocket(){
    var that=this;
    wx.connectSocket({
      url: 'wss://account.voomv.com',
    })
    wx.onSocketOpen(function(){
      console.log("socket连接成功")
      that.data.onSocket = true;
      var data = JSON.stringify({ 
        id: wx.getStorageSync("member_id"),
        type: 'login'
        })
      if (that.data.onSocket){
        wx.sendSocketMessage({
          data: data
        })
        time = setInterval(function () {
          wx.sendSocketMessage({
            data: JSON.stringify({ 
              id: wx.getStorageSync("member_id"),
              type: 'pong'
            }),
          })
        }, 30000)
      }
    })
  },
  onSocketMessage(){
    var that =this;
    wx.onSocketMessage(function (res) {
      var data = JSON.parse(res.data)
      console.log(data)
      var lists1 = that.data.lists1
      if(data!=200){
        if (data.type == 1){
          wx.vibrateLong({
            success() {
              console.log('type1')
              const innerAudioContext = wx.createInnerAudioContext()
              innerAudioContext.autoplay = true
              innerAudioContext.src = '/dingdong.mp3'
              innerAudioContext.onPlay(() => {
                console.log('开始播放')
              })
            }
          })
        } else if (data.type == 4){
          wx.vibrateLong({
            success() {
              console.log('type4')
              const innerAudioContext = wx.createInnerAudioContext()
              innerAudioContext.autoplay = true
              innerAudioContext.src = '/dingdong.mp3'
              innerAudioContext.onPlay(() => {
                console.log('开始播放')
              })
            }
          })
        }
      }
      switch(data.type){
        case 1:
          for (var i in data.data.ps_money){
            for (var j in data.data.ps_money[i]){
              if (j == btt.that.data.appid){
                data.data.income = Number(data.data.ps_money[i][j] / 100).toFixed(2)
                break;
              }
            }
          }
          console.log(data)
          console.log(data.data)
          lists1.unshift(data.data)
          break;
        case 2:
        //删除指定商品
        console.log('删除商品')
          for (var i in lists1){
            if(lists1[i].order_id==data.order_id){
              lists1.splice(i,1)
            }
          }
          break;
        case 3:
        //type3显示待取货，数据
          that.setData({
            tapSelect:2
          })
          wx.showToast({
            title: '系统派单，请查看',
            icon:'none'
          })
          that.getInfo();
         
          break;
        case 4:
          for (var i in lists1) {
            if (lists1[i].order_id == data.data) {
              lists1.splice(i, 1)
            }
          }
          break;
      }
      that.setData({ lists1: lists1})
    })
  },
  // socket部分结束
  link(e){
    btt.link(e)
  },
  //点击顶部选项卡
  stateChange(e){
    console.log(e)
    var that=this;
    this.setData({ tapSelect: e.currentTarget.dataset.id})
    if (e.currentTarget.dataset.id==1){
      that.getState()
    }else{
      that.getInfo();

    }
  },
  getInfo:function(){
    var that =this;
    wx.request({
      url: 'https://ps.voomv.com/api/peisong/order_list',
      data: {
        member_id: wx.getStorageSync("member_id"),
        type: that.data.tapSelect - 1
      },
      success(res) {
        console.log(res)
        var goods2=[], goods3=[];
        var skuInfo3 = [];
        if (that.data.tapSelect == 2) {
          that.setData({
            lists2: res.data.data
          })
          var lists2 = that.data.lists2;
          for (var i in lists2) {
            for (var j in lists2[i].goods) {
              goods2 = lists2[i].goods
            }
          }
          for (var i in goods2) {
            that.setData({
              skuInfo2: goods2[i].sku
            })
          }
        } else if (that.data.tapSelect == 3) {
          that.setData({
            lists3: res.data.data
          })
          var lists3 = that.data.lists3;
          for (var i in lists3) {
            for (var j in lists3[i].goods) {
              goods3.push(lists3[i].goods[j])
            }
          }
          
          that.setData({
            listGoods3: goods3
          })
          
        }

      }
    })
  },
  //导航
  navigation(e){
    console.log(e)
    var lat = Number(e.currentTarget.dataset.lat)
    var lng = Number(e.currentTarget.dataset.lng)
    var add = e.currentTarget.dataset.add
    console.log(lat)
    console.log(lng)
    console.log(add)
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      name: add,
    })
  },
  //查看全部菜单
  showMenu(e){
    var id = e.currentTarget.dataset.id
    var tapSelect = Number(btt.that.data.tapSelect)
    switch (tapSelect){
      case 1:
        var lists = this.data.lists1;
        break;
      case 2:
        var lists = this.data.lists2;
        break;
      case 3:
        var lists = this.data.lists3;
        break;
    }
    for(var i in lists){
      if(lists[i].order_id == id){
        lists[i].is_sel = lists[i].is_sel?false:true
      }
    } 
    switch (tapSelect) {
      case 1:
        btt.that.setData({lists1:lists})
        break;
      case 2:
        btt.that.setData({ lists2: lists })
        break;
      case 3:
        btt.that.setData({ lists3: lists })
        break;
    }
  },
  //抢单，取餐，送达
  setOrderStatus(e){
    console.log(e)
    var that =this;
    if (!that.data.state){
      console.log('休息')
      wx.showToast({
        title: '当前为休息状态',
        icon:'none'
      })
      return;
    }
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    // var is_chang=e.currentTarget.dataset.is_chang;
    // console.log(is_chang)
    var money = e.currentTarget.dataset.money*100;
    type = Number(type)
    switch(type){
      case 1://抢单
        var data = {
          member_id: wx.getStorageSync("member_id"),
          order_id: id,
          type: e.currentTarget.dataset.is_chang
        }
        wx.request({
          url: 'https://ps.voomv.com/api/peisong/robbing',
          data:data,
          success(res){
            console.log(res)
            if(res.data.code==200){
              wx.showToast({
                title: res.data.data.msg,
              })
              that.setData({
                tapSelect:2
              })
              that.getInfo();
            }
          }
        })
        break;
      case 2://取餐
        wx.showModal({
          title: '提示',
          content: '确认取货',
          success(res){
            if (res.confirm){
              var data = {
                member_id: wx.getStorageSync("member_id"),
                order_id: id,
                type: e.currentTarget.dataset.is_chang
              }
              wx.request({
                url: 'https://ps.voomv.com/api/peisong/complete_meal',
                data:data,
                success(res){
                  console.log(res)
                  if(res.data.code==200){
                    wx.showToast({
                      title: res.data.data.msg,
                    })
                    that.setData({
                      tapSelect: 3
                    })
                    that.getInfo();
                  }

                }
              })
            }
          }
        })
        break;
      case 3://确认送达
        wx.showModal({
          title: '提示',
          content: '确认送达',
          success(res){
            if (res.confirm){
              wx.getLocation({
                type:"gcj02",
                success: function(res) {
                  var lat = res.latitude
                  var lng = res.longitude
                  var data = {
                    member_id: wx.getStorageSync("member_id"),
                    order_id: id,
                    lat:lat,
                    lng:lng,
                    type: e.currentTarget.dataset.is_chang
                  }
                  wx.request({
                    url: 'https://ps.voomv.com/api/peisong/complete_order',
                    data:data,
                    success(res){
                      console.log(res)
                      if(res.data.code==200){
                        wx.showToast({
                          title: res.data.data.msg,                         
                        })
                        that.getInfo();
                      }else if(res.data.code==400){
                        wx.showToast({
                          title: res.data.msg,
                          icon:"none"
                        })
                      }
                    }
                  })
                },
              })
            }
          }
        })
        break;
    }
  },
  //待抢单
  getState(callback){
    var that=this;
    wx.request({
      url: 'https://ps.voomv.com/api/peisong/before_order',
      data:{
        member_id: wx.getStorageSync("member_id")
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res)
        var list1=res.data.data;
        var goods;
        that.setData({ 
          lists1: res.data.data, 
         // state: res.status ? true : false 
        })
        // for(var i in list1){
        //   for(var j in list1[i].goods){
        //     console.log(list1[i].goods)
        //     goods = list1[i].goods;
        //   }
        // }
        // for(var i in goods){
        //   console.log(goods[i].sku)
        //   that.setData({
        //     skuInfo1:goods[i].sku
        //   })
        // }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('页面加载')
    var that = this
    that.getqState();//获取骑手状态

    that.getPosition();
    that.getState(function () {
      // app.onLaunch(app.getPosition())
      app.onLaunch(that.getPosition())
      that.connectSocket()
    })
    that.onSocketMessage();
    
  },
  //获取骑手状态
  getqState: function () {
    console.log('获取骑手状态')
    var that = this;
    wx.request({
      url: 'https://ps.voomv.com/api/peisong/status',
      data: {
        member_id: wx.getStorageSync("member_id"),
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (re) {
        console.log(re)
        if (re.data.code == 200) {
          if (re.data.data == 1) {
            // console.log(1)
            that.setData({
              state:true
            })
            // console.log('state:'+that.data.state)
            that.getPosition();//获取当前位置
            // app.onLaunch(app.getPosition());
            app.onLaunch(that.getPosition());
            that.connectSocket();
          }else if(re.data.data == 0) {
            that.setData({
              state: false,
            })
            console.log('state:'+that.data.state)
            app.stop();
            clearInterval(time);
            that.data.onSocket = false;
            wx.closeSocket();
          }

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('页面渲染')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('页面显示')
    var that =this;
    // that.setData({
    //   state:wx.getStorageSync('state')
    // })

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
    console.log('页面卸载')
    var that=this;
    if (that.data.onSocket){
      clearInterval(time);
      wx.closeSocket();
    }
   
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