var app = getApp();
var WxParse = require("../../../component/wxParse/wxParse.js");
import { post, get} from '../../../utils/req.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{},
    options:{},
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
    // console.log(options);
    wx.showNavigationBarLoading();
    this.getArticles(options);
    this.setData({
      options: options
    });
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
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    let info = this.data.content;
    let options =this.data.options;
    let path = `/pages/tools/jobs/article?title=${options.title}&date=${options.date}`;
    //console.log(path);
    return {
      title: info.title,
      path: path,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  //获取主页swiper信息
  getArticles: function (options) {
    var that = this;
    let newUrl = app.api +`/api/jobsdetail?title=${options.title}&date=${options.date}`;
    wx.request({
      url: newUrl,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        _requestRes.data.content = _requestRes.data.content.replace(/upload\//ig,"http://jy.imnu.edu.cn/upload/");
        this.setData({
          content: _requestRes.data
        });
        //这里是wxparse测试
        WxParse.wxParse('article', 'html', that.data.content.content, that, 18);
        // console.log(this.data.article);
       // console.log(_requestRes[0]);
        wx.hideNavigationBarLoading();
      },
      fail: () => {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '获取失败',
          icon: 'fail',
          duration: 2000
        });
      }
    });
  }
})