var app = getApp();

Page({
  data: {
    bookList: [],
    book:"",
    info:"查找中",
    nvabarData: {
      showCapsule: 1,
      title: '',
    },
    height: app.globalData.height * 2 + 20,
  },

  onLoad: function(option) {
    if (option) {
      wx.showNavigationBarLoading();
      //console.log(option);
      this.setData({
        book: option.name
      });
      this.searchInfo(option);
    
      
      }
  },
  //info
  searchInfo: function (option) {
    wx.request({
      url: app.api + '/api/librarydetail',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + app.store.token
      },
      data: {
        id: option.id
      },
      success: requestRes => {
        var _requestRes = requestRes.data;

        if (!_requestRes.status ) {
          this.setData({
            bookList: _requestRes.data
          });
          wx.hideNavigationBarLoading();

        }else{
          wx.showToast({
            title: '信息获取失败',
            image: '/images/common/fail.png',
            duration: 2000
          });
          this.setData({
            info: "书籍信息找不到啦"
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '未知错误',
          image: '/images/common/fail.png',
          duration: 2000
        });
      },
      complete: () => {
      }
    });
  } 
});
