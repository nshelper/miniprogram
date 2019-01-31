var app = getApp();

Page({
  data: {
    scoreList: [],
    detailStatus: false,
    scoreDetail: {},
    session:'',
    imgcode:'',
    vrcode:'',
    index:0,
    reqStatus:false,
    selectTerm:[],
    scoreAd:true,
    title: "获取成绩中",
    nvabarData: {
      showCapsule: 1,
      title: '',
    },
    height: app.globalData.height * 2 + 20,
  },

  onLoad: function() {
    if (app.store.scoreList && app.store.adOptions){
      this.setData({
      scoreList:app.store.scoreList,
      selectTerm: app.store.selectTerm,
      scoreAd: app.store.adOptions[1].status
      });
    } else if (app.store.scoreList){
      this.setData({
        scoreList: app.store.scoreList,
        selectTerm: app.store.selectTerm
      });
    }else{
      this.getScore();
    }
    //console.log(this.data.scoreList[0]);

    //this.getScore();
  },


  onPullDownRefresh: function() {
    if (!this.data.reqStatus){
      this.getScore();
    }else{
      wx.showToast({
        title: '正在获取数据中，等待一下吧！',
        icon: "none",
        duration: 2000
      });
    }
    wx.stopPullDownRefresh();
  },
  // 获取成绩
  getScore: function() {
    // 加载中
    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '正在获取中'
    });
    this.setData({
      reqStatus:true
    });

    //发起网络请求
    wx.request({
      url: app.api + '/api/eip',
      method: 'POST',
      header: {
        //'content-type': 'application/json' // 默认值
        'auth': app.store.auth,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        // user: app.store.user,
        type:'score'
        //pwd: app.store.jwpwd,
        //session:this.data.session,
        //vrcode:this.data.vrcode
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        // console.log(_requestRes);
        wx.hideLoading();
        if (!_requestRes.status) {
          // 更新视图
          var _requestDatas = _requestRes.data.reverse();
          var selectTerm= [];
          _requestDatas.forEach((each)=>{
            selectTerm.push(each.term);
          })
          this.setData({
            selectTerm: selectTerm,
            scoreList: _requestDatas,
            reqStatus: false
          });
          app.setStore('scoreList', _requestDatas);
          app.setStore('selectTerm', selectTerm);
          wx.hideNavigationBarLoading();
          wx.setNavigationBarTitle({
            title: '成绩查询'
          });
        } else {
          wx.hideNavigationBarLoading();
          wx.setNavigationBarTitle({
            title: '成绩查询'
          });
          this.setData({
            reqStatus: false
          });
          wx.showToast({
            title: '获取数据失败',
            image: '/images/common/fail.png',
            duration: 2000
          });
        }
      },
      fail: () => {
        wx.hideNavigationBarLoading();
        this.setData({
          reqStatus: false
        });
        wx.showToast({
          title: '未知错误',
          image: '/images/common/fail.png',
          duration: 2000
        });
        wx.setNavigationBarTitle({
          title: '成绩查询'
        });
      }
    });
    // this.hideCode();
    
  },

  // 详情
  showDetail: function(e) {
    var data = e.currentTarget.dataset.score;
    // 更新视图
    this.setData({
      detailStatus: true,
      scoreDetail: data
    });
  },

  hideDetail: function(e) {
    if (e.target.id === 'score-detail' || e.target.id === 'close-detail') {
      this.setData({
        detailStatus: false
      });
    }
  },

  getVrcode: function (e) {
    var id = e.target.id;
     //console.log(id);
    if (id === 'vrcode') {
      //console.log(e.detail.value);
      this.setData({
        vrcode: e.detail.value
      });
    }
  },

//获取验证码封装
  codeGet: function () {
    var that = this;
    wx.request({
      url: app.api + "/api/getVcode",
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      }, // 设置请求的 header
      success: function (res) {
        console.log(res);

        let session = res.data.session;
        let imgcode = res.data.imgbuf;
        that.setData({
          imgcode: imgcode,
          session: session
        });

      }
    });
  },
  //按钮
  getCode: function () {
    if(!this.data.reqStatus){
    this.setData({
      'help.helpStatus': true
    });
    this.getScore();
   //this.codeGet();
    }else{
      wx.showToast({
        title: '正在获取数据中，等待一下吧！',
        icon: "none",
        duration: 2000
      });
    }
  },
  // 跳转Gpa页面
  getGpa:function(){
    wx.navigateTo({
      url: '/pages/tools/gpa/gpa',
    })

  },
 hideCode: function () {
   
      this.setData({
        'help.helpStatus': false
      });
    
  },
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
  },
  move() {
    //阻止遮罩穿透
  }
});
