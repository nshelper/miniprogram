// pages/map/mapform.js
var app = getApp();
import { post, get, upload } from '../../../utils/req.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    positionName:"戳我获取经纬度",
    radioFirst: [
      { value: 'saihan', name: '赛罕' },
      { value: 'shengle', name: '盛乐', checked: 'true' },
    ],
    radioSecond: [
      { value: '0', name: '教学楼' },
      { value: '1', name: '学生公寓'},
      { value: '2', name: '生活相关', checked: 'true'}
    ],
    campus:"shengle",
    campusType:2,
    longitude:"",
    latitude:"",
    content:"",
    nvabarData: {
      showCapsule: 1,
      title: '',
    },
    height: app.globalData.height * 2 + 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    // console.log(this.data)
  
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
    // console.log('页面卸载了')
  
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
  radioCampus: function (e) {
    this.setData({
      campus: e.detail.value
    })
  },
  radioChange:  function (e) {
    this.setData({
      campusType: e.detail.value
    })
  },
  choosePos(e) {
    wx.chooseLocation({
      success: (res) => {
        // console.log(res);
        this.setData({
          position: res,
          positionName:"经纬度已获取,戳我重新选择"
        })
      }
    });
  },
  backPage(){
    wx.navigateBack();
  },
  submit(){
    var id = this.data.campusType;
    var Type = this.data.campus;
    var con = this.data.content;
    var position = this.data.position;

    if(con&&position){
      var lat = this.data.position.latitude;
      var lon = this.data.position.longitude;
      let temp = {
        'id': id,
        'type': Type,
        'content': con,
        'latitude': lat,
        'longitude': lon
      }
      // console.log(temp)
      post("/api/point",temp).then((obj)=>{
        if (obj.code==200){
          setTimeout(() => { wx.navigateBack();},500);
        }
      });
    }else{
      wx.showToast({
        icon:"none",
        title: '数据不全,请再次确认',
        duration:2000
      })
    }

  },
  setContent(e){
    this.setData({
      content: e.detail.value
    });
  },
  showPos() {
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        console.log(res);
      }
    })
  }
})