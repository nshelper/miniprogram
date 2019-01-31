var app = getApp();
// pages/more/ad.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:[
      { name: "首页", status:true },
      { name: "成绩", status: true },
      { name: "文章", status: true },
    ],
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
    let adOptions=app.store.adOptions;
    if (adOptions){
      this.setData({
        options: adOptions
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
  switchChange:function(e){
    let adOptions=this.data.options;
    let adStatus = e.detail.value;
    let adIndex = e.currentTarget.dataset.index;
    adOptions.forEach((item,index)=>{
      if(index===adIndex){
        item.status=adStatus;
      }
    });
    app.setStore('adOptions',adOptions);
    // console.log(adOptions);

  }
})