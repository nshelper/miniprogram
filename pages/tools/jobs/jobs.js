var app = getApp();
import { post, get, upload } from '../../../utils/req.js'
// pages/tools/jobs/jobs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    list: [],
    loading:true,
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
    this.indexList();

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
    this.indexList();
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      num:this.data.num+1
    });
    this.addList();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  indexList() {
    var that = this;
    this.setData({
      num:1,
      loading: true
    });
    get("/api/jobslist?p=1").then((obj) => {
      if (obj.data.length > 0 && typeof obj == "object") {
        that.setData({
          list:obj.data,
          loading:false
        });
      }
    })
  },
  addList() {
    var that = this;
    this.setData({
      loading: true
    });
    get(`/api/jobslist?p=${this.data.num}`).then((obj) => {
      if (obj.data.length > 0 && typeof obj == "object") {
        that.setData({
          list: this.data.list.concat(obj.data),
          loading: false
        });
      }else{
        that.setData({
          loading: false
        });
        wx.showToast({
          icon:'none',
          title: '已无更多数据',
          duration:2000
        });
      }
    })
  },
  viewDetail(e){
    // console.log(e.currentTarget.dataset.info);
    let info = e.currentTarget.dataset.info;
    wx.navigateTo({
      url: `/pages/tools/jobs/article?title=${info.title}&date=${info.date}`,
    });
  }
})