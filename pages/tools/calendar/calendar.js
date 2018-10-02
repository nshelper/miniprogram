var app = getApp();

Page({
  data: {
    calendarImage:'http://www.imnu.edu.cn/upload/2017-05/2017xiaoli.jpg',
      // 'http://struggler.qiniudn.com/2017xiaoli.jpg',
    currentWeekly: '校历仅供参考',
  },

  onLoad: function() {
    // this.handlePoster();

  },


  // 预览图片
  previewImage: function() {
    var url = [this.data.calendarImage];

    wx.previewImage({
      urls: url
    });
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: '师大校历',
      desc: '谢谢你的分享，让我展现在更多人的视野中',
      path: '/pages/tools/calendar/calendar',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
});
