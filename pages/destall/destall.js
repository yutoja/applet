import re from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 歌单
    songs: null,
    tab: [".item1"],
    // 表示几号轮播
    index: 0,
    // 轮播类型
    navtab: ["官方", "华语", "流行", "怀旧", "摇滚", "民谣", "电子", "华语", "舞曲", "说唱"],
    // 正在加载的歌单
    loadlist: []
  },
  // tab点击时赋值
  async chang(e) {
    let a = e.detail.current
    this.setData({
      index: a
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
     let nav = this.data.navtab[this.data.index]
    if (!this.data.songs[nav]) {
      let vaue = await re(`/top/playlist?limit=36&cat=${nav}`)
      this.data.songs[nav] = {
        data: vaue.playlists,
        quantity: 0
      }
      this.setData({
        songs: this.data.songs
      })
    }
    this.fun()
  },
  // tab切换时赋值
  async qie(e) {
    this.setData({
      index: e.currentTarget.id
    })
  },
  // 设置tab高度
  fun() {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    let cal = '.emif' + that.data.index

    query.select(cal).boundingClientRect(
      function (rect) {
        that.setData({
          height: rect.height * 2 + 'rpx'
        })
      }).exec();
  },
  async scroll(e) {
    let than = this
    // 当前刷新歌单类型
    let nav = this.data.navtab[this.data.index]
    // 判断要加载的歌单是否正在加载
    if (!this.data.loadlist.includes(nav)) {
      // 标记加载歌单
      this.data.loadlist.push(nav)
        // 获取最新数据
        let vaue = await re(`/top/playlist?limit=36&cat=${nav}&offset=${(++this.data.songs[nav].quantity)*36}`)
        if(vaue.code==500){
          wx.showToast({
            title: "被掏空了。。。",
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return
        }
        than.data.songs[nav].data.push(...vaue.playlists)
        // 去除加载完的歌单并添加新数据
        than.setData({
          songs: this.data.songs,
          loadlist: this.data.loadlist.filter(value => value != nav)
        })
      than.fun()
    }
  },
    skp(e){
    wx.navigateTo({
      url: `../xiangqi/xiangqi?id=${e.currentTarget.id}&type=playlist`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let a = await re("/top/playlist?limit=36")
    this.setData({
      songs: {
        "官方": {
          data: a.playlists,
          quantity: 0
        }
      }
    })
    this.fun()
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