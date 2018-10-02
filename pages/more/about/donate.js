var app = getApp();

Page({
  data: {
    mode: 'wechatpay',
    donorList: []
  },

  onLoad: function() {
   
  },

 

  // 切换方式
  switchMode: function(e) {
    if (e.target.id) {
      this.setData({
        mode: e.target.id
      });
    }
  },

  // 预览图片
  previewImage: function() {
    var qrUrl = {
      wechatpay: [      'http://wx3.sinaimg.cn/mw690/a27af0cbly1frgrwzlwz5j20u00u0dh2.jpg'
      ],
      alipay: [
        'https://strugglerx.github.io/images/alipay.jpg'
      ]
    };

    wx.previewImage({
      urls: qrUrl[this.data.mode]
    });
  }
});
