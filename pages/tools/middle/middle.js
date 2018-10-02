// pages/tools/run/run.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options.select);
   if (options.select === "gpaPage"&&options.select){
     wx.redirectTo({
       url: '/pages/tools/gpa/gpa'
     });
   } else if (options.select === "gpaProgram"&& options.select){
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

   }else{
     wx.redirectTo({
       url: '/pages/index/index'
     });

   }
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
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }

})