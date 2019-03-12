// pages/login/register.js
var time
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes:[
      {id:1,class:[
        { title: "注册手机号", type: "number", maxlength: 11, id: 1, name: "tel", password: false },
        { title: "图形验证码", type: "text", maxlength: 4, id: 2, name: "imgVerification", password: false },
        { title: "短信验证码", type: "number", maxlength: 6, id: 3, name: "verification", password: false }
      ]},
      {id:2,class:[
        { title: "设置密码", type: "text", maxlength: 16, id: 1, name: "password", password: true },
        { title: "确认密码", type: "text", maxlength: 16, id: 2, name: "passWord", password: true }
      ]},
      {id:3,class:[
        { title: "姓名", type: "text", maxlength: 4, id: 1, name: "name", password: false },
        { title: "身份证号", type: "idcard", maxlength: 18, id: 2, name: "id", password: false },
        { title: "居住地址",name:"add"},
      ]}
    ],
    img:"",
    tel:"",
    imgVerification:"",
    verification:"",
    password:"",
    passWord:"",
    verificationTime:0,
    add:"",
    id:"",
    idImg1:"",
    idImg2:"",
    name:"",
    openid:""
  },
  //获取表单数据
  getInput(e){
    var name = e.currentTarget.dataset.name
    switch (name){
      case "tel":
        this.setData({ tel: e.detail.value});
        break;
      case "imgVerification":
        this.setData({ imgVerification: e.detail.value });
        break;
      case "verification":
        this.setData({ verification: e.detail.value });
        break;
      case "password":
        this.setData({ password: e.detail.value });
        break;
      case "passWord":
        this.setData({ passWord: e.detail.value });
        break;
      case "name":
        this.setData({ name: e.detail.value });
        break;
      case "id":
        this.setData({ id: e.detail.value });
        break;
    }
  },
  // 获取地址
  getAdd(){
    var that =this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({ add: res.address})
      },
    })
  },
  //获取身份证照片
  getIdImg(e){
    console.log(e)
    var that=this;
    var id = Number(e.currentTarget.dataset.id);
    //图片上传
      wx.chooseImage({
        success(res) {
          console.log(res)
          const tempFilePaths = res.tempFilePaths;
          wx.uploadFile({
            url: 'https://ps.voomv.com/api/Upload/upload', 
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success(res) {
              console.log(res)
              const data = JSON.parse(res.data);
              console.log(data.url)
              if(id==1){
                that.setData({
                  idImg1: data.url
                })
              }else{
                that.setData({
                  idImg2: data.url
                })
              }
              
            }
          })
        }
      })

    

    // btt.fileUpload("",function(res){
    //   console.log(res)
    //   switch(id){
    //     case 1:
    //       that.setData({ idImg1: res.img })
    //       break;
    //     case 2:
    //       that.setData({ idImg2: res.img })
    //     break;
    //   }
    // },true)

  },
  back(){
    wx.navigateBack({})
  },
  //注册提交
  submit(e){
    var tel = this.data.tel//注册电话
    var verification = this.data.verification//短信验证码
    var password = this.data.password//设置密码
    var passWord = this.data.passWord//确认密码
    var name = this.data.name//姓名
    var id = this.data.id//身份证号
    var idImg1 = this.data.idImg1//正面
    var idImg2 = this.data.idImg2//反面
    var add = this.data.add//地址
    //判断手机号
    if(!tel){
      wx.showToast({
        title: '请填写手机号',
        icon:'none'
      })
      return
    } else if (!(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(tel))){
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return
    }
    //判断短信验证码
    if (!verification) {
      wx.showToast({
        title: '请填写短信验证码',
        icon: 'none'
      })
      return
    }
    // 判断密码
    if (!password) {
      wx.showToast({
        title: '请设置密码',
        icon: 'none'
      })
      return
    } else if (password.length < 8) {
      wx.showToast({
        title: '密码最少8位',
        icon: 'none'
      })
      return
    }
    // 判断确认密码
    if (!(passWord === password)) {
      wx.showToast({
        title: '密码不一致，请重新输入',
        icon: 'none'
      })
      return
    }
    if (!name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return
    }
    // 判断身份证号
    if (!id) {
      wx.showToast({
        title: '请填写身份证号',
        icon: 'none'
      })
      return
    } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id))){
      wx.showToast({
        title: '身份证号不正确',
        icon: 'none'
      })
      return
    }
    // 判断身份证照是否存在
    if (!idImg1) {
      wx.showToast({
        title: '未上传身份证照正面',
        icon: 'none'
      })
      return
    }
    if (!idImg2){
      wx.showToast({
        title: '未上传身份证照背面',
        icon: 'none'
      })
      return
    }
    var data = { 
      mobile: tel,
      code: verification,
      password: password,
      confirm_password: passWord,
      name:name,
      card:id,
      card_positive: idImg1,
      card_back: idImg2,
      place:add
    }
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/registered',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res)
        if(res.data.code ==200){
          wx.showToast({
            title: '提交成功',
          })
          console.log(1)
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)
        }else if(res.data.code==400){
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
       
        
      }
    })
   
  },
  //获取短信验证码
  getVerification(){
    var that =this;
    var tel = that.data.tel
    var imgVerification = that.data.imgVerification
    if (!tel&&tel.length==11){
      wx.showToast({
        title: '请填写正确手机号',
      })
      return;
    }
    if (!imgVerification && imgVerification.length==4){
      wx.showToast({
        title: '请填写正确的图形验证码',
      })
      return;
    }
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/sendSms',
      data:{
        openid: wx.getStorageSync('_openid'),
        mobile:tel,
        verify:imgVerification
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        console.log(res)
        if(res.data.code==200){
          var verificationTime = 60
          time = setInterval(function () {
            verificationTime--;
            that.setData({ 
              verificationTime: verificationTime 
            })
            if (verificationTime <= 0) {
              clearInterval(time)
            }
          }, 1000);
        }else if(res.data.code==400){
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      openid:wx.getStorageSync('_openid')
    })
  //  btt.init()
    that.getImg()
  },
  //获取图片验证码
  getImg(){
    var that =this;
    wx.request({
      url: 'https://ps.voomv.com/api/peisong_login/code',
      data: {
        openid:that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({ 
          img: res.data.data.image 
        })
        if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }

      }
    })

    // btt.Post('/plugapi/peisong.passport/code', {}, function (res) {
    //   btt.that.setData({ img: res.data.image })
    // }, true)
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
    clearInterval(time)
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