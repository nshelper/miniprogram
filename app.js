 //app.js
App({
  // 辅助工具
  // util: require('./utils/util'),
  // 版本号
  version: 'v1.3.91',
  // 缓存数据
  store: {},
  //自定义插件
  globalData: {
    share: false,  // 分享默认为false
    height: 0,
  },


  // API
  
  api: 'http://localhost:8888',


  onShow:function(options){

  },

  onLaunch: function (options) {
    // console.log(options)
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.statusBarHeight
      }
    })
    // 尝试读取storage，并更新store
    try {
      this.checkUpdate()
      var storageInfo = wx.getStorageInfoSync();

      // console.log(storageInfo);

      if (storageInfo && storageInfo.keys.length) {
        if (true) {
          // 遍历本地缓存更新store
          storageInfo.keys.forEach(key => {
            var value = wx.getStorageSync(key);
            if (value !== undefined) {
              //console.log(value);
              this.store[key] = value;
            }
          });
        } else {
          // 清除旧版本代码缓存的数据
          this.store = {};
          wx.clearStorage();
        }
      }
    } catch (e) {
      // console.warn('读取缓存失败');
      wx.showToast({
        title: '未知错误',
        image: '/images/common/fail.png',
        duration: 2000
      });
    };

    // 检查app信息
    wx.getNetworkType({
      success: networkStatus => {
        var networkType = networkStatus.networkType;
        if (
          networkType !== '2g' &&
          networkType !== 'none' &&
          networkType !== 'unknown'
        ) {
          //this.checkBind();
          //this.login();
        } else {
          wx.showToast({
            title: '无网络连接',
            image: '/images/common/fail.png',
            duration: 2000
          });
        }
      }
    });

    // 监听网络连接
    wx.onNetworkStatusChange(networkStatus => {
      if (networkStatus.isConnected && networkStatus.networkType !== '2g') {
        //this.checkBind();
       //this.login();
      } else {
        wx.showToast({
          title: '无网络连接',
          image: '/images/common/fail.png',
          duration: 2000
        });
      }
    });
  },
  // 用户登录
  login: function () {
    wx.login({
      success: loginRes => {
        if (loginRes.code) {
          // 获取微信用户信息
          //console.log(loginRes.code);
          this.getUserInfo(loginRes.code);
        }
      }
    });
  },

  // 获取微信用户信息
  getUserInfo: function (code) {
    wx.getUserInfo({
      withCredentials: true,
      success: res => {
        if (res.encryptedData && res.iv) {

          this.setStore('nickName', res.userInfo.nickName);
          this.setStore('avatarUrl', res.userInfo.avatarUrl);
        } else {
          wx.showToast({
            title: '未知错误',
            image: '/images/common/fail.png',
            duration: 2000
          });
        }
      },
      fail: err => {
        wx.showModal({
          title: '授权失败',
          content: '拒绝授权可能无法完美体验微信小程序',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              // 引导用户授权
              wx.openSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 重新登陆
                    this.login();
                  }
                }
              });
            }
          }
        });
      }
    });
  },

  // 检查绑定信息
  checkBind: function () {
    if (this.store.bind === false || this.store.bind === undefined) {
      wx.redirectTo({
        url: '/pages/more/binding'
      });
    }
  },
  // 更新store和storage
  setStore: function (key, value) {
    if (!key) {
      return;
    }
    this.store[key] = value;
    wx.setStorage({
      key: key,
      data: value
    });
  },
  //小程序版本更新检查
  checkUpdate(){
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '客户端发现更新,是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  }
});
