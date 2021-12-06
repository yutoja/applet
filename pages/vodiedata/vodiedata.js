import requ from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
   vedioId:"",// 当前的视频id
   vediodata:[],// 视频基本数据
   show:false,// 播放按钮是否显示
   vediobi:0,// 播放进度
   vedioUrl:[],// 视频url地址
   index:0,// 当前视频的次序
   deail:{}, // 视频评论
   puix:false,// 控制评论是否弹出
   gee:'hot', // 评论类型
   veji:true // 进度条是否改变
  },
  move(e){
    if(!this.data.veji){
    
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.ravedio').boundingClientRect(
      function (rect) {
        that.setData({
           vediobi:e.touches[0].clientX/rect.width*100
        })
      }).exec();
    }
  },
  chend(){
    const ve = wx.createVideoContext('vedo'+this.data.index)
    let time= this.data.vediodata[this.data.index].durationms/1000
    ve.seek(this.data.vediobi*time/100)
    this.setData({
      veji:true
    })
  },
  start(){
    this.setData({
      veji:false
    })
  },
  seek(e){
   const ve = wx.createVideoContext('vedo'+this.data.index)
         //创建节点选择器
         var query = wx.createSelectorQuery();
         //选择id
         var that = this;
    let time= this.data.vediodata[this.data.index].durationms/1000
         query.select('.ravedio').boundingClientRect(
           function (rect) {
             ve.seek(e.detail.x/rect.width*time)
             that.setData({
                vediobi:e.detail.x/rect.width*100
             })
           }).exec();
  },
  girr(e){
    this.setData({
      gee:e.target.id
    })
    },
  // 点击播放
  vedioname(){
    const vedio = wx.createVideoContext('vedo'+this.data.index)
    vedio.play()
  },
  // 视频暂停事件函数
  pause(){
    this.setData({
      show:false
    })
  },
// 视频暂停
  zhant(){
   if(this.data.show){
    const vedio = wx.createVideoContext('vedo'+this.data.index)
    vedio.pause()
   }
  },
  // 视频播放进度
  update(e){
    if(!this.data.veji) return
  this.setData({
    vediobi:e.detail.currentTime/e.detail.duration*100
  })
  },
  // vedio播放
  play(){
    this.setData({
      show:true
    })
  },
  eghage(){
    this.setData({
      puix:false
    })
  },
  // 切换视频
 async change(e){
if(e.detail.current==this.data.index) return
   // 关闭之前视频
   this.zhant()
  let a =  this.data.vedioUrl[e.detail.current].id
  this.setData({
    index:e.detail.current,
    vediobi:0,
    vedioId:a,
  })
  // 播放当前视频
  this.vedioname()
  // 如果不是最后一个不加载
   if(e.detail.current<this.data.vedioUrl.length-1) return
   let cookie =  wx.getStorageSync('co')
   const dat = await requ('/related/allvideo',{id:a,cookie})
    this.vedata(dat.data[0].vid,dat.data[0].type)
  },
  // 获取评论数据
async getpilu(id){
  let as =this.data.deail[id]
 const {comments,hotComments} = await requ('/comment/video',{id,offset:as?as.xin.length:0})
 if(!this.data.deail[id]){
  this.data.deail[id] = {
    xin:comments,
    hot:hotComments
  }
 }else{
  comments?as.xin.push(...comments):''
 hotComments?as.hot.push(...hotComments):''
 }
 this.setData({
  deail:this.data.deail
 })
  },
  lower(){
   this.getpilu(this.data.vedioId)
  },
  // 评论弹出
  puxi(){
   this.setData({
     puix:true
   })
   this.getpilu(this.data.vedioId)
  },
  xiqu(){
    this.setData({
      puix:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.loadd()

  },
loadd(){
  const eventChannel = this.getOpenerEventChannel()
  eventChannel.on("vedio",async data=>{
    let cookie =  wx.getStorageSync('co')
    const dat = await requ('/related/allvideo',{id:data.id,cookie})
    await this.vedata(data.id,data.type)
    await  this.vedata(dat.data[0].vid,dat.data[0].type)
    let a =  this.data.vedioUrl[0].id
    this.setData({
     vedioId:a
    })
  })
},
// 获取视频的一系列数据
async vedata(data,type){
  let bu = type?'video':'mv'
  let ve = type?'id':'mvid'
  let v = type?'vid':'mvid'
    // 获取视频详情
    const dat = await requ(`/${bu}/detail`,{[ve]:data})
    // 获取视频地址
    const src = await requ(`/${bu}/url`,{id:data})
    // 获取视频基本信息
    const ss = await requ(`/${bu}/detail/info`,{[v]:data})
    dat.data.pp = ss
    this.data.vediodata.push(dat.data)
    type?this.data.vedioUrl.push(src.urls[0]):this.data.vedioUrl.push(src.data)
     this.setData({
       vediodata:this.data.vediodata,
       vedioUrl:this.data.vedioUrl
     })
},
skp(e){
  wx.navigateTo({
    url: `../userhome/userhome?id=${e.currentTarget.id}`,
  })
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

  }
})