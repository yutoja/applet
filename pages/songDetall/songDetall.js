import rques from '../../utils/request'
import data from '../../utils/data'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isplay: false,
    dat: null,
    src: null,
    music: null,
    startTime: '00:00',
    currentTime: '00:00',
    sc: 0,
    mov: true,
    pir: false,
    gezi: null,
    inde: 0,
    tigge: false,
    list: null,
    // 循环播放
    inco: ['icon-24gl-repeatOnce2', 'icon-24gl-repeat2', 'icon-xunhuanbofang'],
    zin: 0,
    tishi: ['单曲循环', '列表循环', '随机播放'],
    tidi: false,
    music: null
  },
  // 切换播放模式
  ino() {
    clearInterval(this.inter)
    let b = ++this.data.zin > 2 ? 0 : this.data.zin
    wx.setStorage({
      key: "zin",
      data: b
    })
    this.setData({
      zin: b,
      tidi: true
    })
    this.inter = setTimeout(() => {
      this.setData({
        tidi: false
      })
    }, 2000)
  },
  // 切换播放模式
  tigge() {
    this.setData({
      tigge: !this.data.tigge
    })
  },
  async xiao(e) {
    if (data.list.length < 2) {
      wx.showToast({
        title: '想要原地打转吗',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    let index = data.list.findIndex(value => value.id == this.data.src.id)
    if (e.target.id == 'left') {
      index--
      index = index < 0 ? data.list.length - 1 : index
    } else {
      index++
      index = index >= data.list.length ? 0 : index
    }
    await this.getmusic(data.list[index].id)
    app.muaic.song = data.list[index]
    this.setData({
      songs: data.list[index]
    })
    this.musicName(this.data.dat[0].name, this.data.src.url)
  },
  // 歌词显示
  zi() {
    this.setData({
      pir: !this.data.pir
    })
    if (!this.data.gezi) {
      this.gezi(this.data.src.id)
    }
  },
  // 获取歌词
  async gezi(id) {
    try {
      const data = await rques(`/lyric?id=${id}`)
      let lyric = data.lrc.lyric
      const re = /\[([^\]]+)\]([^[]+)/g
      var result = []
      lyric.replace(re, ($0, $1, $2) => {
        result.push({
          time: this.formatTimeToSec($1),
          lyri: $2
        })
      })
      this.setData({
        gezi: result
      })

    } catch (err) {}
  },
  // 将歌词转换为数组
  formatTimeToSec(value) {
    const a = value.split(':')
    return parseFloat(a[0] * 60) + parseFloat((a[1] * 1).toFixed(1))
  },
  // 音乐播放/暂停
  rout(e, time) {
    if (!this.data.src) {
      wx.showToast({
        title: '还没加载完',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    if (time && this.data.isplay) {
      this.setData({
        isplay: true
      })
    } else {
      this.setData({
        isplay: !this.data.isplay
      })
    }
    const music = wx.getBackgroundAudioManager()
    if (music.src != this.data.src.url) {
      this.musicName(this.data.dat[0].name, this.data.src.url, time)
      
      this.setData({
        music: this.data.src.id
      })
      app.muaic.song = this.data.dat[0]
    } else if (!this.data.isplay) {
      music.pause()
    } else {
      time ? music.seek(time) : ''
      music.play()
    }
  },
  // 设置音乐
  musicName(name, src, time) {
    const music = wx.getBackgroundAudioManager()
    music.title = name
    music.src = src
    // 设置后台歌曲名称
    wx.setNavigationBarTitle({
      title: name
    })
    data.setlist(...this.data.dat)
    this.setData({
      list: data.list,
      music: this.data.dat[0].id
    })
    app.muaic.musicid = this.data.dat[0].id
    this.gezi(this.data.src.id)
    time ? music.seek(time) : ''
    // 监听音乐的暂停/播放
    music.onPlay(() => {
      this.changmusic(true)
    })
    music.onPause(() => {
      this.changmusic(false)
    })
    music.onStop(() => {
      this.changmusic(false)
    })
    music.onTimeUpdate(() => {
      const fe = parseInt(music.currentTime / 60)
      const miao = parseInt(music.currentTime % 60)
      let sleng = `${fe < 10 ? '0' + fe : fe}:${miao < 10 ? '0' + miao : miao}`
      if (this.data.mov) {
        this.setData({
          currentTime: sleng,
          sc: music.currentTime / music.duration * 100
        })
      }
      if (this.data.pir) {
        var inde = this.data.gezi.findIndex(value => value.time > music.currentTime)
        if (this.data.inde != inde) {
          this.setData({
            inde
          })
        }

      }
    })
    music.onEnded(async () => {
      switch (this.data.zin) {
        case 0:
          this.musicName(this.data.dat[0].name, this.data.src.url, 0)
          music.pause()
          music.play()
          break;
        case 1:
          let index = data.list.findIndex(value => value.id == this.data.src.id) + 1
          index = index >= data.list.length - 1 ? 0 : index
          await this.getmusic(data.list[index].id)
          app.muaic.song = data.list[index]
          this.setData({
            songs: data.list[index]
          })
          this.musicName(this.data.dat[0].name, this.data.src.url)
          break;
        case 2:
          let unm = parseInt(Math.random() * data.list.length)
          await this.getmusic(data.list[unm].id)
          app.muaic.song = data.list[unm]
          this.setData({
            songs: data.list[unm]
          })
          this.musicName(this.data.dat[0].name, this.data.src.url)
          break;
      }
    })
  },
  // 获取音乐资源
  async getmusic(id) {
    const {
      data: [src]
    } = await rques(`/song/url?id=${id}`)
    const as = await rques(`/song/detail?ids=${id}`)
    let dt = this.time(as.songs[0].dt)
    this.setData({
      dat: as.songs,
      src,
      startTime: dt
    })
  },
  // 修改音乐的状态
  changmusic(isplay) {
    app.muaic.isplay = isplay
    this.setData({
      isplay
    })
  },
  // 转换时间
  time(value, tim = 1) {
    const fe = parseInt(value / 60 / 1000 / tim)
    const miao = parseInt(value / 1000 / tim % 60)
    return `${fe < 10 ? '0' + fe : fe}:${miao < 10 ? '0' + miao : miao}`
  },
  // 移动调整歌曲进度
  move(e) {
    if (this.data.mov) return
    clearInterval(this.tim)
   this.tim = setTimeout(() => {
      let a = (e.touches[0].pageX - 63) / 249
      a = a > 1 ? 1 : a
      a = a < 0 ? 0 : a
      let cur = this.time(this.data.dat[0].dt * a)
      this.setData({
        currentTime: cur,
        sc: a * 100,
      })
    }, 1);
  
  },
  //  手弹起调整歌曲进度
  touchend() {
    let music = wx.getBackgroundAudioManager()
    this.rout(0, this.data.sc / 100 * music.duration)
    setTimeout(() => {
      this.setData({
        mov: true
      })
    }, 200)

  },
  // 点击调整歌曲进度
  musictap(e) {
    this.setData({
      mov: false
    })
    let a = (e.touches[0].pageX - 63) / 249
    a = a > 100 ? 100 : a
    a = a < 0 ? 0 : a
    let cur = this.time(this.data.dat[0].dt * a)
    this.setData({
      currentTime: cur,
      sc: a * 100,
    })
  },
  // 跳转评论
  skip(e) {
    wx.navigateTo({
      url: `../comment/comment?id=${e.target.id}&type=music`,
    })
  },
  // 下载
  download() {
    let a = wx.downloadFile({
      url: this.data.src.url,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: res.tempFilePath
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 清除列表中的选中歌曲
  remove(e) {
    data.delectlist(e.detail.id)
    this.setData({
      list: data.list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      music: app.muaic.musicid,
      zin: wx.getStorageSync('zin') || 0
    })
    let a = options.song
    this.setData({
      musicId: a
    })
    let dt = this.time(options.dt)
    // 判断是不是同一首
    if (a == app.muaic.musicid) {
      let as = wx.getBackgroundAudioManager()
      if (app.muaic.isplay) {
        this.changmusic(true)
        const fe = parseInt(as.currentTime / 60)
        const miao = parseInt(as.currentTime % 60)
        let sleng = `${fe < 10 ? '0' + fe : fe}:${miao < 10 ? '0' + miao : miao}`
        this.setData({
          currentTime: sleng,
          sc: as.currentTime / as.duration * 100
        })
      }
    }
    // 获取歌曲详情
    const as = await rques(`/song/detail?ids=${a}`)
    // 设置后台歌曲名称
    wx.setNavigationBarTitle({
      title: as.songs[0].name
    })
    this.setData({
      list: data.list,
      startTime: dt,
      dat: as.songs
    })
    // 获取歌曲地址
    const {
      data: [src]
    } = await rques(`/song/url?id=${a}`)
    this.setData({
      src,
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
    let id = app.muaic.musicid
    const music = wx.getBackgroundAudioManager()
    // 监听音乐的暂停/播放
    music.onPlay(() => {
      this.changmusic(true)
    })
    music.onPause(() => {
      this.changmusic(false)
    })
    music.onStop(() => {
      this.changmusic(false)
    })
    if (id == this.data.musicId) {
      music.onTimeUpdate(() => {
        const fe = parseInt(music.currentTime / 60)
        const miao = parseInt(music.currentTime % 60)
        let sleng = `${fe < 10 ? '0' + fe : fe}:${miao < 10 ? '0' + miao : miao}`
        if (this.data.mov) {
          this.setData({
            currentTime: sleng,
            sc: music.currentTime / music.duration * 100
          })
        }
        if (this.data.pir) {
          var inde = this.data.gezi.findIndex(value => value.time > music.currentTime)
          if (this.data.inde != inde) {
            this.setData({
              inde
            })
          }
        }
      })
    }
    music.onEnded(async () => {
      switch (this.data.zin) {
        case 0:
          this.musicName(this.data.dat[0].name, this.data.src.url, 0)
          music.pause()
          music.play()
          break;
        case 1:
          let index = data.list.findIndex(value => value.id == id) + 1
          index = index >= data.list.length - 1 ? 0 : index
          await this.getmusic(data.list[index].id)
          app.muaic.song = data.list[index]
          this.setData({
            songs: data.list[index]
          })
          this.musicName(this.data.dat[0].name, this.data.src.url)
          break;
        case 2:
          let unm = parseInt(Math.random() * data.list.length)
          await this.getmusic(data.list[unm].id)
          app.muaic.song = data.list[unm]
          this.setData({
            songs: data.list[unm]
          })
          this.musicName(this.data.dat[0].name, this.data.src.url)
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