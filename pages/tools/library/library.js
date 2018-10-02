var app = getApp();

Page({
  data: {
    // 借阅图书
    borrowingList: [],
    // 查询关键字
    query: '',
    // 聚焦
    queryFocus: false,
    libPassWordFocus: false,
    modelStatus: true,
    page:1,
    indexPage:1,
    floor:{text:"点击查看下一页",status:true}
  
  },

  onLoad: function() {
   
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  //到底事件
  onReachBottom:function(){
    // console.log('bottom');
    this.nextPage();
  },


  // 输入
  handleInput: function(e) {
    if (e.target.id === 'query') {
      //console.log(e.detail.value);
      this.setData({
        query: e.detail.value
      });
    }
  },

  // 获取焦点
  inputFocus: function(e) {
    if (e.target.id === 'query') {
      this.setData({
        queryFocus: true
      });
    }
  },

  // 失去焦点
  inputBlur: function(e) {
    if (e.target.id === 'query') {
      this.setData({
        queryFocus: false
      });
    }
  },



  // 查询图书
  queryBook: function(e) {
    var indexPage = this.data.indexPage;
    this.indexSearch(indexPage);
  },

  // 获取信息
  searchBook: function(indexPage) {
    // 加载中
    wx.showLoading({
      title: '获取中',
      mask: true
    });
    wx.request({
      url: app.api + '/api/search',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // Authorization: 'Bearer ' + app.store.token
      },
      data:{
        book:this.data.query,
        page:indexPage
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
         //console.log(requestRes);

        if (_requestRes.err === false) {
          console.log(_requestRes);
          if (_requestRes.data.length>0){
            var borrowingList = this.data.borrowingList;
            var results = borrowingList.concat(_requestRes.data);
            console.log(borrowingList);
            this.setData({
              borrowingList: results
            });
            wx.hideLoading();
            wx.showToast({
              title: '获取成功',
              icon: 'success',
              duration: 2000
            });

          }else{
            this.setData({
              floor: { text: "已获取所有数据", status: false }
            })
          }
      
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '不存在图书',
            image: '/images/common/fail.png',
            duration: 2000
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '未知错误',
          image: '/images/common/fail.png',
          duration: 2000
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  //首次获取数据
  indexSearch: function (indexPage) {
    // 加载中
    wx.showLoading({
      title: '获取中',
      mask: true
    });
    wx.request({
      url: app.api + '/api/search',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // Authorization: 'Bearer ' + app.store.token
      },
      data: {
        book: this.data.query,
        page: indexPage
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        //console.log(requestRes);

        if (_requestRes.err === false) {
          console.log(_requestRes);
          if (_requestRes.data.length > 0) {
            this.setData({
              borrowingList: _requestRes.data,
              page: 1,
              floor: { text: "点击查看下一页", status: true }
            });
            wx.hideLoading();
            wx.showToast({
              title: '获取成功',
              icon: 'success',
              duration: 2000
            });
          }else{
            wx.hideLoading();
            this.setData({
              borrowingList: [],
              page: 1
            });
            wx.showToast({
              title: '不存在图书',
              image: '/images/common/fail.png',
              duration: 2000
            });
          }

        } else {
          wx.hideLoading();
          this.setData({
            borrowingList: [],
            page: 1
          });
          wx.showToast({
            title: '不存在图书',
            image: '/images/common/fail.png',
            duration: 2000
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '未知错误',
          image: '/images/common/fail.png',
          duration: 2000
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  //info
  searchInfo: function () {
    wx.request({
      url: app.api + '/api/bookinfo',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + app.store.token
      },
      data: {
        book: this.data.book,
        id:this.data.id
      },
      success: requestRes => {
        var _requestRes = requestRes.data;
        console.log(requestRes);

        if (_requestRes.err === false) {
          // console.log(_requestRes);
          this.setData({
            
          });
          
        } 
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '未知错误',
          image: '/images/common/fail.png',
          duration: 2000
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 模态窗
  showDetail: function(e) {
    //console.log(e.currentTarget.id);
    //console.log(e.currentTarget.dataset.info);
 
    let id=e.currentTarget.id;
    let name=e.currentTarget.dataset.info;

    wx.navigateTo({
      url: 'query?id=' + id+'&name='+name
    });
    //this.searchInfo();

  },
// 查询下一页
  nextPage:function(){
    var page = this.data.page;
    var floor = this.data.floor;
    if(floor.status){
      page++;
      this.setData({
        page: page
      });
      this.searchBook(page);
    }
  }
});
