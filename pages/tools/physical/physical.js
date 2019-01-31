var app = getApp();

Page({
  data: {
    sportStatus:true,
    scoreList: [],
    pullDownFlag: true,
    reqFlag:false,
    passwdExist: true,
    sportPass: "",
    nvabarData: {
      showCapsule: 1,
      title: '',
    },
    height: app.globalData.height * 2 + 20,
  },

  onLoad: function() {
    if (!app.store.physicalList){
      this.startReq();
    }else{
      this.setData({
        scoreList:app.store.physicalList
      });
    }
    
  },

  onPullDownRefresh: function() {
    var _pullDownFlag = this.data.pullDownFlag;

    if (_pullDownFlag) {
      this.data.pullDownFlag = false;
      this.startReq();
      wx.stopPullDownRefresh();
    }
  },
  sports: function(e){
    let id = e.currentTarget.id;
    if (id === "TC") {
      this.setData({
        sportStatus: false
      });
    } else if (id === "SP") {
      this.setData({
        sportStatus: true
      });
    }
  },
  getPasswd: function (e){
    let tcPasswd = e.detail.value;
    this.setData({
      sportPass: tcPasswd
    });
  },
  startReq: function(){
    if  (app.store.tcPasswd){
      this.setData({
        sportPass: app.store.tcPasswd
      });
      this.getScore();
    }else{
      this.setData({
        passwdExist:false
      });
    }
  },
  getScore: function() {
    // 加载中
    let sportPass = this.data.sportPass;
   this.setData({
     reqFlag:true
   })
    wx.showNavigationBarLoading();

    wx.request({
      url: app.api + '/api/sports',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        user: app.store.user,
        pwd: sportPass   
      },
      success: requestRes => {
        var _requestRes = requestRes.data.data;
        if (!requestRes.data.status) {
          this.setData({
            scoreList: _requestRes,
            reqFlag:false,
            passwdExist: true
          });
          wx.showToast({
            title: '获取成功',
            icon: 'success',
            duration: 2000
          });
          app.setStore("name", _requestRes.name);
          app.setStore("tcPasswd", sportPass);
          app.setStore('physicalList', _requestRes);
        } else {
          wx.showToast({
            title: '获取失败',
            image: '/images/common/fail.png',
            duration: 2000
          });
          this.setData({
            reqFlag: false,
            scoreList: null,
            passwdExist:false
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '获取失败',
          image: '/images/common/fail.png',
          duration: 2000
        });
      },
      complete: () => {
        wx.hideNavigationBarLoading();
        this.data.pullDownFlag = true;
      }
    });
  },
  hideInput: function  (){
    wx.navigateBack({
      delta:1 
    });
  }
});
