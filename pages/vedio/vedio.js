import requ from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    index: 0,
    navId: '',
    videodata: {},
    height: 0,
    loadlist: []
  },
  // tab点击时赋值
  async chang(e) {
    let nav = this.data.videoGroupList[this.data.index].id
    if (!this.data.videodata[nav]) {
      // 获取当前导航数据
      this.navdatas(nav)
    }
    let a = e.detail.current
    this.setData({
      index: a,
      navId: nav
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  finsh() {
    
    this.fun()
  },
  async scroll(e) {
    let than = this
    // 当前刷新歌单类型
    let nav = this.data.videoGroupList[this.data.index].id
    // 判断要加载的歌单是否正在加载
    if (!this.data.loadlist.includes(nav)) {
      // 标记加载歌单
      this.data.loadlist.push(nav)
      // 获取最新数据
      let cookie = wx.getStorageSync('co')
      let vaue = await requ('/video/group', {
        id: nav,
        offset: this.data.videodata[nav].length,
        cookie
      })
      if (vaue.code == 500) {
        wx.showToast({
          title: "被掏空了。。。",
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return
      }
      than.data.videodata[nav].push(...vaue.datas)
      // 去除加载完的歌单并添加新数据
      than.setData({
        videodata: this.data.videodata,
        loadlist: this.data.loadlist.filter(value => value != nav)
      })
      than.fun()
    }
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
        if (rect.height) {
          that.setData({
            height: rect.height * 2 + 'rpx'
          })
        }

      }).exec();
  },
  // 跳转视频页面
  skip(e) {
    wx.navigateTo({
      url: "/pages/vodiedata/vodiedata",
      success: res => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('vedio', {
          id: e.currentTarget.id,
          type: 1
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取导航数据
    await this.navlist()
    // 获取当前导航数据
    this.navdatas(this.data.navId)
  },
  // 获取导航数据
  async navlist() {
    let {
      data
    } = await requ("/video/group/list")
    this.setData({
      videoGroupList: data.slice(0, 14),
      navId: data[0].id
    })
  },
  // 获取当前导航数据
  async navdatas(navId) {
    let cookie = wx.getStorageSync('co')
    if(!cookie){
      wx.reLaunch({
        url:'/pages/dangru/dengru'
      })
    }
    let videodata = await requ('/video/group', {
      id: navId,
      cookie
    })
    this.data.videodata[navId] = videodata.datas
    this.setData({
      videodata: this.data.videodata
    })
    this.fun()
  },
  tigindex(e) {
    this.setData({
      index: e.currentTarget.dataset.index
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