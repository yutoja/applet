import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    userid:0,
    dan:null,
    like:null
  },
  guangbi(){
    wx.showModal({
      content: "是否退出登录",
      success:async (res) => {
        if (res.confirm) {
       const a = await request('/logout')
       if(a.code==200){
        wx.removeStorageSync('user')
        wx.removeStorageSync('co')
        wx.reLaunch({
          url: '/pages/index/index'
        })
       }
        }
      }
    })
   
  },
  skp(e){
    wx.navigateTo({
      url: `../xiangqi/xiangqi?id=${e.currentTarget.id}&type=playlist`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    try{
    let value = wx.getStorageSync('user')
    let da = JSON.parse(value)
    this.setData({
      user:da,
      userid:da.account.id
    })
    }catch{
      wx.reLaunch({
      url: '/pages/dangru/dengru'
    })
    }
    const dan = await request(`/user/playlist?uid=${this.data.userid}`)
    this.setData({
      like:dan.playlist.splice(0,1),
      dan:dan.playlist
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