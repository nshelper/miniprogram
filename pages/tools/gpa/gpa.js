//动画效果插件
import NumberAnimate from "../../../utils/NumberAnimate";
//获取全局变量
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scoreAll:[],
    requiredCredits:0,
    electiveCredits:0,
    allCredits: 0,
    requiredInfo: [], 
    selectiveInfo:[],
    accountTotal: 0.00,
    accountNum: 0,
    course:"",
    credit:0,
    score:0,
    percent: 0,
    head_img: "",
    imgStatus:false,
    electiveStatus:false,
    lastContent:"",
    lastContents: ["活捉神人一枚，请问可以抱大腿么", "两个字，优秀", "革命尚未成功，同志仍需努力", "大学么，大概学学就成"],
    bgList: ["/images/more/bg1.png","/images/more/bg.png"],
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
    wx.showNavigationBarLoading()
    if (app.store.bind && app.store.scoreList) {
      let avatarUrl = app.store.avatarUrl;
      if (app.store.name){
        var nickName = app.store.name;
      }else{
        var nickName = app.store.nickName;
      }
     
      this.getImageInfo(avatarUrl);
      // console.log(avatarUrl,nickName);
      this.setData({
        avatarUrl: avatarUrl,
        nickName: nickName,
        scoreAll: app.store.scoreList
      });
      // console.log("load");
      wx.hideNavigationBarLoading();
      this.scoreInfo();

    } else {
      wx.showModal({
        title: '正确姿势',
        content: '首先绑定-获取成绩-查看绩点',
        cancelText: '获取成绩',
        confirmText: '我要绑定',
        success: function (res) {
          if (res.confirm) {
            wx.hideNavigationBarLoading();
            wx.redirectTo({
              url: '/pages/more/binding'
            });
            console.log('用户点击确定');
          } else if (res.cancel) {
            //wx.navigateBack();
            wx.hideNavigationBarLoading();
            console.log('用户点击取消');
            wx.redirectTo({
              url: '/pages/tools/score/score',
            })
          }
        }
      })
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
    wx.stopPullDownRefresh();
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
    return {
      title: '师大gpa计算就是这么简单？',
      desc: '谢谢你的分享，让我展现在更多人的视野中',
      path: '/pages/tools/gpa/gpa',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  //显示增加选修成绩
  appendItem:function(){
    // console.log(this.data.electiveInfo);
    this.setData({
      electiveStatus:true
    });
  },
  hideAppendItem: function (e) {
    var that=this;
    if (e.target.id == "hideAppendItem") {
      setTimeout(()=>{
        that.setData({
          electiveStatus: false
        });
      },300);
    
    }
  },
  //增加选修成绩按钮
  caculateItem: function (e) {
    var that = this
    let item = e.currentTarget.dataset.item;
    var index = e.target.dataset.indexKey;
    var electiveInfo = this.data.electiveInfo;
    electiveInfo.splice(index, 1);
    var course = item.course;
    var credit = item.credit;
    var score = item.score;
    var required = that.data.requiredInfo;
    required.unshift({ course: course, credit: credit, score: score });
    that.caculateTotal(required);
    this.setData({
      electiveInfo: electiveInfo,
      requiredCredits: that.data.requiredCredits+credit,
      electiveCredits: that.data.electiveCredits - credit,
      requiredInfo: required
    });
    // console.log(course, credit, score);
  },
  scoreInfo:function(){
    var requiredInfo=new Array();
    var electiveInfo=new Array();
    var scoreAll=this.data.scoreAll;
    var requiredCredits=0;
    var electiveCredits=0;
    scoreAll.forEach((item,index)=>{
      //console.log(item,index);
      var eachScores=item.values;
      eachScores.forEach((each)=>{
        if (!each.attributes && each.score >= 60||each.attributes==='必修'&&each.score>=60){
          // console.log(each);
          requiredInfo.push(each);
          requiredCredits += parseFloat(each.credit);
        } else if(each.score >= 60) {
          electiveInfo.push(each);
          electiveCredits += parseFloat(each.credit);
        }else{
        };
        
      });
    });
    this.caculateTotal(requiredInfo);
    this.setData({
      requiredInfo: requiredInfo,
      electiveInfo: electiveInfo,
      electiveCredits: electiveCredits,
      requiredCredits: requiredCredits,
      allCredits: electiveCredits + requiredCredits
    })
    // console.log(this.data.allCredits, this.data.nickName);

  },
  //删除行
  deleteRow: function (e) {
    var index = e.target.dataset.indexKey;
    let item = e.currentTarget.dataset.item;
    var course = item.course;
    var credit = item.credit;
    var score = item.score;
    var electiveInfo = this.data.electiveInfo;
    electiveInfo.unshift({ course: course, credit: credit, score: score });
    //console.log(index);
    var required=this.data.requiredInfo;
    required.splice(index,1);
    this.caculateTotal(required);
    this.setData({
      requiredCredits: this.data.requiredCredits - credit,
      electiveCredits: this.data.electiveCredits + credit,
      requiredInfo: required,
      electiveInfo: electiveInfo
    });
    
  },
  // 计算总额
  caculateTotal: function (data) {
    var tempaa = 0;
    var tempbb = 0;
    var tempNum = 0;
    var i = 0;
    var a = 0;
    var tempTotal = 1;
    for (var x in data) {
      if (parseFloat(data[x].score) >= 60) {
        a = 1;
        if (parseFloat(data[x].score) >= 65) {
          a = 1.5;
          if (parseFloat(data[x].score) >= 70) {
            a = 2;
            if (parseFloat(data[x].score) >= 75) {
              a = 2.5;
              if (parseFloat(data[x].score) >= 80) {
                a = 3;
                if (parseFloat(data[x].score) >= 85) {
                  a = 3.5;
                  if (parseFloat(data[x].score) >= 90) {
                    a = 4;
                    if (parseFloat(data[x].score) >= 95) {
                      a = 4.5;
                    }
                  }
                }
              }
            }
          }
        }
      }
      else { a = 0; }
      i += a * parseFloat(data[x].credit);
      tempaa += parseFloat(data[x].credit) * parseFloat(data[x].score);
      //tempTotal *= parseFloat(data[x].amount);
      tempbb += parseFloat(data[x].credit);
      tempNum += 1;
    }
    tempNum = tempaa / tempbb;
    tempNum = parseFloat(tempNum).toFixed(3);
    tempTotal = i / tempbb;
    tempTotal = parseFloat(tempTotal).toFixed(3);
    //动画
    let n1 = new NumberAnimate({
      from: tempTotal,
      speed: 500,
      refreshTime: 88,
      decimals: 3,
      onUpdate: () => {
        this.setData({
          accountTotal: n1.tempValue
        });
      },
      onComplete: () => {
        //完成了
      }
    });
    this.rankUser(tempTotal);
    // console.log('GPA:',tempTotal);
  },
  //  图片缓存本地的方法
  getImageInfo: function (url) {   
    var that = this;
    if (typeof url === 'string') {
      wx.getImageInfo({   //  小程序获取图片信息API
        src: url,
        success: function (res) {
          // console.log(res);
          that.setData({
            head_img: res.path
          });
          // console.log(that.data.head_img);
          // that.startCanvas();

        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },
  //给用户评级
  rankUser:function(gpa){
    var that = this;
    let lastContents = this.data.lastContents;
    switch(parseInt(gpa)){
      case 4:
        // console.log('4');
        that.setData({
          percent:95,
          lastContent: lastContents[0]
        });
        break;
      case 3:
        // console.log('3');
        that.setData({
          percent: 80,
          lastContent: lastContents[1]
        });
        break;
      case 2 :
        // console.log('2');
        that.setData({
          percent: 30,
          lastContent: lastContents[2]
        });
        break;
      default:
        that.setData({
          percent: 0,
          lastContent: lastContents[3]
        });
    }
    // console.info(this.data.lastContent);
  },
  //开始画两张图
  createImgs:function(){
    let that =this;
    let bgList = this.data.bgList;
    let i = Math.floor(Math.random()*bgList.length);
    var image = new Promise((resolve, reject) => {
      that.startCanvas(bgList[i],resolve);
    });
    image.then((data)=>{
      if(data.status){
        if(data.status){
          wx.hideLoading();
          // wx.showToast({
          //   title: '生成图片成功',
          //   duration: 1000
          // });
          that.setData({
            imgStatus: true
          });
          // console.log(that.data.tempFilePath);
        }
      }
    }); 
  },
  //开始绘画
  startCanvas: function (bgImg,resolve) {
    // bgImg：背景图片
    var that = this;
    const ctx = wx.createCanvasContext('notes');
    ctx.clearRect(0, 0, 0, 0);
    const WIDTH = 840;
    const HEIGHT = 1494;
    //  绘制图片模板的 底图
    ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);
    // ctx.drawImage(arr2[1], 20, 20, 200,200);

    ctx.save();
    let r = 100;
    let d = r * 2;
    let cx = 320;
    let cy = 200;
    ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.data.head_img, cx, cy, d, d);
    ctx.restore();

    ctx.setTextAlign('center')
    ctx.setFontSize(50);
    ctx.fillText(`${this.data.nickName} 同学`, 420, 500);
    ctx.setFontSize(60);
    ctx.setFillStyle('rgba(255,100,97,.85)');
    ctx.fillText(`GPA:${this.data.accountTotal}`, 420, 600);
    ctx.setFillStyle('rgba(47,79,79,.85)');
    ctx.setFontSize(33);
    ctx.fillText(`已获总学分：${this.data.allCredits}`, 420, 650);
    ctx.setFillStyle('rgba(107,9,130,.85)');
    ctx.setFontSize(42);
    ctx.fillText(`你的成绩超越了${this.data.percent}%的同学`, 420, 750);
    ctx.setFillStyle('rgba(48,22,232,.3)');
    // ctx.setFontSize(33);
    ctx.fillText(`${this.data.lastContent}`, 420, 815);

    ctx.setTextAlign('left')
    ctx.setFontSize(38);
    ctx.setFillStyle('rgba(34,34,34,.64)')

    ctx.fillText('长按小程序码', 340, 1350);
    ctx.setFontSize(25);
    ctx.fillText(`获取属于你的学业状态报告`, 340, 1400);
    ctx.draw();
    that.buildCanvasImg(resolve);
  },
  //开始将绘画保存到本地
  buildCanvasImg: function (resolve) {
    var that = this;
    setTimeout(function () {
      wx.canvasToTempFilePath({
        width: 840,
        height: 1494,
        canvasId: 'notes',
        fileType: 'png',
        quality: 1,
        success: function (res) {
          let tempFilePath = res.tempFilePath;

          // console.log(res);
          that.setData({
            tempFilePath: tempFilePath
          });
          resolve({ status: true });

        }
      })
    }, 500);



  },
  //保存生成的图片
  saveCanvasImg: function () {
    let tempFilePath = this.data.tempFilePath;
    console.log(tempFilePath);

    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(res) {
        wx.hideLoading();
        wx.showToast({
          title: '保存成功',
        });
      },
      fail() {
        wx.hideLoading()
      }
    })
  },
  hideCanvasImg:function(e){
    if (e.target.id =="hideCanvasImg"){
      this.setData({
        imgStatus: false
      }); 
    }
    
  },
  getImg:function(e) {
    var that=this;
    wx.getSetting({  // 获取用户设置
      success:(res)=> {
        if (!res.authSetting['scope.writePhotosAlbum']) {  // 如果用户之前拒绝了授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success:(res)=>{
              wx.showLoading({
                  title: '正在生成...',
                });
              that.createImgs();
            }
          });
          // wx.openSetting({
          //   success:(tag)=> {
          //     if (tag.authSetting["scope.writePhotosAlbum"]) {  // 用户在设置页选择同意授权
          //       wx.showLoading({
          //         title: '正在生成...',
          //       });
          //       that.createImgs();
          //     }
          //   }
          // });
        } else {   //  用户已经授权
          wx.showLoading({
            title: '正在生成...',
          });
          that.createImgs();
        }
      }
    });
 }
});