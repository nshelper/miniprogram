/*
 * @Description: 
 * @Author: Moqi
 * @Date: 2018-12-12 19:34:24
 * @Email: str@li.cm
 * @Github: https://github.com/strugglerx
 * @LastEditors: Moqi
 * @LastEditTime: 2018-12-14 11:41:55
 */

'use strict'
class Ctx {
    constructor (opt) {
        let windowWidth = wx.getSystemInfoSync().windowWidth;//获取屏幕宽度
        this.select=false;
        let _default = {
            Width:300,
            Height:300,
            Pixel:windowWidth/750,//1rpx=屏幕宽度/750
            Canvas_id:"",
            Img_path:"",
            Bg_scale:"",
        }
        this.opt = Object.assign(_default,opt)
        this.cvsCtx = wx.createCanvasContext(this.opt.Canvas_id);
        this.initBg();
    }
    /**
     * 初始化背景图片 
     */
    initBg() {
        let _backgroundArray=this.calcBackground();
        this._backgroundPosition=[0,0]
        this.cvsCtx.clearRect(0, 0, this.opt.Width*this.opt.Pixel, this.opt.Height*this.opt.Pixel);   
        this.cvsCtx.drawImage(this.opt.Img_path,...this._backgroundPosition,..._backgroundArray);
    }
    /**
     * 移动背景图片
     */
    moveBg(_move=0){
        let Bg_scale=this.opt.Bg_scale;
        this.cvsCtx.clearRect(0, 0, this.opt.Width*this.opt.Pixel, this.opt.Height*this.opt.Pixel);
        let _backgroundArray=this.calcBackground();
        if(Bg_scale<=1) {
            if (0+_move+this._backgroundPosition[1]>=_backgroundArray[0]-_backgroundArray[1]&&_move+this._backgroundPosition[1]<=0){
                this._backgroundPosition[1]+=_move;
                this.cvsCtx.drawImage(this.opt.Img_path,...this._backgroundPosition,..._backgroundArray);
            }else{
                this.cvsCtx.drawImage(this.opt.Img_path,...this._backgroundPosition,..._backgroundArray);
            }   
        }else{
            if (Math.abs(0+_move+this._backgroundPosition[0])<=_backgroundArray[0]-_backgroundArray[1]&&_move+this._backgroundPosition[0]<=0){
                this._backgroundPosition[0]+=_move;
                this.cvsCtx.drawImage(this.opt.Img_path,...this._backgroundPosition,..._backgroundArray);
            }else{
                this.cvsCtx.drawImage(this.opt.Img_path,...this._backgroundPosition,..._backgroundArray);
            }
        } 

    }
    /**
     * 增加项目
     */
    addItem(Img_Path,W,H,b=1) {
        const Pixel=this.opt.Pixel;
        // this.initBg();
        let y=this.opt.Height*this.opt.Pixel/2;
        let x=this.opt.Width*this.opt.Pixel/2;
        this.Item={
            Img_Path,x,y,W,H,b
        }
        this.cvsCtx.save();
        this.cvsCtx.translate(x, y);
        this.cvsCtx.scale(b,b);
        this.cvsCtx.drawImage(Img_Path,-W/2,-H/2,W,H);
        this.cvsCtx.restore();
    }
    /**
     * @description: 改变项目
     * @param {Img_Path} 项目路径
     * @return:void； 
     */
    changeItem(Img_Path){
        this.moveBg();
        let _tempItem = this.Item;
        _tempItem.Img_Path=Img_Path;
        let _item = new Array();
        for (let key in _tempItem){
            _item.push(_tempItem[key]);
        }
        this.drawItem(..._item)
        this.draw();
    }
    /**
     * 重新绘制移动的项目
     */
    drawItem(Img_Path,x,y,W,H,b){
        const Pixel=this.opt.Pixel;
        let Canvas_Width=this.opt.Width*Pixel;
        let Canvas_Height=this.opt.Height*Pixel;
        if (x>-5&&y>-5&&x<Canvas_Width+5&&y<Canvas_Height+5){
            this.Item={
                Img_Path,x,y,W,H,b
            }
        }
        this.cvsCtx.save();
        this.cvsCtx.translate(this.Item.x, this.Item.y);
        this.cvsCtx.scale(b,b);
        this.cvsCtx.drawImage(Img_Path,-W/2,-H/2,W,H);
        this.cvsCtx.restore();
    }
    /**
     * 绘制
     */
    draw() { 
        this.cvsCtx.draw()
    }
    /**
     * 保存图片
     */
    save() {
        return new Promise((resolve,reject) =>{
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                // width: 1000,
                // height: 1000,
                // destWidth: 600,
                // destHeight: 600,
                canvasId: this.opt.Canvas_id,
                fileType: "jpg",
                quality: 1.0,
                success: (result)=>{
                    // console.log(result) 
                    resolve(result.tempFilePath)
                },
                fail: ()=>{},
                complete: ()=>{}
            });
        })

        
    }
    /**
     * 判断触摸开始
     */
    touchStart(e) {
        if(e.touches.length==1){
            let touch = e.touches[0]
            let Item = this.Item
            this._touchStart =touch;
            if (
                touch.x>=Item.x-Item.W/2&&
                touch.x<=Item.x+Item.W/2&&
                touch.y>=Item.y-Item.W/2&&
                touch.y<=Item.y+Item.W/2){
                console.log("focus")
                this.select=true;
            } else{
                this.select=false
            }
        } else{
            let xMove = e.touches[1].x - e.touches[0].x;
            let yMove = e.touches[1].y - e.touches[0].y;
            let distance = Math.sqrt(xMove * xMove + yMove * yMove);
            this._startDistance = distance;
        }
    }
    /**
     * 判断触摸移动
     */
    touchMove(e) {
        if (e.touches.length==1){
            let touch=e.touches[0]
            if (this.select){
                this.moveBg();
                //克隆对象，不要使用let，修改数据原数据也会改变
                let _tempItem = Object.assign({},this.Item);
                _tempItem.x=touch.x;
                _tempItem.y=touch.y;
                let _item = new Array();
                for (let key in _tempItem){
                    _item.push(_tempItem[key]);
                }
                this.drawItem(..._item)
                this.draw();
            } else{
                let _move=this.calcDirection(this._touchStart,touch);
                this.moveBg(0.08*_move);
                let _tempItem = this.Item
                let _item = new Array();
                for (let key in _tempItem){
                    _item.push(_tempItem[key]);
                }
                this.drawItem(..._item)
                this.draw();
            }
        } else{
            if (this.select||true){
                let xMove = e.touches[1].x - e.touches[0].x;
                let yMove = e.touches[1].y - e.touches[0].y;
                let distance = Math.sqrt(xMove * xMove + yMove * yMove);
                let distanceDiff = distance-this._startDistance;
                this.moveBg();
                let _tempItem = this.Item;
                if (this.Item.b+0.005*distanceDiff>=3){
                    this.Item.b=3
                }else if (this.Item.b+0.005*distanceDiff<=0.6){
                    this.Item.b=0.6
                }else{
                    this.Item.b+=0.005*distanceDiff;
                }
                let _item = new Array();
                for (let key in _tempItem){
                    _item.push(_tempItem[key]);
                }
                this.drawItem(..._item)
                this.draw();
            }
        }   
    }
    /**
     * 屏幕移动距离计算
     */
    calcDirection(_touchStart,_touchMove) {
        let Bg_scale=this.opt.Bg_scale;
        if (Bg_scale<1){
            return _touchMove.y-_touchStart.y
        }else {
            return _touchMove.x-_touchStart.x
        }
    }
    /**
     * 计算图片宽高适应屏幕
     */
    calcBackground(){
        let Bg_scale=this.opt.Bg_scale;
        if(Bg_scale<=1) {
            let _width=this.opt.Width*this.opt.Pixel;
            let _height=_width/Bg_scale;
            return [_width,_height]
        }else{
            let _height=this.opt.Height*this.opt.Pixel;
            let _width=_height*Bg_scale;
            return [_width,_height]     
        }
    }
}

export default Ctx

