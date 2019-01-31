var app = getApp();
import { classList ,nowTime} from "../../utils/util";
import { get } from "../../utils/req"

Page({
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 +20,
    opacity:0.00,   
    index_ad:false,
    index_ad_bg:"",
    index_ad_uuid:"",
    index_ad_remark:"",
    countDown:3,
    bind: false,
    randomImg: '',
    indexAd: true,
    userId:'',
    net:{},
    cardbal:'N/A',
    todayClass: [],
    todayWeekend: 0,
    defaultBg: ["https://struggler2018-1251621192.cos.ap-beijing.myqcloud.com/style2.png", "https://struggler2018-1251621192.cos.ap-beijing.myqcloud.com/style1.png"],
    //tool
    headTool: [
        {
        path: 'https://struggler2018-1251621192.cos.ap-beijing.myqcloud.com/run2018.png',
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
      },
      {
        id: 'ljobs',
        name: '招聘',
        url: '/pages/tools/jobs/jobs',
        support: true,
        bind: false
      },
      {
        id: 'lavatar',
        name: '圣诞头像',
        url: '/pages/tools/avatar/avatar',
        support: true,
        bind: false
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
      { select: "gpaProgram", title: "不知道绩点如何计算请点这里" },
      { select: "", title: "本小程序由STRUGGLER提供技术支持" },
      { select: "feedback", title: "点此联系客服反馈问题" },
      { select: "donate", title: "打赏/捐赠开发者" }
      ]
  },

  onLoad: function() {
    this.index_display();
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
  //控制滑动导航栏透明度
  onPageScroll(e){
    let opacity=e.scrollTop/this.data.height;
    if (e.scrollTop>=this.data.height){
      opacity = 1;
    }
    this.setData({
      opacity:opacity
    })
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
      url: app.api + '/api/eip',
      method: 'POST',
      header: {
        //'content-type': 'application/json' // 默认值
        'auth': app.store.auth,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        // user: app.store.user,
        type: 'class_',
        //  date: '2018-12-04'
        date: date
      },
      success: requestRes=>{
        let _requestRes = requestRes.data.data
        if (!requestRes.data.status){
          let classInfo = _requestRes.kb
          let todayClass = classInfo.filter((v) => { return v.rq === date})
          let todayWeekend = 0
          if (todayClass.length > 0){
            // console.log(todayClass)
            todayWeekend=todayClass[0].kcid.split("_")[5]
          }
          that.setData({
            todayClass:todayClass,
            todayWeekend: todayWeekend
          });
        }
      }
    })
  },
  //跳转绑定页面
  navigatetoBind(){
    wx.navigateTo({
      url: '/pages/more/more',
    });
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
    if (data === "feedback" && data!="") {
      wx.navigateTo({
        url: '/pages/more/about/about'
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
      url: app.api + '/api/indexconfig',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: requestRes => {
        var _requestRes = requestRes.data.data;
        let littleTools = this.data.littleTool;
        littleTools.forEach((item,index) => {
          item.support = Boolean(_requestRes[index].status)
        });
        this.setData({
          littleTool: littleTools
        });
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
      url: app.api + '/api/indexswiper',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: requestRes => {
        var _requestRes = requestRes.data.data.reverse().slice(0,4);
        let headTool = this.data.headTool;
        this.setData({
          headTool: _requestRes.concat(headTool)
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
          url: app.api + '/api/eip',
          method: 'POST',
          header: {
            //'content-type': 'application/json' // 默认值
            'content-type': 'application/x-www-form-urlencoded',
            'auth':app.store.auth
          },
          data: {
            // user: app.store.user,
            type: 'card'
          },
          success: requestRes=>{
            var _requestRes = requestRes.data;
            if (!requestRes.data.status) {
              that.setData({
                cardbal: _requestRes.data.CARDBAL+"元"
              });
            }
          }
      })
  },
  // 获取塞尔卡流量
  getNet: function () {
    var that  = this;
    wx.request({
      url: app.api + '/api/eip',
      method: 'POST',
      header: {
        //'content-type': 'application/json' // 默认值
        'auth': app.store.auth,
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        // user: app.store.user,
        type: 'net'
      },
      success: requestRes => {
        var _requestRes = requestRes.data.data;
        // console.log(_requestRes);
        if (!requestRes.data.status && _requestRes.package_name ){
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

      }
    })
  },
  //冷加载开屏广告相关
  index_skip(){
    this.setData({
      index_ad: false
    })
  },
  index_select(adList){
    let [date, today] = nowTime();
    return adList.filter((e)=>{
      return e.dateStart<=date&&e.dateEnd>=date
    })[0]
  },
  index_display(){
    get("/api/adlist").then((obj)=>{
      console.log(obj)
      let one=this.index_select(obj.data)
      if (one){
        this.setData({
          index_ad_bg: one.backgroundUrl,
          index_ad_uuid: one.ID,
          index_ad_remark: one.remark,
          index_ad: true
        });
        let count = setInterval(() => {
          let countDown = this.data.countDown - 1;
          this.setData({
            countDown: countDown
          });
          if (countDown == -1) {
            clearInterval(count)
            this.setData({
              index_ad: false
            })
          }
        }, 1000)
      }
    })
  },
  showDetail(){
    wx.navigateTo({
      url: `/pages/tools/article/article?ID=${this.data.index_ad_uuid}`,
    })
  },
  move() {
    //阻止遮罩穿透
  }
});
