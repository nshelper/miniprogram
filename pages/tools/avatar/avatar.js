// pages/tools/avatar/avatar.js
import Avatar from "../../../utils/canvasDraw"
var Ctx = null;
const app =  getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarStatus:false,
    avatarPath:"",
    imagePath: "",
    bgScale: 0,
    items:[],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标
      title: '', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2+20 ,   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const items=new Array();
    for(let i=0;i<10;i++){
      items.push(`/images/hats/hat${i}.png`)
    }
    this.setData({
      items:items
    })
    // this.getImageInfo(this.data.avatarUrl)
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

  },
  /**
   * 选择帽子 
   */
  selectHat(e) {
    if(this.data.imagePath){
      let item=e.currentTarget.dataset.index;
      Ctx.changeItem(item);
    }
  },
  /**
   * 绘制图片
   */  
  drawImage(itemPath="/images/hats/hat1.png") {
    Ctx= new Avatar({
      Canvas_id:"avatar",
      Img_path:this.data.imagePath,
      Width:600,
      Height:600,
      Bg_scale:this.data.bgScale
    });
    Ctx.addItem(itemPath,200,200);
    Ctx.draw()
  },
  /**
   * 获取图片信息
   */  
  getImageInfo(path) { 
    var self = this;  
    this.setData({
      avatarStatus:true
    })
    if (typeof path === 'string') {
      wx.getImageInfo({   //  小程序获取图片信息API
        src: path,
        success: function (res) {
          console.log(res)
          let scale=res.width/res.height;
          self.setData({
            bgScale: scale,
            imagePath: res.path,
            avatarStatus:false
          });
          self.drawImage();
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },
  /**
   * 选择本地图片
   */
  chooseImageToLocal() {
    const self =this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.getImageInfo(result.tempFilePaths[0]) 
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  /**
   * 获取用户头像
   */
  getUserAvatar(){
    console.log(app.store)
    if (!app.store.bind) {
      wx.showModal({
        title: '提示',
        content: '未绑定无法获取用户头像！',
        cancelText: '取消',
        confirmText: '绑定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/more/binding'
            });
          } else if (res.cancel) {

          }
        }
      });
    }
    this.setData({
      avatarPath:app.store.avatarUrl
    });
    this.getImageInfo(this.data.avatarPath) 
  },
  touchStart(e){
    Ctx.touchStart(e)

  },
  touchMove(e){
    Ctx.touchMove(e)
  },
  touchEnd(e){

  },
  /**
   * 保存图片 
   */  
  saveCanvasToLocal(){
    console.log("开始保存")
    Ctx.save().then((res)=>{
      wx.previewImage({
        current: res,
        urls: [res],
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      console.log(res)
    })
  }
})