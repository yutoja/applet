import re from "../../utils/request"
import list from "../../utils/data"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listsongs:null,
    danl:null,
    show:false,
    shwo:false,
    shu:0,
    songs:null,
    isplay:false,
    tigge:false,
    list:null,
    music:null
  },
   // 切换播放模式
   tigge(){
    this.setData({
      tigge:!this.data.tigge
    })
   },
async stop(){
    const music = wx.getBackgroundAudioManager()
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
 async bbfa(e){
   const index = e.currentTarget.id
    const a = await this.getmusic(this.data.danl[index].id)
    this.musicName(a.dat[0].name,a.src.url,a.src.id)
    app.muaic.song = this.data.danl[index]
    list.setlist(this.data.danl[index])
    this.setData({
      songs:this.data.danl[index],
      isplay:true,
      list:list.list,
      music:a.src.id
    })
  },
  // 播放全部歌曲
 async bofa(){
   let as = this.data.danl
    list.list  = [...as]
    const a = await this.getmusic(as[0].id)
    this.musicName(a.dat[0].name,a.src.url,a.src.id)
    app.muaic.song = as[0]
    this.setData({
      isplay:true,
      songs:as[0]
    })
  },
filte(value){
  return value>10000?parseInt(value/10000)+'万':value
},  // 跳转评论
skip(e){
  wx.navigateTo({
    url: `../comment/comment?id=${e.currentTarget.id}&type=playlist`,
  })
},
skp(e){
  wx.navigateTo({
    url: `../userhome/userhome?id=${e.currentTarget.id}`,
  })
},
  // 清除列表中的选中歌曲
  remove(e){
    list.delectlist(e.detail.id)
    this.setData({
      list:list.list
    })
  },
  // 转换时间
  time(value,tim=1){
    const fe = parseInt(value / 60/1000/tim)
    const miao = parseInt(value/1000/tim % 60)
    return `${fe < 10 ? '0' + fe : fe}:${miao < 10 ? '0' + miao : miao}`
  },
  // 设置音乐
  musicName(name,src,id){
    const music = wx.getBackgroundAudioManager()
    music.title = name 
    music.src = src
    // 监听音乐的暂停/播放
    music.onPlay(()=>{
      app.muaic.musicid = id
      app.muaic.isplay=true
    })
    music.onPause(()=>{
      app.muaic.isplay=false
     this.changmusic(false)
    })
    music.onStop(()=>{
      app.muaic.isplay=false
      this.changmusic(false)
    })
    music.onTimeUpdate(()=>{
        const fe = parseInt(music.currentTime / 60)
        const miao = parseInt(music.currentTime % 60)
        let sleng = `${fe < 10 ? '0' + fe : fe}:${miao < 10 ? '0' + miao : miao}`
       if(this.data.mov){
           this.setData({
        currentTime:sleng,
        sc:music.currentTime/music.duration*100
      })
       }
       if(this.data.pir){
        var inde= this.data.gezi.findIndex(value=>value.time>music.currentTime)
        if(this.data.inde!=inde){
          this.setData({
          inde
        })
        }
        
       }
    })
    music.onEnded(async ()=>{
      switch(this.data.zin){
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
            let unm =parseInt(Math.random()*data.list.length)
            const as =  await this.getmusic(list.list[unm].id)
            this.musicName(as.dat[0].name,as.src.url,as.src.id)
          break;
      }
    })
  },
    // 获取音乐资源
    async getmusic(id){
      const {data:[src]} = await re(`/song/url?id=${id}`)
      const as = await re(`/song/detail?ids=${id}`)
      let dt =this.time(as.songs[0].dt) 
      return{
        dat:as.songs,
        src,
        startTime:dt
      }
    },
    // 修改音乐的状态
    changmusic(isplay){
      this.setData({
        isplay
      })
    },
toSongDetail(event){
  let song = event.currentTarget.dataset.song;
  let dt = event.currentTarget.dataset.dt;
  wx.navigateTo({
    url: `/pages/songDetall/songDetall?song=${song}&dt=${dt}`,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let value = wx.getStorageSync('co')
  let {playlist} =await re(`/playlist/detail?id=${options.id}&cookie=${value}`)
  let srr = playlist.trackIds.map(value=>value.id)
  let song;
  let i =0
  let bo = ''
  if(srr.length<21){
    song = playlist.tracks
  }else if(srr.length<300){
      while(i<srr.length){
        if(i==srr.length-1){
          bo=bo+`${srr[i]}`
        }else{
          bo=bo+`${srr[i]},`
        }
        i++
      }
  let {songs} = await re('/song/detail?ids='+bo)   
  song = songs.flat(Infinity)
  }else{
      while(i<parseInt(srr.length/2)){
        if(i==parseInt(srr.length/2)-1){
          bo=bo+`${srr[i]}`
        }else{
          bo=bo+`${srr[i]},`
        }
        i++
      }
  let {songs} = await re('/song/detail?ids='+bo)   
  song = songs.flat(Infinity)
  setTimeout(async ()=>{
  let  i= parseInt(srr.length/2)
   let bo = ''
    while(i<srr.length){
      if(i==srr.length-1){
        bo=bo+`${srr[i]}`
      }else{
        bo=bo+`${srr[i]},`
      }
      i++
    }
    let {songs} = await re('/song/detail?ids='+bo)   
    let son = songs.flat(Infinity)
    const a = [...this.data.danl,...son]
    this.setData({
      danl: a
    })
  },2000)
  }
  this.setData({
    listsongs:playlist,
    danl:song,
    show:true,
    shu:this.filte(playlist.playCount)
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
    this.setData({
     songs:app.muaic.song,
     isplay:app.muaic.isplay,
     list:list.list,
     music:app.muaic.musicid
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