// pages/tools/run/run.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zone:[
      [
        { hour: 6, minute: 50},
        { hour: 7, minute: 10 },
        { hour: 8, minute: 0 },
        { hour: 8, minute: 50 },
        { hour: 11, minute: 40 },
        { hour: 12, minute: 40 },
        { hour: 14, minute: 40 },
        { hour: 19, minute: 0 }
      ],
      [
        { hour: 7, minute: 30 },
        { hour: 10, minute: 30 },
        { hour: 12, minute: 30 },
        { hour: 13, minute: 50 },
        { hour: 16, minute: 10 },
        { hour: 16, minute: 50 },
        { hour: 17, minute: 30 },
        { hour: 18, minute: 10 }
      ]
    ],
    nowtime:{hour:0,minute:0},
    select:0,
    overnum:0


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.select);
    var nowTime=new Date();
    // nowTime.setHours(15);
    // nowTime.setMinutes(11);
    var nowHours=nowTime.getHours();
    var nowMinutes=nowTime.getMinutes();
    var nowtime={hour:nowHours,minute:nowMinutes};
    this.setData({
      nowtime:nowtime
    });
    console.info(this.data.nowtime);
    this.decide(0);
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
      title: '想知道师大校车现在还走么？',
      desc: '谢谢你的分享，让我展现在更多人的视野中',
      path: '/pages/tools/schedule/schedule',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  //select赛罕校区
  select1:function(){
    let select = this.data.select;
    if (select){
      this.setData({
        select: 0
      });
      this.decide(0);
    }else{
      this.setData({
        select: 1
      });
      this.decide(1);
    }

  },
  //盛乐校区
  select2: function () {
      this.setData({
        select: 1
      });
      this.decide(1);


  },
  //判断时间区间
  decide:function(sel){
    var saihan = this.data.zone[sel];
    var oldtime=this.data.nowtime;
    var nowtime=this.getminutes(oldtime.hour,oldtime.minute);
    var starttime = this.getminutes(saihan[0].hour, saihan[0].minute);
    var endtime = this.getminutes(saihan[7].hour, saihan[7].minute);
    console.log(nowtime,starttime,endtime);
    
    
    var num=8;
    if (endtime >= nowtime && nowtime >= starttime){
      //console.log('可以乘车！');
      saihan.forEach((item, index) => {
        var itemtime = this.getminutes(item.hour,item.minute);
        if(nowtime>=itemtime){
          num--;          
        }

      });
      this.setData({
        overnum:num
      })
      //console.log('还有%s趟车',num);

    }else{
      this.setData({
        overnum: 0
      })
      //console.log('不可以乘车！');
    }
    

  },
  //返回分钟数
  getminutes:function(hour,minute){
    return hour*60+minute;

  }

})