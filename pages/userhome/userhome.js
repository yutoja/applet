import re from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    create: null,
    chenbi: null,
    user: null,
    ids: null,
    index: 0,
    dotai: null,
    height:0,
    tab:['.userzhu','.qwer'],
    likes:[],
  },
  xinqi(e){
     wx.navigateTo({
       url: "/pages/dynamic/dynamic",
       success: res=> {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', this.data.dotai[e.currentTarget.id])
      }
     })
  },
  // 跳转
  skp(e){
    wx.navigateTo({
      url: `../xiangqi/xiangqi?id=${e.currentTarget.id}&type=playlist`,
    })
  },
  // 点赞
  dianz(e){
    let k =Number(e.currentTarget.id)
  re(`/resource/like?t=${k}&type=6&threadId=${ e.currentTarget.id}`).then(value=>{
  })
  },
  // tab点击时赋值
  chang(e) {
    let a = e.detail.current
    this.setData({
      index: a
    })
    switch (a) {
      case 1:
        if(this.data.dotai) return
        let value = wx.getStorageSync('co')
        re(`/user/event?uid=${this.data.user.profile.userId}&cookie=${value}`).then(value => {
          let u = value.events.map(value => {
            value.json = JSON.parse(value.json)
            return value
          })
          let like = u.filter(value=>value.info.liked==true)
          this.setData({
            likes:[...this.data.likes,...like],
            dotai: u
          })
          this.fun()
        })
        break;
    }
  },
  // tab切换时赋值
  qie(e) {
    this.setData({
      index: e.currentTarget.id
    })
    this.fun()
  },
  // 设置tab高度
  fun() {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    var that =  this;
    let cal = that.data.tab[that.data.index]
   
    query.select(cal).boundingClientRect(
      function (rect) {
        if(rect.height){
          that.setData({
          height: rect.height*2 +'rpx'
        })
        }
      }).exec();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let value = wx.getStorageSync('co')
    // 获取用户信息
    re(`/user/detail?uid=${options.id}&cookie=${value}`)
      .then(value => {
        this.setData({
          user: value
        })
      })
      .catch(() => {
        alert('很抱歉，你要查找的网页找不到')
      })
    // 获取用户创建或收藏
    re(`/user/playlist?uid=${options.id}&cookie=${value}`).then(value => {
      this.setData({
        create: value.playlist.filter(value => value.creator.userId == 6281318440),
        chenbi: value.playlist.filter(value => value.creator.userId != 6281318440)
      })
             // 初始化加载高度
             this.fun()
    })
    re(`/likelist?uid=${options.id}&cookie=${value}`).then(value => {
      this.setData({
        ids: value.ids
      })
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