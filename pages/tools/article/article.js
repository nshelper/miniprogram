var app = getApp();
var WxParse = require("../../../component/wxParse/wxParse.js");
import { post, get} from '../../../utils/req.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ID:{},
    content:{},
    articleAd:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var store = app.store;
    if (store.adOptions){
      this.setData({
        articleAd: store.adOptions[2].status
      });
    }
    wx.showNavigationBarLoading();
    // console.log(options);
    let id = options.ID;
    this.getArticles(id);
    this.setData({
      id: id
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
    let ID =this.data.ID;
    let path = "/pages/tools/article/article?ID="+ID;
    //console.log(path);
    return {
      title: info.title,
      desc: '谢谢你的分享，让我展现在更多人的视野中',
      path: path,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }

  },
  upLike: function(){
      var that = this;
      if (app.store.nickName) {
        let params = {
          nickName: app.store.nickName,
          ID: this.data.id
        };
        post("/api/articlelike", params).then((obj) => {
          obj.status ? that.setData({
            like: that.data.like + 1
          }) : that.setData({
            like: that.data.like - 1
          });
        });
      } else wx.showToast({
        title: "未绑定无法点赞",
        icon: "none",
        duration: 2e3
      });
  },
  //获取主页swiper信息
  getArticles: function (ID) {
    var that = this;
    let newUrl =app.api+'/api/articlelist?ID='+ID.toString();
    wx.request({
      url: newUrl,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        this.setData({
          content: _requestRes[0],
          ID:ID,
          like: _requestRes[0].like
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

      },
      complete: () => {
        wx.hideNavigationBarLoading();
      }
    });

  },
  // 预览图片
  previewImage: function (e) {
    let url = [e.target.dataset.fimg];
    //console.log(typeof(url));
    wx.previewImage({
      urls:url
    });  
  },
})