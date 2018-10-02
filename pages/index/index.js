var app = getApp();
import { classList ,nowTime} from "../../utils/util";

Page({
  data: {
    bind: false,
    randomImg: '',
    indexAd: true,
    userId:'',
    net:{},
    cardbal:'N/A',
    todayClass: [],
    defaultBg: ["http://struggler.qiniudn.com/style2.png", "http://struggler.qiniudn.com/style1.png"],
    //tool
    headTool: [
        {
        path: 'http://struggler.qiniudn.com/run2018.png',
          name: '运动圈',
          url: '/pages/tools/run/run'
      }
    ],
    littleTool: [

      {
        id: 'lscores',
        name: '成绩查询',
        url: '/pages/tools/score/score',
        support:true,
        bind:true
      },
      {
        id: 'lphysical',
        name: '体测查询',
        url: '/pages/tools/physical/physical',
        support: true,
        bind: true
      },
      {
        id: 'llibrary',
        name: '图书馆',
        url: '/pages/tools/library/library',
        support: true,
        bind: false
      },
      {
        id: 'lcalendar',
        name: '校历',
        url: '/pages/tools/calendar/calendar',
        support: true,
        bind: false
      },
      {
        id: 'schedule',
        name: '校车时刻表',
        url: '/pages/tools/schedule/schedule',
        support: true,
        bind: false
      },
      {
        id: 'lgpa',
        name: '绩点',
        url: '/pages/tools/gpa/gpa',
        support: true,
        bind: true
      },
      {
        id: 'lmap',
        name: '地图',
        url: '/pages/tools/map/map',
        support: true,
        bind: true
      }
    ],
    floorTool: [
      {
        id: 'more',
        name: 'MORE',
        url: '/pages/more/more'
      },
      {
        id: 'struggler',
        name: 'STRUGGLER',
        url: '/pages/more/about/about'
      }
    ],
    msgList: [
      { select: "gpaProgram", title: "如果不知道绩点如何计算请点这里" },
      { select: "", title: "欢迎关注公众号:STRUGGLER" },
      { select: "gpaPage", title: "最新功能：GPA自动计算/必修，选修分统计" },
      { select: "donate", title: "打赏/捐赠开发者" }
      ]
  },

  onLoad: function() {
    wx.showNavigationBarLoading();
    this.getConfig();
    this.getHeader();
    // 获取用户基本信息
    this.getUserInfo();
  },

  onShow: function() {
    // 获取用户基本信息
    // this.getUserInfo();
    let randomImg = this.data.defaultBg[Math.floor(2 * Math.random())];
    this.setData({
      randomImg:randomImg
    });

  },
  onShareAppMessage: function () {
    return {
      title: '在师大,有内师助手就够了!',
      path: '/pages/index/index',
      // imageUrl:'/images/tool/info.png',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  getUserInfo: function() {
    var store = {};
    store = app.store;
    //app.checkBind();
    // console.log(store.adOptions[0].status);
    if (JSON.stringify(store) !== '{}' && store.bind && store.adOptions) {

      this.setData({
        bind: store.bind,
        userId: store.user,
        indexAd: store.adOptions[0].status
      });
      this.getCard();
      this.getNet();
      this.getClass();

    } else if (store.bind) {

      this.setData({
        bind: store.bind,
        userId:store.user
      });
      this.getCard();
      this.getNet();
      this.getClass();
    }
  },
  //获取今日课表信息
  getClass: function(){
    let [date,today] = nowTime()
    var that =this
    wx.request({
      url: app.api + '/api/eipinfo',
      method: 'POST',
      header: {
        //'content-type': 'application/json' // 默认值
        // 'auth': app.store.auth,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user: app.store.user,
        type: 'class_',
        date: date
        // date: '2018-09-18'
      },
      success: requestRes=>{
        let _requestRes = requestRes.data.datas
        if (!_requestRes.err){
          let classInfo = _requestRes.data.kb
          let todayClass = classInfo.filter((v) => { return v.rq === date})
          // console.log(todayClass)
          that.setData({
            todayClass:todayClass
          });
        }
      }
    })
  },
  // 跳转一卡通,课表页面
  navigatetoPage: function(e){
    let type = e.currentTarget.id
    if (type ==="class_"){
      wx.navigateTo({
        url: '/pages/tools/class/class'
      })
    }else{
      wx.showToast({
        title: '未完成的功能',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 点击禁用项目
  tapDisabledItem: function(e) {
    let data = e.currentTarget.dataset.support;
    // console.log(data);
    if (data.bind) {
      wx.showModal({
        title: '提示',
        content: '未绑定无法使用此功能！',
        cancelText: '取消',
        confirmText: '绑定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/more/binding'
            });
            //console.log('用户点击确定');
          } else if (res.cancel) {
            //wx.navigateBack();
            //console.log('用户点击取消');
          }
        }
      });
      /*
      wx.showToast({
        title: '未绑定',
        image: '/images/common/fail.png',
        duration: 2000
      });
      */
    } else {
      wx.navigateTo({
        url: data.url
      });

    }

  },
  // 详情
  jump: function (e) {
    var data = e.currentTarget.dataset.select;
    // console.log(data);
    if (data === "gpaPage" && data!="") {
      wx.navigateTo({
        url: '/pages/tools/gpa/gpa'
      });
    } else if (data=== "gpaProgram" && data!="") {
      wx.navigateToMiniProgram({
        appId: 'wxd5179a12e8d21f50',
        path: 'pages/fullpage/fullpage',
        extraData: {
        },
        success(res) {
          // 打开成功
          console.log("跳转成功")
        }
      });
    } else if (data === "donate" && data != ""){
      wx.navigateTo({
        url: '/pages/more/about/donate',
      })
    }else {
      /*
      wx.previewImage({
        urls: [""]
      });
      wx.navigateTo
      wx.redirectTo({
        url: '/pages/index/index'
      });
*/
    }
  },

  setStore: function(key, value) {
    if (!key) {
      return;
    }
    app.store[key] = value;
    wx.setStorage({
      key: key,
      data: value
    });
  },
  //功能关闭提示！
  getSupport:function(e){
    //console.log(e);
    let data=e.currentTarget.dataset.support;
    if (!data.support){
    wx.showToast({
      title: '管理员已关闭这个功能!',
      icon: "none",
      duration: 2000
    });
    }else{
      wx.navigateTo({
        url: data.url
      });

    }
  },
  //获取主页面功能配置
  getConfig : function(){
    wx.request({
      url: app.api + '/api/toolconfig',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        let littleTools = this.data.littleTool;
        littleTools.forEach((item,index) => {
          item.support = Boolean(_requestRes[index].status)

        });
        this.setData({
          littleTool: littleTools
        });
        // console.log(this.data.littleTool);
        //console.log(_requestRes);

        wx.hideNavigationBarLoading();

      },
      fail: () => {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '获取失败',
          icon: 'fail',
          duration: 2000
        });

      },
      complete: () => {
        wx.hideNavigationBarLoading();
      }
    });

  },
  //获取主页swiper信息
  getHeader: function () {
    wx.request({
      url: app.api + '/api/headerconfig',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        let headTool = this.data.headTool;
        this.setData({
          headTool: headTool.concat(_requestRes)
        });
        // console.log(_requestRes);

        wx.hideNavigationBarLoading();

      },
      fail: () => {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '获取失败',
          icon: 'fail',
          duration: 2000
        });

      },
      complete: () => {
        wx.hideNavigationBarLoading();
      }
    });

  },
  // 获取一卡通余额
  getCard:function(){

    this.setData({
      cardbal: ""
    });
    var that =this;
        wx.request({
          url: app.api + '/api/eipinfo',
          method: 'POST',
          header: {
            //'content-type': 'application/json' // 默认值
            'content-type': 'application/x-www-form-urlencoded'
            // 'auth':app.store.auth
          },
          data: {
            user: app.store.user,
            type: 'card'
          },
          success: requestRes=>{
            // console.log(requestRes.data);
            var _requestRes = requestRes.data.datas;
            if (!_requestRes.err) {
              that.setData({
                cardbal: _requestRes.data.CARDBAL+"元"
              });
            }

          },
          fail:()=>{

          },
          complete:()=>{

          }
      })
  },
  // 获取塞尔卡流量
  getNet: function () {
    var that  = this;
    wx.request({
      url: app.api + '/api/eipinfo',
      method: 'POST',
      header: {
        //'content-type': 'application/json' // 默认值
        // 'auth': app.store.auth,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user: app.store.user,
        type: 'net'

      },
      success: requestRes => {
        var _requestRes = requestRes.data.datas.data;
        // console.log(_requestRes);
        if (!_requestRes.err && _requestRes.package_name ){
          let bytes = 0 ;
          let bytes_array = _requestRes.package;
          bytes_array.forEach((item,index)=>{
            bytes += item.bytes/1024/1024/1024;
          });
          let remain_bytes = _requestRes.package_remain_bytes / 1024 / 1024/1024;

    let remain_bytes_info = { package_name: _requestRes.package_name, remain_bytes: remain_bytes.toFixed(4) + "G" , bytes: bytes.toFixed(2)+"G"};
          that.setData({
            net: remain_bytes_info
          });
        }

      },
      fail: () => {

      },
      complete: () => {

      }
    })
  }
});
