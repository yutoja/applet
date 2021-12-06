import requ from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ping:{
    hot:null,
    xin:null,
    },
    gee:'hot',
    qun:null
  },
  skp(e){
    wx.navigateTo({
      url: `../userhome/userhome?id=${e.currentTarget.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let value = wx.getStorageSync('co')
    let as
    switch(options.type){
      case 'music':
        as = await requ(`/song/detail?ids=${options.id}&cookie=${value}`)
        this.setData({
          qun:as.songs,
        })
    break;
      case 'playlist':
        as = await requ(`/playlist/detail?id=${options.id}&s=-1&cookie=${value}`)
        this.setData({
          qun:as.playlist,
        })
       break;
    }
    let {comments,hotComments} = await requ(`/comment/${options.type}?id=${options.id}&limit=20&cookie=${value}`)
    this.setData({
      ping:{
        hot:hotComments,
        xin:comments,
        },
    })
  },
girr(e){
this.setData({
  gee:e.target.id
})
},
skppp(e){
  wx.navigateTo({
    url: `../userhome/userhome?id=${e.currentTarget.id}`,
  })
},
xiala(){
  console.log(9)
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