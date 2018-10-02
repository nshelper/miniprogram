var app = getApp();

Page({
  data: {
    studentId: '',
    jwcPassWord: '',
    studentIdFocus: false,
    jwcPassWordFocus: false,
    jwcPassWordErr: true,
    step: 1,
    help: {
      helpStatus: false,
      faqList: [
        {
          question: '1.公共体育教研部密码是什么?',
          answer: '出生年月加生日共八位'
        },
        {
          question: '2.信息门户密码是什么?',
          answer: '初始密码或者已更改的密码。初始密码为2007'
        },
        {
          question: '3.查询信息比较慢?',
          answer: '服务器的配置不行，多试试就好啦'
        },
        {
          question: '4.哪里可以找到你们?',
          answer: '我们得微信公众号:STRUGGLER 了解一哈'
        }
      ]
    }
  },

  onLoad: function() {
    if (app.store.bind === true) {
      this.setData({
        step: 3
      });
    } else {
      this.setData({
        step: 1
      });
    }
  },

  // 获取焦点
  inputFocus: function(e) {
    if (e.target.id === 'studentId') {
      this.setData({
        studentIdFocus: true
      });
    } else if (e.target.id === 'jwcPassWord') {
      this.setData({
        jwcPassWordFocus: true
      });
      this.setData({
        jwcPassWordErr: true
      });
    }
  },

  // 失去焦点
  inputBlur: function(e) {
    if (e.target.id === 'studentId') {
      this.setData({
        studentIdFocus: false
      });
    } else if (e.target.id === 'jwcPassWord') {
      this.setData({
        jwcPassWordFocus: false
      });
    }
  },

  // 双向绑定
  keyInput: function(e) {
    var id = e.target.id;

    if (id === 'studentId') {
      this.setData({
        studentId: e.detail.value
      });
    } else if (id === 'jwcPassWord') {
      this.setData({
        jwcPassWord: e.detail.value
      });
    }
  },

  // 下一步
  navigateNext: function() {
    var studentId = this.data.studentId;

    if (!studentId || studentId.length < 11) {
      wx.showToast({
        title: '请正确填写学号',
        image: '/images/common/fail.png',
        duration: 2000
      });
    } else {
      this.setData({
        step: 2
      });
    }
  },

  // 取消认证
  navigateCancel: function() {
    wx.navigateBack();
  },

 

  // 上一步
  navigatePre: function() {
    this.setData({
      step: 1
    });
  },

  // 认证并认证
  bind: function() {
    var studentId = this.data.studentId;
    var jwcPassWord = this.data.jwcPassWord;

    // 不能留空
    if (!jwcPassWord) {
      wx.showToast({
        title: '请正确填写密码',
        image: '/images/common/fail.png',
        duration: 2000
      });
    } else {
      // 加载中
      wx.showLoading({
        title: '正在绑定',
        mask: true
      });
      setTimeout(() => {app.login();},2000);

  //发起网络请求
      wx.request({
        url: app.api + '/api/eipinfo',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user: studentId,
          type: "xueji"
        },
        success: responseData => {
          var _response = responseData.data;
          // console.log(_response);
          if (!_response.datas.err){
            wx.hideLoading();
            if (_response.datas.data.xueji){
              var name = _response.datas.data.xueji.XM;
              var tcPasswd = _response.datas.data.xueji.SFZH.slice(6, 14);
              app.setStore("name", name);
              app.setStore("tcPasswd", tcPasswd);
            }
            
            // console.log(name, tcPasswd);
            //原始方法
            app.store.bind = true;
            wx.setStorage({
              key: 'bind',
              data: true
            });
            //函数方法
            app.setStore("user", studentId);
            app.setStore("jwpwd", jwcPassWord);
            app.setStore("auth", _response.datas.auth);
            
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 2000
            });
            this.setData({
              step: 3
            });
            // 重定向
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }, 2000);
          }else{
            wx.hideLoading();
            wx.showToast({
              title: '账号不存在!',
              image: '/images/common/fail.png',
              duration: 2000
            });
            this.setData({
              step: 1
            });
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.getNetworkType({
            success: networkStatus => {
              var networkType = networkStatus.networkType;
              if (
                networkType !== '2g' &&
                networkType !== 'none' &&
                networkType !== 'unknown'
              ) {
                wx.showToast({
                  title: '未知错误',
                  image: '/images/common/fail.png',
                  duration: 2000
                });
              } else {
                wx.showToast({
                  title: '无网络连接',
                  image: '/images/common/fail.png',
                  duration: 2000
                });
              }
            }
          });
        }
      });
    }},

  // 重新认证
  rebind: function() {
    wx.showModal({
      title: '提示',
      content: '确定要重新认证吗?',
      success: operation => {
        if (operation.confirm) {
          // 修改bind
          app.store.bind = false;
          wx.clearStorage();
          this.setData({
            step: 1
          });
        }
      }
    });
  },

  // 帮助
  showHelp: function() {
    this.setData({
      'help.helpStatus': true
    });
  },
  hideHelp: function(e) {
    if (e.target.id === 'help' || e.target.id === 'close-help') {
      this.setData({
        'help.helpStatus': false
      });
    }
  }
});
