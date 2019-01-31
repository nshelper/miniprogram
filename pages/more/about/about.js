var app = getApp();

Page({
  data: {
    version: '',
    nvabarData: {
      showCapsule: 1,
      title: '',
      color:"#CCFFFF"
    },
    height: app.globalData.height * 2 + 20,
  },
  onLoad: function() {
    this.getVersion();
  },

  // 获取版本
  getVersion: function() {
    this.setData({
      version: app.version
    });
  },

  // 设置剪切板
  setClipboardData: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.content,
      success: () => {
        wx.showToast({
          title: '内容已复制',
          icon: 'success',
          duration: 2000
        });
      }
    });
  }
});
