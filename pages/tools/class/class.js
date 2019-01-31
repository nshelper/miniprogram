const app = getApp();
// pages/tools/class/class.js
import { classList ,nowTime} from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bind:false,
    days:['周一','周二','周三','周四','周五','周六','周日'],
    nodes:[1,2,3,4,5,6,7,8,9,10],
    today:0,
    allClass:[ ],
    headerLeft:0,
    showStatus:false,
    detailItems:[],
    headerStatus: true,
    nvabarData: {
      showCapsule: 1,
      title: '',
      color:"#99CCFF"
    },
    height: app.globalData.height * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()

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

  },
  // 获取初始数据
  init: function(){
    let bind = app.store.bind
    let [date,today] = nowTime()
    wx.setNavigationBarTitle({
      title: `日期:${date}`,
    })
    this.setData({
      date:date,
      today:today,
      bind :bind
    })
    if ( !this.data.bind){
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
            wx.navigateBack();
            //console.log('用户点击取消');
          }
        }
      });

    }else{
      this.getClass()
    }
    
  },
  touchTitle: function(){
    this.setData({
      headerStatus: false
    });

  },
  touchEnd: function(){
    this.setData({
      headerStatus: true
    });

  },
  bindDateChange: function(e){
    let date = e.detail.value
    this.setData({
      date:date
    })
    wx.setNavigationBarTitle({
      title: `选择:${date}`,
    })
    this.getClass()
  },
  showDetail: function(e){
    let detailItems = e.currentTarget.dataset.item
    if (detailItems.length>0) {
      this.setData({
        showStatus:true,
        detailItems:detailItems
      })
    }

  },
  hiddenDetail: function(e){
    if (e.target.id === 'bg'){
      this.setData({
        showStatus:false,
        detailItems:[]
      })
    }
  },
  getClass: function(){
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
        date: that.data.date
      },
      success: requestRes=>{
        let _requestRes = requestRes.data
        if (!_requestRes.status){
          let classInfo = _requestRes.data.kb
          // console.log(classInfo)
          let allClass=classList(classInfo)
          this.setData({
            allClass:allClass
          });

        }

      },
      fail:()=>{

      },
      complete:()=>{

      }
    })
  },
  headerPosition: function(e){
    console.log(e.detail)
    let scrollLeft = e.detail.scrollLeft
    let deltaX = e.detail.deltaX
    console.log(scrollLeft)
    if (deltaX < -2 || deltaX>2){
      let temp = scrollLeft > 60 ? 200 : 0;
      this.setData({
        headerLeft: temp
      })
    }
 
  }
})
