// pages/tools/run/run.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step:'',
    list:false,
    nickName:'',
    avatarUrl:'',
    pullDownFlag: true,
    title:'听说走的越多越健康！',
    steplist:[],
    tempData:[],
    sliceStart:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this.list();
    var that = this;
    if(app.store.bind){
      
      this.setData({
       nickName:app.store.nickName,
       avatarUrl: app.store.avatarUrl
      });
      console.log("load");
      setTimeout(() => { that.login();},100);
      //this.login();
     
    }else{
      wx.showModal({
        title: '提示',
        content: '未绑定无法进行腿长比较',
        cancelText:'我就看看',
        confirmText:'我要绑定',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/more/binding'
            });
            //console.log('用户点击确定');
          } else if (res.cancel) {
            //wx.navigateBack();
            //console.log('用户点击取消');
          }
        }
      });
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
    //console.log('show');
    /*
    wx.showNavigationBarLoading()
    this.list();
    */
   
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
      
      var _pullDownFlag = this.data.pullDownFlag;
      if (_pullDownFlag) {
        wx.showNavigationBarLoading();
        this.data.pullDownFlag = false;
        this.data.sliceStart = 1;
        this.list();
        
      }
    
    wx.stopPullDownRefresh();
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.sliceData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '瞧瞧谁是师大腿最长的人？',
      desc: '谢谢你的分享，让我展现在更多人的视野中',
      path: '/pages/tools/run/run',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  
  },
  //获取运动信息
  getrunData: function () {
    var that = this;
    //console.log(that.data.code);
    //运动信息
    wx.getWeRunData({
      success(res) {
        const encryptedData = res.encryptedData;
        const iv = res.iv;

        that.setData({
          encryptedData: encryptedData,
          iv: iv
        });
        //console.log( iv);
        that.decode();
        //console.log(encryptedData, iv);
      }
    });

  },
  //信息

  decode: function () {
    var that = this;
    wx.request({
      url: app.api + '/api/run',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        js_code: that.data.code,
        encryptedData: that.data.encryptedData,
        iv: that.data.iv,
        nickName: that.data.nickName,
        avatarUrl: that.data.avatarUrl,
      },
      success: requestRes => {
        
        var _requestRes = requestRes.data;
        console.log(_requestRes);
       // let newsteplist = this.data.steplist;
       // newsteplist.unshift(_requestRes);
        //console.log(newsteplist);
        
        that.setData({
          userStep: _requestRes
        });
        
        //that.send();
        
      },
      fail: () => {

      },
      complete: () => {

      }
    });
  },

  // 用户登录
  login: function () {
    var that = this;
    wx.login({
      success: loginRes => {
        if (loginRes.code) {
          // 获取微信用户信息
          //console.log(loginRes.code);
          that.setData({
            code: loginRes.code
          });
          console.log('get code successful');
          that.getrunData();
        }
      }
    });
  },
  send: function () {
    var that = this;
    console.log('start send');
    wx.request({
      url: app.api + '/api/stepinto',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        nickName: that.data.nickName,
        avatarUrl: that.data.avatarUrl,
        step: that.data.step
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        console.log(_requestRes);
        console.log('send step successful');
        
      },
      fail: () => {

      },
      complete: () => {

      }
    });
  },

  list: function () {
    console.info('getting')
    var that = this;
    wx.request({
      url: app.api + '/api/steplist',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        console.log(_requestRes.length);
        that.setData({
          list: true,
          tempData: _requestRes,
          pullDownFlag:true
        });
        this.sliceData();
        wx.hideNavigationBarLoading()

      },
      fail: () => {
        wx.hideNavigationBarLoading()
        that.setData({
          pullDownFlag: true
        });
        wx.showToast({
          title: '获取失败',
          icon: 'fail',
          duration: 2000
        });

      },
      complete: () => {
        this.data.pullDownFlag = true;

      }
    });
  },
  //数据切片处理
  sliceData : function () {
    let sliceStart = this.data.sliceStart
      let tempData = this.data.tempData
      let sliceTemp = Math.ceil(tempData.length / 18)
      if  (sliceStart  <=  sliceTemp) {
        let nowData = tempData.slice(0, 18 * sliceStart)
        sliceStart++
        this.setData({
          steplist: nowData,
          sliceStart: sliceStart
        })
      }else{
        // console.log('木有了!!!!!')
      }
  }
  /*
  ranking:function(datas){
    var that=this;
    var lists = datas.sort(function (a, b) {
                 return a.step < b.step
                });
    that.setData({
      steplist: lists,
      list: true
    });
    datas.forEach((item,index)=>{
      console.log(item);
      console.log(typeof(item.step));
    }); 
  }
 */

//获取运动信息结束
})