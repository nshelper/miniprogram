var app = getApp();

Page({
  data: {
    nvabarData: {
      showCapsule: 1,
      title: '',
    },
    height: app.globalData.height * 2 + 20,
    userInfo: {
      href: '/pages/more/user/user',
      avatar: '/images/more/avatar.png',
      nickName: 'STRUGGLER',
      bind: false
    }
  },
  onLoad: function() {
    // 获取用户基本信息
    this.getUserInfo();
  },
  getUserInfo: function() {
    var store = app.store;

    if (JSON.stringify(store) !== '{}') {
      var userInfo = {
        href: '/pages/more/user/user',
        avatar: store.avatarUrl,
        nickName: store.nickName,
        bind: store.bind
      };

      // 更新数据
      this.setData({
        userInfo: userInfo
      });
    }
  }
});
