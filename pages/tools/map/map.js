// pages/map/map.js
var app = getApp();
import { markers } from'../../../utils/mapSign.js';
// import {info} from '../../utils/positionRecord.js';
import { post, get, upload } from '../../../utils/req.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale:16,
    status:0,
    headType:0,//校区选择位置0为赛罕,1为盛乐
    longitude:"",//经度
    latitude:"",//维度
    items: [["教学楼", "学生公寓", "生活相关"], ["教学楼", "学生公寓", "生活相关"]],//0代表赛罕,1代表盛乐.
    // 教学区
    markers: [],
    info:{},
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
    this.getList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      headType:0,
      status: 0
    });
  
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
  regionchange(e) {
    // console.log(e.type)
  },
  markertap(e) {
    // console.log(e.markerId)
  },
  controltap(e) {
    // console.log(e.controlId)
  },
  getList(){
    var that = this;
    get("/api/point").then((obj) => {
      // console.log(obj);
      that.setData({
        info: obj.data
      });
      that.createMarkers(obj.data.mapSign.saihan[0], 'saihan', 0);
    });
  },
  createMarkers: function (data,type,id) {
    let info = this.data.info;
    let centerPoint=info.centerPoint[type][id];
    let temp=new Array();
    data.map((item,index)=>{
      let info=markers(item.longitude,item.latitude,item.content,type,index);
      temp.push(info);
    });
    this.setData({
      markers:temp,
      longitude:centerPoint.longitude,
      latitude:centerPoint.latitude,
      scale: centerPoint.scale
    });  
  },
  select(e) {
    let info =this.data.info;
    let type = ~~e.target.dataset.type? 'shengle':'saihan';
    // console.log(type);
    let id =e.target.id;
    // console.log(info);
    this.createMarkers(info.mapSign[type][id],type,id);
    this.setData({
      status:id
    });
  },
  pushData(){
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '由于开发者是赛罕的,不太了解盛乐的地标位置,所以盛乐的地标需要校友们一起努力啦!加油我们一定能行!',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/tools/map/mapform',
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
 
  },
  selectArea (e) {
    let info =this.data.info;
    let id = e.target.id;
    if (id==="little"){
      this.setData({
        headType: 0,
        status:0,
      });
      this.createMarkers(info.mapSign.saihan[0],'saihan', 0);
    }else{
      this.setData({
        headType: 1,
        status: 0,
      });
      this.createMarkers(info.mapSign.shengle[0], 'shengle',0);
    }
  }
})