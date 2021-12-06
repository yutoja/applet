import rques from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
   day:'',
   month:'',
   liebiao:null
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
    if(!value){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
      wx.reLaunch({
        url: '/pages/dangru/dengru',
      })
        }
      })
    }
   this.setData({
     day:new Date().getDate(),
     month:new Date().getMonth()+1
   })
   
   let a = await rques(`/recommend/songs?cookie=${value}`)
  this.setData({
    liebiao:a.data
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