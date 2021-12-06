import request from "../../utils/request"
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
     list:null
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
     let {banners} = await request('/banner')
  let {result} = await request('/personalized?limit=8')
   this.setData({
   banners,
   result
 })
 let list = (await request('/toplist')).list.slice(0,3)
 list.forEach(async element => {
  let data =  await request(`/playlist/detail?id=${element.id}&s=-1`)
   element.data = data.playlist.tracks.splice(0, 3)
   this.setData({
      list
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