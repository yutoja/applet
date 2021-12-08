import request from "../../utils/request"
import list from "../../utils/data"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
 
  data: {
   //   导航轮播图
     banners:null,
   //   推荐
     dtou:null,
   //   排行榜
     list:null,
     songs:null,
     listt:null,
     isplay:false,
     music:0,
     tigge:false
  },
    // 清除列表中的选中歌曲
    remove(e){
      list.delectlist(e.detail.id)
      this.setData({
        listt:list.list
      })
    },
   // 切换播放模式
   tigge(){
    this.setData({
      tigge:!this.data.tigge
    })
   },
  async stop(){
    const music = wx.getBackgroundAudioManager()
    if(!music.src){
         const a = await this.getmusic(this.data.songs.id)
         this.musicName(a.dat[0].name,a.src.url,a.src.id)
    }
    if(app.muaic.isplay){
    music.pause()
    }else{
    music.play()
    }

setTimeout(()=>{
      this.setData({
      isplay:app.muaic.isplay  
    })
},1)

   
  },
  toSongDetail(event){
    let song = event.currentTarget.dataset.song;
    let dt = event.currentTarget.dataset.dt;
    if(!song) return
    wx.navigateTo({
      url: `/pages/songDetall/songDetall?song=${song}&dt=${dt}`,
    })
  },
  mei(){
    console.log(1)
    wx.redirectTo({
      url: "/pages/recommend/recommend"
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/sos/sos',
    })
  },
  skip(e){
    let dt = e.currentTarget.dataset.dt;
    wx.navigateTo({
      url: `/pages/songDetall/songDetall?song=${e.currentTarget.id}&dt=${dt}`,
    })
  },
  skipp(e){
    wx.navigateTo({
      url: '/pages/destall/destall',
    })
  },
  skp(e){
    wx.navigateTo({
      url: `../xiangqi/xiangqi?id=${e.currentTarget.id}&type=playlist`,
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/sos/sos',
    })
  }
  ,
  paihan(){
    wx.navigateTo({
      url: `/pages/list/list`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let listdata = wx.getStorageSync('listdata')
    let song = wx.getStorageSync('song')
    listdata.forEach(value=>{
      list.setlist(value)
    })
    app.muaic['song'] = song
    app.muaic.musicid = song.id
     let {banners} = await request('/banner')
  let {result} = await request('/personalized?limit=8')
   this.setData({
   banners,
   result
 })
 let listr = (await request('/toplist')).list.slice(0,3)
 listr.forEach(async element => {
  let data =  await request(`/playlist/detail?id=${element.id}&s=-1`)
   element.data = data.playlist.tracks.splice(0, 3)
   this.setData({
      list:listr
   }) 
    })
  },
  // 转换时间
  time(value,tim=1){
    const fe = parseInt(value / 60/1000/tim)
    const miao = parseInt(value/1000/tim % 60)
    return `${fe < 10 ? '0' + fe : fe}:${miao < 10 ? '0' + miao : miao}`
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 修改音乐的状态
  changmusic(isplay){
    app.muaic.isplay=isplay
    this.setData({
      isplay
    })
  },
  // 获取音乐资源
  async getmusic(id){
    const {data:[src]} = await request(`/song/url?id=${id}`)
    const as = await request(`/song/detail?ids=${id}`)
    let dt =this.time(as.songs[0].dt) 
    return{
      dat:as.songs,
      src,
      startTime:dt
    }
  },
    // 设置音乐
    musicName(name,src,id){
      const music = wx.getBackgroundAudioManager()
      music.title = name 
      music.src = src
      app.muaic.musicid = id
      this.setData({
        music:id
      })
      // 监听音乐的暂停/播放
      music.onPlay(()=>{
        this.changmusic(true)
      })
      music.onPause(()=>{
       this.changmusic(false)
      })
      music.onStop(()=>{
        this.changmusic(false)
      })
      music.onEnded(async ()=>{
        let value = wx.getStorageSync('zin')
        switch(value){
          case 0: 
          this.musicName(name,src,id)
          music.pause()
          music.play()
          break;
          case 1:
             let index =  list.list.findIndex(value=>value.id==id)+1
             index= index >= list.list.length-1 ? 0 : index
             app.muaic.song = list.list[index]
             this.setData({
               songs:list.list[index]
             })
           const a =  await this.getmusic(list.list[index].id)
           this.musicName(a.dat[0].name,a.src.url,a.src.id)
            break;
          case 2:
              let unm =parseInt(Math.random()*list.list.length)
              const as =  await this.getmusic(list.list[unm].id)
              this.musicName(as.dat[0].name,as.src.url,as.src.id)
            break;
        }
      })
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      songs:app.muaic['song'],
      isplay:app.muaic.isplay,
      listt:list.list,
      music:app.muaic.musicid
     })
     let id =app.muaic.musicid
     const music = wx.getBackgroundAudioManager()
    // 监听音乐的暂停/播放
    music.onPlay(()=>{
      this.changmusic(true)
    })
    music.onPause(()=>{
     this.changmusic(false)
    })
    music.onStop(()=>{
      this.changmusic(false)
    })
    music.onEnded(async ()=>{
      let value = wx.getStorageSync('zin')
      switch(value){
        case 0: 
        this.musicName(name,src,id)
        music.pause()
        music.play()
        break;
        case 1:
           let index =  list.list.findIndex(value=>value.id==id)+1
           index= index >= list.list.length-1 ? 0 : index
           app.muaic.song = list.list[index]
           this.setData({
             songs:list.list[index]
           })
         const a =  await this.getmusic(list.list[index].id)
         this.musicName(a.dat[0].name,a.src.url,a.src.id)
          break;
        case 2:
            let unm =parseInt(Math.random()*list.list.length)
            const as =  await this.getmusic(list.list[unm].id)
            this.musicName(as.dat[0].name,as.src.url,as.src.id)
          break;
      }
    })
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