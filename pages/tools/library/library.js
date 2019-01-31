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
    floor:{text:"点击查看下一页",status:true},
    loading:false,
    title:"loading",
    nvabarData: {
      showCapsule: 1,
      title: '',
    },
    height: app.globalData.height * 2 + 20,
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
    // 已添加自定义
    // wx.showLoading({
    //   title: '获取中',
    //   mask: true
    // });
    this.setData({
      loading:true
    });
    wx.request({
      url: app.api + '/api/library',
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
        if (!_requestRes.status && _requestRes.data ) {
          if (_requestRes.data.length > 0 ){
            var borrowingList = this.data.borrowingList;
            var results = borrowingList.concat(_requestRes.data);
            console.log(borrowingList);
            this.setData({
              borrowingList: results,
              loading: false
            });
          }else{
            this.setData({
              floor: { text: "已获取所有数据", status: false },
              loading: false
            })
          }
      
        } else {
          this.setData({
            floor: { text: "已获取所有数据", status: false },
            loading: false
          })
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
  },
  //首次获取数据
  indexSearch: function (indexPage) {
    // 加载中
    // wx.showLoading({
    //   title: '获取中',
    //   mask: true
    // });
    this.setData({
      loading: true
    });
    wx.request({
      url: app.api + '/api/library',
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

        if (!_requestRes.status && _requestRes.data) {
          if (_requestRes.data.length > 0 ) {
            this.setData({
              borrowingList: _requestRes.data,
              page: 1,
              loading: false,
              floor: { text: "点击查看下一页", status: true }
            });
            // wx.showToast({
            //   title: '获取成功',
            //   icon: 'success',
            //   duration: 2000
            // });
          }else{
            this.setData({
              borrowingList: [],
              page: 1,
              loading: false
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
            page: 1,
            loading:false
          });
          wx.showToast({
            title: '不存在图书',
            image: '/images/common/fail.png',
            duration: 2000
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '未知错误',
          image: '/images/common/fail.png',
          duration: 2000
        });
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
